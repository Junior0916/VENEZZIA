import os
from PIL import Image

download_dir = 'scripts/downloaded_pb_images'

targets = {
    'wtflhywy1xh62su': 'box_basico_centered',
    'cw4r0vwwapz9bwy': 'box_osita_dormilona_centered',
    'eo4abuk5zt6urst': 'box_kitty_premium_centered',
    '8c29i2ivnaellwc': 'ramo_basico_centered',
    '8ecp42hmvj1g22m': 'ramo_1_chanchita_centered',
    'u1b5w7z3y7t4pmf': 'ramo_2_ovejita_centered',
    '4ldwj93qh60jm1n': 'ramo_3_kitty_centered',
    '8vni5zbd1ktrqm0': 'ramo_premium_lotso_centered'
}

dest_dirs = [
    'frontend/public/products',
    'backend/pb_public/products'
]

TARGET_W = 600
TARGET_H = 750
TARGET_RATIO = TARGET_W / TARGET_H # 0.8

for prefix, base_name in targets.items():
    matching = [f for f in os.listdir(download_dir) if f.startswith(prefix)]
    if not matching:
        print(f"[-] No file found for {prefix} ({base_name})")
        continue
    
    src_file = os.path.join(download_dir, matching[0])
    im = Image.open(src_file)
    w, h = im.size
    
    # Calculate crop box to get 4:5 ratio
    current_ratio = w / h
    if current_ratio < TARGET_RATIO:
        # Image is taller than 4:5 (e.g. 1024x1536)
        new_h = int(w / TARGET_RATIO)
        # Center vertically
        top = (h - new_h) // 2
        bottom = top + new_h
        left = 0
        right = w
    else:
        # Image is wider than 4:5
        new_w = int(h * TARGET_RATIO)
        left = (w - new_w) // 2
        right = left + new_w
        top = 0
        bottom = h
        
    cropped = im.crop((left, top, right, bottom))
    resized = cropped.resize((TARGET_W, TARGET_H), Image.Resampling.LANCZOS)
    
    for d in dest_dirs:
        os.makedirs(d, exist_ok=True)
        webp_path = os.path.join(d, f"{base_name}.webp")
        jpg_path = os.path.join(d, f"{base_name}.jpg")
        png_path = os.path.join(d, f"{base_name}.png")
        
        # Save high quality WebP
        resized.save(webp_path, "WEBP", quality=88, method=6)
        resized.save(jpg_path, "JPEG", quality=90)
        resized.save(png_path, "PNG")
        
    print(f"[OK] Processed {base_name}: {w}x{h} -> cropped ({left},{top},{right},{bottom}) -> {TARGET_W}x{TARGET_H} WebP/JPG/PNG")
