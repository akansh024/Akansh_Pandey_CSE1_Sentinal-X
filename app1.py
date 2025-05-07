from flask import Flask, request, jsonify
from flask_cors import CORS
import socket

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Function to perform the port scan
def scan_ports(target, start_port, end_port, timeout):
    open_ports = []
    for port in range(start_port, end_port + 1):
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout / 1000.0)  # Convert timeout to seconds
        result = sock.connect_ex((target, port))
        if result == 0:
            try:
                service = socket.getservbyport(port)
            except:
                service = "Unknown"
            open_ports.append({
                'port': port,
                'status': 'OPEN',
                'service': service,
                'banner': f"Banner info for {port} not fetched (can be extended)"
            })
        sock.close()
    return open_ports

# API endpoint
@app.route('/scan', methods=['POST'])
def scan():
    data = request.json
    target = data.get('target')
    start_port = data.get('start_port')
    end_port = data.get('end_port')
    timeout = data.get('timeout', 1000)

    if not target:
        return jsonify({'error': 'Target is required'}), 400

    try:
        open_ports = scan_ports(target, start_port, end_port, timeout)
        return jsonify({'open_ports': open_ports})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
