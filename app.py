from flask import Flask, request, jsonify
from Scanner import crawler, sql_scanner, xss_scanner, headers, admin_scanner

app = Flask(__name__)

@app.route('/scan', methods=['POST'])
def scan_site():
    data = request.get_json()
    url = data.get('url')

    if not url or not url.startswith("http"):
        
        return jsonify({"error": "Invalid or missing URL"}), 400

    links = crawler.crawl(url)

    report = {
        "links_found": len(links),
        "sql_injection": sql_scanner.scan(url, links),
        "xss": xss_scanner.scan(url, links),
        "security_headers": headers.check_headers(url),
        "admin_panels": admin_scanner.find_admin_panels(url)
    }

    return jsonify(report)

if __name__ == '__main__':
    app.run(debug=True)
