import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('canva_hotwheels.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

matches = re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"', html)
clean = []
for m in matches:
    if m.startswith('http') or m.startswith('/') or m.startswith('data:') or len(m) > 150 or len(m) < 2:
        continue
    clean.append(m.encode().decode('unicode_escape', errors='ignore'))

# Let's find sequential chunks around 'BOX', 'RAMO', 'HOT WHEELS', 'S/'
for i, item in enumerate(clean):
    if any(k in item for k in ['BOX', 'RAMO', 'HOT WHEELS', 'Incluye', 'S/']):
        surround = clean[max(0, i-5):min(len(clean), i+15)]
        # Filter short noise
        readable = [s.strip().replace('\n', ' ') for s in surround if len(s.strip()) > 1]
        print(f"--- AT INDEX {i} ---")
        print(" -> ".join(readable[:8]))
