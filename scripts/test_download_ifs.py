import urllib.request
import re

with open('canva_hotwheels.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# Find IFS with width:1200 or width:1536 or width:600
matches = re.findall(r'uri:ifs[^\s"\'<>]+width:(?:1200|1536|1800|600)[^\s"\'<>]*', html)
print(f"Found {len(matches)} large IFS images!")

if matches:
    first = matches[0]
    # url is https://media.canva.com/v2/files/ + first
    full_url = "https://media.canva.com/v2/files/" + first.replace('&amp;', '&')
    print("Trying:", full_url[:120])
    req = urllib.request.Request(full_url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.canva.com/'
    })
    try:
        with urllib.request.urlopen(req) as resp:
            data = resp.read()
            print(f"SUCCESS! Downloaded {len(data)} bytes! Content-type: {resp.headers.get('content-type')}")
            with open('frontend/public/hotwheels_pages/test_ifs.jpg', 'wb') as out_f:
                out_f.write(data)
    except Exception as e:
        print("Failed:", e)
