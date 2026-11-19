# Nine links a visitor could leave on a note, posted to a running board, then the href each one gets in the page:
#   python3 links.py http://localhost:3000     (Hono: bun run src/index.tsx, in hono/)
#   python3 links.py http://127.0.0.1:8133     (Quillo: quillo run main.qwe --port 8133, in ../app)
# Start each from an empty club.db: the notes are named n0..n8, and their links are found by name.
import re, sys, urllib.parse, urllib.request
url = sys.argv[1].rstrip('/')
LINKS = ["javascript:alert(1)", "JavaScript:alert(1)", " javascript:alert(1)", "java\tscript:alert(1)",
         "data:text/html,<script>alert(1)</script>", "vbscript:msgbox(1)", "https://example.com/", "/trails/2",
         "mailto:ranger@example.com"]
class Stay(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k): return None
post = urllib.request.build_opener(Stay)
for i, link in enumerate(LINKS):
    try: post.open(urllib.request.Request(f'{url}/notes', data=urllib.parse.urlencode({'name': f'n{i}', 'text': 't', 'link': link}).encode()))
    except urllib.error.HTTPError as e:
        if e.code >= 400: raise
html = urllib.request.urlopen(f'{url}/').read().decode()
for href, i in re.findall(r'<a href="([^"]*)">n(\d+)</a>', html):
    print(f"{LINKS[int(i)]!r:44} -> {href}")
