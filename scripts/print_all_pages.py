import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('canva_hotwheels.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
s5 = scripts[5]
tokens = re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"', s5)

blocks = []
current_block = []
current_title = ""
for i in range(915, 10586):
    t = tokens[i].strip().replace('\\n', '\n')
    if any(t.startswith(prefix) for prefix in ['CATÁLOGO', 'HOT WHEELS', 'BOX', 'RAMO', '¿Cómo hago']):
        if current_block:
            blocks.append((current_title, current_block))
        current_title = ' '.join(t.split())
        current_block = [t]
    else:
        if current_block:
            # exclude raw font styles, canvas vectors, IDs
            if any(t.endswith(ext) for ext in ['.woff', '.woff2', '.ttf', '.otf', 'px', 'em']):
                continue
            if t.startswith('M0') or t.startswith('M2') or t.startswith('M4') or t.startswith('m0') or t.startswith('#') or t.startswith('YA'):
                continue
            if t in ['center', 'normal', 'none', 'disc', 'italic', 'bold', 'undefined', 'A?', 'uppercase', 'BG', 'BH', 'curved', 'outline', 'color', 'thickness', 'BC', 'BD']:
                continue
            if len(t) > 1 and not re.match(r'^[A-Za-z0-9_-]{10,}$', t):
                current_block.append(t)

if current_block:
    blocks.append((current_title, current_block))

for idx, (title, items) in enumerate(blocks):
    print(f"\n==================== PAGE {idx+1}: {title} ====================")
    # clean items
    seen = set()
    for it in items:
        clean_it = ' '.join(it.split())
        if clean_it and clean_it not in seen:
            print(f"  * {clean_it}")
            seen.add(clean_it)
