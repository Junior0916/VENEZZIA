import re
import json

with open('canva_hotwheels.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# Let's search for the page IDs that appeared with the fallback URLs
# When we extracted the 21 pages earlier, how did we find them?
# Let's check the earlier script or search for .png URLs in canva_hotwheels.html
urls = re.findall(r'https://[^\s"\'<>]+\.png', html)
print(f"Total png URLs: {len(urls)}")

# In canva_hotwheels.html, let's look for the JSON structure containing pages
# Often it has "pages": [...] or "document": {...}
match = re.search(r'\{"pages":\s*\[', html)
if match:
    print("Found 'pages': [ at", match.start())
else:
    print("No direct 'pages': [ found")

# Let's find any large JSON object
for m in re.finditer(r'JSON\.parse\("([^"]+)"\)', html):
    print("JSON.parse found length:", len(m.group(1)))

# Let's check window.__INITIAL_STATE__ or similar
for m in re.finditer(r'([A-Za-z0-9_]+)\s*=\s*(\{.*?\});', html):
    var_name = m.group(1)
    if any(k in var_name.lower() for k in ['doc', 'data', 'init', 'canva', 'bootstrap']):
        print(f"Found variable {var_name}")
