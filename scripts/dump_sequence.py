import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('canva_hotwheels.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# Find the script tag containing the product texts
scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
s5 = scripts[5]

# Find all JSON string literals
tokens = re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"', s5)

# Filter tokens to Spanish text / numbers / labels
interesting = []
for t in tokens:
    # decode escapes
    decoded = t.encode('utf-8', errors='ignore').decode('unicode_escape', errors='ignore')
    stripped = decoded.strip()
    if not stripped:
        continue
    if stripped.startswith('http') or stripped.startswith('/') or stripped.startswith('data:') or stripped.startswith('sha512-'):
        continue
    if len(stripped) < 2 or len(stripped) > 200:
        continue
    # skip font names and css
    if any(stripped.endswith(ext) for ext in ['.woff', '.woff2', '.ttf', '.otf', 'px', 'em']):
        continue
    if stripped in ['center', 'normal', 'none', 'disc', 'italic', 'bold', 'undefined', 'anonymous', 'preload', 'script']:
        continue
    if re.match(r'^[A-Za-z0-9_-]{10,}$', stripped): # random IDs
        continue
    interesting.append(stripped)

print(f"Total filtered tokens: {len(interesting)}")
# Print them with dividers
for item in interesting:
    if 'BOX' in item or 'RAMO' in item or 'HOT WHEELS' in item:
        print("\n==============================")
    print("ITEM:", repr(item))
