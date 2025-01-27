# Python 3 server example
from http.server import BaseHTTPRequestHandler, HTTPServer
import hashlib, os, random, subprocess

hostName = "0.0.0.0"
serverPort = 8082

# TODO - This generates a password and print it for the user. But after
#     writing this I realized that we can't use ntfy's authentication features.
#
#     The new plan is to turn this into the "topics" endpoint that
#     displays info about topics, whatever we decide that info should be.
#     We could also edit the go code (put it in server/stats.go?) but that
#     might get complicated because they should only be available via the
#     Admin API.

class MyServer(BaseHTTPRequestHandler):
    # Right now this is the only endpoint
    def do_GET(self):
        new_password = hashlib.sha256(random.randbytes(100)).hexdigest()
        os.environ['NTFY_PASSWORD'] = new_password

        code = subprocess.call(['ntfy', 'user', 'add', '--ignore-exists', '--role=admin', 'sandstorm'])
        if code != 0:
            raise Exception("ntfy cli error")
        code = subprocess.call(['ntfy', 'user', 'change-pass', 'sandstorm'])
        if code != 0:
            raise Exception("ntfy cli error")

        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()
        self.wfile.write(bytes(new_password, encoding='utf-8'))

if __name__ == "__main__":
    webServer = HTTPServer((hostName, serverPort), MyServer)
    print("Server started http://%s:%s" % (hostName, serverPort))

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    webServer.server_close()
    print("Server stopped.")
