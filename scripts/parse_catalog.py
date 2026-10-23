import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('canva_hotwheels.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
s5 = scripts[5]
tokens = re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"', s5)

start_idx = 915
end_idx = 10586

# Let's collect items that are product names, prices, or inclusions
catalog = []
current_item = {"title": "", "prices": [], "includes": [], "notes": []}

i = start_idx
while i < end_idx:
    t = tokens[i].strip().replace('\\n', '\n')
    
    # Check if price
    price_match = re.search(r'S/\s*\d+', t)
    if price_match and not 'adicional' in t:
        current_item["prices"].append(price_match.group(0).replace(' ', ''))
    
    # Check if title (starts with BOX, RAMO, HOT WHEELS)
    if any(t.startswith(prefix) for prefix in ['BOX', 'RAMO', 'HOT WHEELS']):
        clean_title = ' '.join(t.split())
        print(f"\n>>> FOUND TITLE at {i}: {clean_title}")
    
    # Check if 'Incluye:'
    if 'Incluye:' in t or 'incluye:' in t:
        print(f"--- INCLUYE at {i}: {t}")
        # Next few tokens might have items
        for j in range(1, 10):
            if i + j < end_idx:
                sub = tokens[i+j].strip().replace('\\n', ' ')
                if sub and not sub.startswith('YA') and not sub.startswith('#') and not sub.startswith('M') and len(sub) > 3 and not re.match(r'^[A-Za-z0-9_-]{10,}$', sub) and sub not in ['bold', 'center', 'normal', 'uppercase', 'disc']:
                    print(f"     + {sub}")
    
    i += 1
