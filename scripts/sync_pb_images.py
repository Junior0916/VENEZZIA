import urllib.request
import json
import os
import io
from PIL import Image

output_dir = os.path.join(os.path.dirname(__file__), "downloaded_pb_images")
os.makedirs(output_dir, exist_ok=True)

url = 'https://admin.venezzia.shop/api/collections/products/records?perPage=50'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode('utf-8'))

items = data.get('items', [])
print(f"Total items from PocketBase: {len(items)}")

for item in items:
    camp = item.get('campaign', '')
    name = item.get('name', '')
    col_id = item['collectionId']
    rec_id = item['id']
    img_name = item.get('image', '')
    updated = item.get('updated', '')

    if not img_name:
        print(f"[-] {name} has no image")
        continue

    img_url = f"https://admin.venezzia.shop/api/files/{col_id}/{rec_id}/{img_name}"
    save_path = os.path.join(output_dir, f"{rec_id}_{img_name}")

    try:
        img_req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(img_req) as img_resp:
            raw_data = img_resp.read()
            with open(save_path, "wb") as f:
                f.write(raw_data)
            
            im = Image.open(io.BytesIO(raw_data))
            print(f"[+] {name} ({camp}): {im.size[0]}x{im.size[1]} ({im.format}), saved -> {os.path.basename(save_path)}")
    except Exception as e:
        print(f"[!] Error downloading {name}: {e}")
