#!/usr/bin/env python3
"""Keep SplitsPro booking/checkout routes attached to the current React build."""

from pathlib import Path
import json
import re

ROUTE_HTMLS = (
    Path("book-installation/index.html"),
    Path("secure-installation/index.html"),
)
MANIFEST_PATH = Path("asset-manifest.json")


def harden_route(route_html: Path, fallback_js: str, fallback_css: str) -> None:
    if not route_html.exists():
        raise SystemExit(f"Booking route is missing: {route_html}")

    html = route_html.read_text(encoding="utf-8")

    # Remove direct hashed bundle tags and any previous dynamic loader so each
    # route loads exactly one current bundle.
    html = re.sub(
        r'<script[^>]+src="/static/js/main\.[^"]+\.js"[^>]*></script>',
        "",
        html,
    )
    html = re.sub(
        r'<link[^>]+href="/static/css/main\.[^"]+\.css"[^>]*>',
        "",
        html,
    )
    html = re.sub(
        r'<script data-splitspro-bundle-loader>.*?</script>',
        "",
        html,
        flags=re.DOTALL,
    )

    loader = f"""<script data-splitspro-bundle-loader>
(function(){{
  var fallback={{js:{json.dumps(fallback_js)},css:{json.dumps(fallback_css)}}};
  var attempts=0;
  var loadedCss={{}};

  function addCss(href){{
    if(!href || loadedCss[href]) return;
    loadedCss[href]=true;
    var link=document.createElement("link");
    link.rel="stylesheet";
    link.href=href;
    document.head.appendChild(link);
  }}

  function recover(){{
    if(attempts>=3) return;
    attempts+=1;
    setTimeout(loadLatest,700*attempts);
  }}

  function loadBundle(files){{
    if(!files || !files.js){{
      recover();
      return;
    }}
    addCss(files.css);
    var script=document.createElement("script");
    script.src=files.js;
    script.defer=true;
    script.onerror=recover;
    script.onload=function(){{
      setTimeout(function(){{
        var root=document.getElementById("root");
        if(root && root.childElementCount===0 && !sessionStorage.getItem("splitspro-booking-reload")){{
          sessionStorage.setItem("splitspro-booking-reload","1");
          location.reload();
        }}
      }},3500);
    }};
    document.head.appendChild(script);
  }}

  function loadLatest(){{
    fetch("/asset-manifest.json?booking="+Date.now(),{{cache:"no-store"}})
      .then(function(response){{if(!response.ok)throw new Error("manifest");return response.json();}})
      .then(function(manifest){{
        loadBundle({{js:manifest.files["main.js"]||fallback.js,css:manifest.files["main.css"]||fallback.css}});
      }})
      .catch(function(){{
        if(attempts<2) recover();
        else loadBundle(fallback);
      }});
  }}

  loadLatest();
}})();
</script>"""

    if "</head>" not in html:
        raise SystemExit(f"{route_html} has no </head> tag")

    html = html.replace("</head>", loader + "</head>", 1)
    route_html.write_text(html, encoding="utf-8")

    verified = route_html.read_text(encoding="utf-8")
    required = (
        "data-splitspro-bundle-loader",
        '<div id="root"></div>',
        "splitspro-booking-reload",
        "/asset-manifest.json?booking=",
        fallback_js,
    )
    for marker in required:
        if marker not in verified:
            raise SystemExit(f"{route_html} hardening verification failed: {marker}")


def main() -> None:
    if not MANIFEST_PATH.exists():
        raise SystemExit("Booking asset manifest is missing: asset-manifest.json")

    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    files = manifest.get("files", {})
    fallback_js = files.get("main.js")
    fallback_css = files.get("main.css", "")

    if not fallback_js:
        raise SystemExit("Booking manifest has no main.js")

    for asset in (fallback_js, fallback_css):
        if asset and not Path(asset.lstrip("/")).exists():
            raise SystemExit(f"Booking asset missing: {asset}")

    for route_html in ROUTE_HTMLS:
        harden_route(route_html, fallback_js, fallback_css)

    print(
        "Booking routes hardened against stale bundles: "
        + ", ".join(str(route) for route in ROUTE_HTMLS)
        + f" -> {fallback_js}"
    )


if __name__ == "__main__":
    main()
