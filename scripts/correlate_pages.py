import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('canva_hotwheels.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# Let's search for page markers in s5
# Canva defines pages with "page" or page id or width/height
scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
s5 = scripts[5]

# Let's find occurrences of page dimensions (e.g. 500, 700, 1080, 1920 or similar) or "page" or "id":"PA..."
page_markers = [m.start() for m in re.finditer(r'"id":\s*"(PA[A-Za-z0-9_-]+)"', s5)]
print(f"Found {len(page_markers)} page ID occurrences in s5")

# Let's inspect the tokens between index 900 and 10600 in detail, showing all prices and titles with their relative order
tokens = re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"', s5)

blocks = []
current_block = []
for i in range(915, 10586):
    t = tokens[i].strip().replace('\\n', ' ')
    if any(t.startswith(prefix) for prefix in ['CATÁLOGO', 'HOT WHEELS', 'BOX', 'RAMO', '¿Cómo hago']):
        if current_block:
            blocks.append(current_block)
        current_block = [f"TOKEN {i}: {t}"]
    else:
        if current_block:
            # check if it's price or includes or important text
            if 'S/' in t or 'Incluye:' in t or any(k in t.lower() for k in ['hotweells', 'rosa', 'collar', 'peluche', 'luces', 'bon o bon', 'tarjeta', 'cuadro']):
                current_block.append(f"[{i}] {t}")

if current_block:
    blocks.append(current_block)

print(f"\nTotal blocks identified: {len(blocks)}")
for b_idx, blk in enumerate(blocks):
    print(f"\n--- BLOCK {b_idx + 1} ---")
    for line in blk[:12]:
        print("  ", line)
