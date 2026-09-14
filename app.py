from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import unquote, urlparse

BASE = Path(__file__).resolve().parent
PORT = 8000

class SOCIONAVIKHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(BASE), **kwargs)

    def do_GET(self):
        route = unquote(urlparse(self.path).path)
        route_map = {
            '/': '/index.html',
            '/home': '/index.html',
            '/privacy': '/privacy.html',
            '/terms': '/terms.html',
            '/404': '/404.html',
            '/500': '/500.html'
        }

        route = route_map.get(route, route)
        target = Path(BASE) / route.lstrip('/')
        if not target.exists() or not target.is_file():
            self.send_response(404)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            body = (BASE / '404.html').read_text(encoding='utf-8')
            self.send_header('Content-Length', str(len(body.encode('utf-8'))))
            self.end_headers()
            self.wfile.write(body.encode('utf-8'))
            return

        if target.suffix.lower() in {'.jpeg', '.jpg', '.png', '.webp', '.gif', '.svg'}:
            content_type = {
                '.jpeg': 'image/jpeg',
                '.jpg': 'image/jpeg',
                '.png': 'image/png',
                '.webp': 'image/webp',
                '.gif': 'image/gif',
                '.svg': 'image/svg+xml'
            }[target.suffix.lower()]
            data = target.read_bytes()
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.send_header('Content-Length', str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return

        self.path = route
        return super().do_GET()

    def log_message(self, format, *args):
        return

if __name__ == '__main__':
    server = ThreadingHTTPServer(('127.0.0.1', PORT), SOCIONAVIKHandler)
    print(f'Serving SOCIONAVIK on http://127.0.0.1:{PORT}')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nStopping SOCIONAVIK server.')
    finally:
        server.server_close()
