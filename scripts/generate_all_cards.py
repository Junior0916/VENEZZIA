from PIL import Image

for page_num in range(2, 21):
    img = Image.open(f'frontend/public/hotwheels_pages/page_{page_num:02d}.png').convert('RGB')
    w, h = img.size
    canvas = Image.new('RGB', (600, 750), (124, 26, 38))
    scaled_w = int(710 * w / h)
    scaled_h = 710
    scaled_img = img.resize((scaled_w, scaled_h), Image.Resampling.LANCZOS)
    canvas.paste(scaled_img, ((600 - scaled_w) // 2, (750 - scaled_h) // 2))
    canvas.save(f'frontend/public/hotwheels_pages/card_{page_num:02d}_full.jpg', quality=95)

print("Generated all cards 2 to 20")
