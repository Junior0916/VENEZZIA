import urllib.request
import re

with open('canva_hotwheels.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

urls = re.findall(r'https://media\.canva\.com/v2/document-image/[^\s"\'<>]+', html)
print(f"Found {len(urls)} media.canva.com URLs")
if urls:
    for u in urls:
        clean_u = u.replace('&amp;', '&')
        wh = re.findall(r'width:\d+|height:\d+', clean_u)
        print("URL dims:", wh)
        # Can we request width:800 / height:1132?
        # Note the hash and csig are tied to width/height! If we change width/height the csig will fail.
        break
