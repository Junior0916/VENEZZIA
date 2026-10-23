import re

with open('canva_hotwheels.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

ifs = re.findall(r'uri:ifs[^\s"\'<>]+', html)
print(f"Found {len(ifs)} IFS image references:")
for item in sorted(set(ifs)):
    print(" ", item)
