"""
Venezzia Detalles - Script de Optimización de Imágenes a WebP
Convierte automáticamente imágenes PNG o JPG de PocketBase a formato WebP ultraligero
sin pérdida perceptible de calidad visual.
"""

import urllib.request
import json
import io
import os
import sys
import time
from PIL import Image

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def optimize_pocketbase_images(base_url, email, password, max_dim=1200, quality=86):
    print(f"\n=======================================================")
    print(f"🚀 Iniciando optimización WebP en: {base_url}")
    print(f"=======================================================")

    # 1. Autenticar como Superusuario
    auth_url = f"{base_url}/api/collections/_superusers/auth-with-password"
    payload = json.dumps({'identity': email, 'password': password}).encode('utf-8')
    req = urllib.request.Request(auth_url, data=payload, headers={'Content-Type': 'application/json', 'User-Agent': 'VenezziaOptimizer/1.0'})

    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            token = json.loads(r.read().decode())['token']
            print("✓ Autenticado exitosamente como Superusuario de PocketBase.")
    except Exception as e:
        print(f"✗ Error al autenticar en {base_url}: {e}")
        return

    # 2. Consultar catálogo de productos
    list_url = f"{base_url}/api/collections/products/records?perPage=100"
    req = urllib.request.Request(list_url, headers={'Authorization': token, 'User-Agent': 'VenezziaOptimizer/1.0'})
    with urllib.request.urlopen(req, timeout=15) as r:
        items = json.loads(r.read().decode()).get('items', [])

    print(f"📦 Total productos en catálogo: {len(items)}")

    total_orig = 0
    total_webp = 0
    converted_count = 0

    for item in items:
        for field_name in ['image', 'catalog_card']:
            img_name = item.get(field_name, '')
            if not img_name:
                continue

            if img_name.lower().endswith('.webp'):
                continue

            cid = item['collectionId']
            rid = item['id']
            download_url = f"{base_url}/api/files/{cid}/{rid}/{img_name}"

            try:
                dl_req = urllib.request.Request(download_url, headers={'User-Agent': 'VenezziaOptimizer/1.0'})
                with urllib.request.urlopen(dl_req, timeout=20) as r:
                    raw_bytes = r.read()

                orig_size = len(raw_bytes)
                total_orig += orig_size

                img = Image.open(io.BytesIO(raw_bytes))
                orig_w, orig_h = img.size

                if max(orig_w, orig_h) > max_dim:
                    ratio = max_dim / max(orig_w, orig_h)
                    new_w = int(orig_w * ratio)
                    new_h = int(orig_h * ratio)
                    img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

                img_mode = 'RGBA' if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info) else 'RGB'
                converted = img.convert(img_mode)
                webp_buf = io.BytesIO()
                converted.save(webp_buf, format='WEBP', quality=quality, method=6)
                webp_bytes = webp_buf.getvalue()
                webp_size = len(webp_bytes)
                total_webp += webp_size

                base_filename = img_name.rsplit('.', 1)[0]
                new_filename = f"{base_filename}.webp"

                boundary = '----WebKitFormBoundaryVenezziaWebP777'
                body = bytearray()
                body.extend(f'--{boundary}\r\n'.encode('utf-8'))
                body.extend(f'Content-Disposition: form-data; name="{field_name}"; filename="{new_filename}"\r\n'.encode('utf-8'))
                body.extend(b'Content-Type: image/webp\r\n\r\n')
                body.extend(webp_bytes)
                body.extend(b'\r\n')
                body.extend(f'--{boundary}--\r\n'.encode('utf-8'))

                patch_url = f"{base_url}/api/collections/products/records/{rid}"
                patch_req = urllib.request.Request(patch_url, data=body, method='PATCH', headers={
                    'Authorization': token,
                    'Content-Type': f'multipart/form-data; boundary={boundary}',
                    'User-Agent': 'VenezziaOptimizer/1.0'
                })

                with urllib.request.urlopen(patch_req, timeout=20) as r:
                    res = json.loads(r.read().decode())
                    savings_pct = (1 - webp_size / orig_size) * 100
                    converted_count += 1
                    print(f" ✓ [{converted_count}] {item['name'][:25]} [{field_name}]: {orig_size/1024:.0f}KB -> {webp_size/1024:.0f}KB (-{savings_pct:.1f}%) | {res[field_name]}")

                time.sleep(0.1)

            except Exception as e:
                print(f" ✗ Error al procesar '{item['name']}' [{field_name}]: {e}")

    print("-------------------------------------------------------")
    print(f"📊 Resumen para {base_url}:")
    print(f"Imágenes convertidas a WebP: {converted_count}")
    if total_orig > 0:
        saved_mb = (total_orig - total_webp) / 1024 / 1024
        print(f"Peso anterior: {total_orig/1024/1024:.2f} MB")
        print(f"Nuevo peso:    {total_webp/1024/1024:.2f} MB")
        print(f"¡Ahorro total!: {saved_mb:.2f} MB (-{(1 - total_webp/total_orig)*100:.1f}%)")
    else:
        print("✨ Todas las imágenes ya estaban 100% optimizadas en formato WebP.")
    print("-------------------------------------------------------\n")

if __name__ == '__main__':
    target = sys.argv[1] if len(sys.argv) > 1 else 'remote'
    if target == 'local':
        optimize_pocketbase_images('http://127.0.0.1:8090', 'venezzia@gmail.com', 'venezzia2026')
    elif target == 'all':
        optimize_pocketbase_images('https://admin.venezzia.shop', 'venezzia@gmail.com', 'venezzia2026')
        optimize_pocketbase_images('http://127.0.0.1:8090', 'venezzia@gmail.com', 'venezzia2026')
    else:
        optimize_pocketbase_images('https://admin.venezzia.shop', 'venezzia@gmail.com', 'venezzia2026')
