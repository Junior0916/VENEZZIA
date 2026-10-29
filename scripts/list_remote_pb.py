import urllib.request
import json
import os

url = 'https://admin.venezzia.shop/api/collections/products/records?perPage=50'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode('utf-8'))

print(f"Total items: {len(data.get('items', []))}")
for item in data.get('items', []):
    col_id = item['collectionId']
    rec_id = item['id']
    img = item.get('image', '')
    camp = item.get('campaign', '')
    name = item.get('name', '')
    updated = item.get('updated', '')
    if img:
        img_url = f"https://admin.venezzia.shop/api/files/{col_id}/{rec_id}/{img}"
    else:
        img_url = "NO_IMAGE"
    print(f"[{camp.upper()}] {name} ({rec_id}):\n  IMG: {img}\n  URL: {img_url}\n  UPDATED: {updated}\n")
