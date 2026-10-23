import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('canva_hotwheels.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
s5 = scripts[5]
tokens = re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"', s5)

start_idx = None
end_idx = None
for i, t in enumerate(tokens):
    if '2026' in t and 'LOGO' in t:
        start_idx = i
    if 'S/15' in t and 'adicional' in t:
        end_idx = i + 50
        break

print(f"Start: {start_idx}, End: {end_idx}")
if start_idx and end_idx:
    for idx in range(start_idx, end_idx):
        t = tokens[idx]
        if any(t.endswith(ext) for ext in ['.woff', '.woff2', '.ttf', '.otf', 'px', 'em']):
            continue
        if len(t) > 1 and not re.match(r'^[A-Za-z0-9_-]{10,}$', t) and not t.startswith('#'):
            print(f"[{idx}] {t.replace(chr(10), ' ')}")
