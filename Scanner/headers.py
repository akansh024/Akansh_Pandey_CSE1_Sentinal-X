import requests

def check_headers(url):
    try:
        res = requests.get(url, timeout=5)
        headers = res.headers
        issues = []

        if "X-Content-Type-Options" not in headers:
            issues.append("Missing X-Content-Type-Options")
        if "X-Frame-Options" not in headers:
            issues.append("Missing X-Frame-Options")
        if "Content-Security-Policy" not in headers:
            issues.append("Missing Content-Security-Policy")
        return issues
    except:
        return ["Could not check headers."]
