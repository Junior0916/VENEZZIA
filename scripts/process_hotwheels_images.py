from PIL import Image, ImageEnhance
import os

os.makedirs('frontend/public/products', exist_ok=True)

BG_COLOR = (124, 26, 38)

products_info = [
    {
        "id": "hw-01",
        "slug": "hotwheels-personalizado",
        "page": 2,
        "crop_box": (60, 75, 360, 480),
    },
    {
        "id": "hw-02",
        "slug": "ramo-hotwheels-1",
        "page": 3,
        "crop_box": (205, 145, 365, 370),
    },
    {
        "id": "hw-03",
        "slug": "ramo-hotwheels-2",
        "page": 4,
        "crop_box": (195, 140, 365, 370),
    },
    {
        "id": "hw-04",
        "slug": "ramo-hotwheels-3",
        "page": 5,
        "crop_box": (165, 145, 365, 370),
    },
    {
        "id": "hw-05",
        "slug": "box-basico-hotwheels",
        "page": 6,
        "crop_box": (155, 100, 365, 360),
    },
    {
        "id": "hw-06",
        "slug": "box-cuadro-hotwheels",
        "page": 7,
        "crop_box": (155, 95, 365, 360),
    },
    {
        "id": "hw-07",
        "slug": "box-personalizado-snacks",
        "page": 8,
        "crop_box": (155, 95, 365, 360),
    },
    {
        "id": "hw-08",
        "slug": "box-personalizado-club",
        "page": 9,
        "crop_box": (155, 95, 365, 360),
    },
    {
        "id": "hw-09",
        "slug": "box-toretto-fast-furious",
        "page": 10,
        "crop_box": (155, 95, 365, 360),
    },
    {
        "id": "hw-10",
        "slug": "box-premium-oro-18k",
        "page": 12,
        "crop_box": (165, 95, 365, 360),
    },
    {
        "id": "hw-11",
        "slug": "ramo-stitch-hotwheels",
        "page": 13,
        "crop_box": (145, 95, 365, 355),
    },
    {
        "id": "hw-12",
        "slug": "ramo-clubes-futbol",
        "page": 14,
        "crop_box": (165, 95, 365, 355),
    },
    {
        "id": "hw-13",
        "slug": "ramo-spiderman-hotwheels",
        "page": 16,
        "crop_box": (155, 80, 365, 345),
    },
    {
        "id": "hw-14",
        "slug": "box-superheroes-pilsen",
        "page": 18,
        "crop_box": (165, 80, 368, 275),
    },
    {
        "id": "hw-15",
        "slug": "box-pinguino-lucifer",
        "page": 19,
        "crop_box": (160, 60, 368, 275),
    }
]

for item in products_info:
    page_img_path = f'frontend/public/hotwheels_pages/page_{item["page"]:02d}.png'
    if not os.path.exists(page_img_path):
        continue
    page_img = Image.open(page_img_path).convert('RGB')
    
    # 1. Product Centered Image (600x750)
    crop = page_img.crop(item["crop_box"])
    enhancer = ImageEnhance.Sharpness(crop)
    crop = enhancer.enhance(1.15)
    
    canvas = Image.new('RGB', (600, 750), BG_COLOR)
    
    target_w, target_h = 520, 680
    crop_w, crop_h = crop.size
    scale = min(target_w / crop_w, target_h / crop_h)
    new_w = int(crop_w * scale)
    new_h = int(crop_h * scale)
    scaled_crop = crop.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    paste_x = (600 - new_w) // 2
    paste_y = (750 - new_h) // 2
    canvas.paste(scaled_crop, (paste_x, paste_y))
    
    product_out = f'frontend/public/products/{item["slug"]}_centered.jpg'
    canvas.save(product_out, quality=95)
    
    # 2. Save full catalog card (600x750) for the modal catalog view
    card_canvas = Image.new('RGB', (600, 750), BG_COLOR)
    pw, ph = page_img.size
    scale_card = min(530 / pw, 710 / ph)
    cw = int(pw * scale_card)
    ch = int(ph * scale_card)
    scaled_page = page_img.resize((cw, ch), Image.Resampling.LANCZOS)
    card_canvas.paste(scaled_page, ((600 - cw) // 2, (750 - ch) // 2))
    card_out = f'frontend/public/products/{item["slug"]}_card.jpg'
    card_canvas.save(card_out, quality=95)

print("Generated pixel-perfect Hot Wheels photos successfully!")
