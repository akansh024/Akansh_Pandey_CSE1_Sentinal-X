import requests

payload = "<script>alert('xss')</script>"

def scan(base_url, urls):
    vulnerable = []

    for url in urls:
        if '?' not in url:
            continue
        try:
            test_url = url + payload
            res = requests.get(test_url, timeout=5)
            if payload in res.text:
                vulnerable.append(url)
        except:
            continue
    return vulnerable
