from pathlib import Path


def replace_once(path: Path, old: str, new: str) -> None:
    text = path.read_text(encoding="utf-8")
    if new in text:
        return
    if old not in text:
        raise RuntimeError(f"Expected text not found in {path}")
    path.write_text(text.replace(old, new, 1), encoding="utf-8")


quote_form = Path("src/components/QuoteForm.jsx")
replace_once(
    quote_form,
    'import { submitQuote, uploadPhoto } from "../lib/api";',
    'import { submitQuote, fileToDataUrl } from "../lib/api";',
)
replace_once(
    quote_form,
    '''      let photo_url = "";\n      if (!hidePhoto && photo) {\n        const res = await uploadPhoto(photo);\n        photo_url = res.url;\n      }\n      await submitQuote({ ...form, photo_url });''',
    '''      let photoPayload = {};\n      if (!hidePhoto && photo) {\n        photoPayload = {\n          photo_name: photo.name,\n          photo_type: photo.type,\n          photo_data_url: await fileToDataUrl(photo),\n        };\n      }\n      await submitQuote({ ...form, ...photoPayload });''',
)

public_index = Path("public/index.html")
public_text = public_index.read_text(encoding="utf-8")
config_tag = '        <script src="%PUBLIC_URL%/lead-config.js"></script>\n'
if config_tag not in public_text:
    marker = '        <script src="https://assets.emergent.sh/scripts/emergent-main.js"></script>\n'
    if marker not in public_text:
        raise RuntimeError("Could not find public index script marker")
    public_text = public_text.replace(marker, config_tag + marker, 1)
    public_index.write_text(public_text, encoding="utf-8")

root_index = Path("index.html")
root_text = root_index.read_text(encoding="utf-8")
root_scripts = '<script src="./lead-config.js"></script>\n<script src="./lead-overrides.js"></script>\n'
if root_scripts not in root_text:
    if "</body>" not in root_text:
        raise RuntimeError("Could not find root index body closing tag")
    root_text = root_text.replace("</body>", root_scripts + "</body>", 1)
root_text = root_text.replace(
    "This test site opens your SMS app with the enquiry filled in.",
    "Your enquiry is sent securely to SplitsPro.",
)
root_index.write_text(root_text, encoding="utf-8")

print("Lead routing patches applied")
