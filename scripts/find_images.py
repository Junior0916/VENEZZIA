import re

with open('canva_hotwheels.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

matches = re.findall(r'https://[^\s"\'<>]+\.(?:png|jpg|jpeg|webp)', html)
for m in sorted(set(matches)):
    print(m)
