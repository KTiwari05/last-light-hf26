"""Local-only HTTP interface for Last Light. Run with Python 3.11+."""

import argparse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
import threading

from story import MODEL, ModelError, SAMPLE_LOG, create_story

ROOT = Path(__file__).parent / "static"
ASSETS = {"/": ("index.html", "text/html"), "/style.css": ("style.css", "text/css"), "/app.js": ("app.js", "text/javascript")}
GENERATION_LOCK = threading.Lock()


class Handler(BaseHTTPRequestHandler):
    def reply(self, status, body, content_type="application/json"):
        if content_type == "application/json":
            body = json.dumps(body).encode()
        self.send_response(status)
        self.send_header("Content-Type", content_type + "; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Content-Security-Policy", "default-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'; img-src 'self' data:; object-src 'none'; frame-ancestors 'none'; base-uri 'none'")
        self.end_headers()
        self.wfile.write(body)

    def valid_host(self):
        host = self.headers.get("Host")
        return host in {f"127.0.0.1:{self.server.server_port}", f"localhost:{self.server.server_port}"}

    def do_GET(self):
        if not self.valid_host():
            return self.reply(403, {"error": "Open Last Light through its localhost address."})
        if self.path == "/api/health":
            return self.reply(200, {"status": "ok", "model": MODEL, "sample_log": SAMPLE_LOG})
        if self.path in ASSETS:
            filename, content_type = ASSETS[self.path]
            return self.reply(200, (ROOT / filename).read_bytes(), content_type)
        self.reply(404, {"error": "Not found."})

    def do_POST(self):
        origin = self.headers.get("Origin")
        if not self.valid_host() or (origin and origin != "http://" + self.headers.get("Host", "")):
            return self.reply(403, {"error": "Use the local Last Light page to create a story."})
        if self.path != "/api/story":
            return self.reply(404, {"error": "Not found."})
        if self.headers.get("Content-Type", "").split(";")[0].strip() != "application/json":
            return self.reply(415, {"error": "Send application/json."})
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if not 0 < length <= 24000:
                return self.reply(413, {"error": "Send a log of up to 6,000 characters."})
            payload = json.loads(self.rfile.read(length))
        except (ValueError, UnicodeError):
            return self.reply(400, {"error": "Send valid JSON."})
        if not GENERATION_LOCK.acquire(blocking=False):
            return self.reply(429, {"error": "A story is already being written. Wait for it to finish."})
        try:
            self.reply(200, create_story(payload))
        except ValueError as error:
            self.reply(400, {"error": str(error)})
        except ModelError as error:
            self.reply(502, {"error": str(error)})
        finally:
            GENERATION_LOCK.release()

    def log_message(self, format, *args):
        # Request bodies (which can contain private logs) are never logged.
        pass


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8767)
    args = parser.parse_args()
    server = ThreadingHTTPServer(("127.0.0.1", args.port), Handler)
    print(f"Last Light: http://127.0.0.1:{args.port}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()
