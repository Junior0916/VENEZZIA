from PIL import Image

for page_num in [3, 6, 10, 12]:
    img = Image.open(f'frontend/public/hotwheels_pages/page_{page_num:02d}.png').convert('RGB')
    w, h = img.size
    # Center crop where the product bouquet/box usually is in Canva catalog
    # Let's save 3 crops:
    # 1. Full page centered into 600x750 with background color (124, 26, 38)
    # 2. Upper-middle crop (y from 10% to 70%)
    # 3. Middle crop (y from 20% to 80%)
    
    # 1: Full card centered in 600x750 canvas with #7c1a26 background
    canvas1 = Image.new('RGB', (600, 750), (124, 26, 38))
    # resize page to fit nicely inside 600x750
    # aspect ratio of 376x532 is 0.706; 600x750 is 0.8
    # fit height = 710, width = int(710 * 376 / 532) = 501
    scaled_w = int(710 * w / h)
    scaled_h = 710
    scaled_img = img.resize((scaled_w, scaled_h), Image.Resampling.LANCZOS)
    canvas1.paste(scaled_img, ((600 - scaled_w) // 2, (750 - scaled_h) // 2))
    canvas1.save(f'frontend/public/hotwheels_pages/card_{page_num:02d}_full.jpg', quality=95)

print("Saved card samples")
