from PIL import Image

for name in ['visa.png', 'mastercard.png', 'yape.png', 'plin.png']:
    img = Image.open(f'frontend/public/payments/{name}')
    print(f"{name}: size={img.size}, mode={img.mode}, bbox={img.getbbox()}")
