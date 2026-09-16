from typing import Dict, List

from .lead_integrations import _hubspot_request, _hubspot_token


def get_active_owners() -> List[Dict[str, str]]:
    token = _hubspot_token()
    if not token:
        raise RuntimeError("HubSpot is not configured")

    data = _hubspot_request(
        "GET",
        "/crm/v3/owners/",
        token,
        params={"limit": 500, "archived": "false"},
    )
    owners = []
    for item in data.get("results") or []:
        if item.get("archived"):
            continue
        first_name = (item.get("firstName") or "").strip()
        last_name = (item.get("lastName") or "").strip()
        name = " ".join(part for part in [first_name, last_name] if part).strip()
        owners.append(
            {
                "id": str(item.get("id") or ""),
                "name": name or (item.get("email") or "HubSpot user"),
                "email": item.get("email") or "",
            }
        )
    return owners


def owner_name_map() -> Dict[str, str]:
    return {owner["id"]: owner["name"] for owner in get_active_owners() if owner.get("id")}


def assign_client_owner(contact_id: str, owner_id: str) -> None:
    token = _hubspot_token()
    if not token:
        raise RuntimeError("HubSpot is not configured")

    valid_owner_ids = {owner["id"] for owner in get_active_owners()}
    if owner_id not in valid_owner_ids:
        raise ValueError("Unknown HubSpot owner")

    _hubspot_request(
        "PATCH",
        f"/crm/v3/objects/contacts/{contact_id}",
        token,
        json={"properties": {"hubspot_owner_id": owner_id}},
    )


def client_hubspot_url(contact_id: str) -> str:
    portal_id = "443700368"
    return f"https://app.hubspot.com/contacts/{portal_id}/record/0-1/{contact_id}"
