import requests
from urllib.parse import urljoin

common_paths = ["/admin", "/admin/login", "/login", "/administrator", "/wp-admin"]

def find_admin_panels(base_url):
    found = []

    for path in common_paths:
        url = urljoin(base_url, path)
        try:
            res = requests.get(url, timeout=5)
            if res.status_code in [200, 401, 403]:
                found.append(url)
        except:
            continue
    return found
