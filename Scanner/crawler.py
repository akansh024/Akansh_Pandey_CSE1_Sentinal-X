import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

def crawl(base_url):
    visited = set()
    to_visit = [base_url]

    while to_visit:
        url = to_visit.pop()
        if url in visited:
            continue
        visited.add(url)

        try:
            res = requests.get(url, timeout=5)
            soup = BeautifulSoup(res.text, 'html.parser')
            for link in soup.find_all('a', href=True):
                full_url = urljoin(base_url, link['href'])
                if base_url in full_url and full_url not in visited:
                    to_visit.append(full_url)
        except Exception:
            continue

    return list(visited)
