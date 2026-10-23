import urllib.request
import os

os.makedirs('frontend/public/payments', exist_ok=True)

# 1. First copy the user uploaded logos directly
import shutil
user_dir = 'C:/Users/Usuario/.gemini/antigravity/brain/37695f1c-ce92-4be8-b24c-b0dab6a1c9ad/.user_uploaded'

shutil.copy(f"{user_dir}/media_1792709669507_afd5390e.png", "frontend/public/payments/visa.png")
shutil.copy(f"{user_dir}/media_1792709723869_7d88e6d8.png", "frontend/public/payments/mastercard.png")
shutil.copy(f"{user_dir}/media_1792709742741_64353681.png", "frontend/public/payments/yape.png")
shutil.copy(f"{user_dir}/media_1792709770386_c6f11a9e.png", "frontend/public/payments/plin.png")

print("Copied user provided Visa, Mastercard, Yape, Plin logos successfully!")

# 2. Fetch official BCP, BBVA, Culqi logos
urls = {
    'bcp': 'https://upload.wikimedia.org/wikipedia/commons/4/41/Banco_de_Cr%C3%A9dito_del_Per%C3%BA_logo.svg',
    'bbva': 'https://upload.wikimedia.org/wikipedia/commons/0/05/BBVA_2019.svg',
    'culqi': 'https://culqi.com/static/media/logo-culqi.f950dfbf.svg'
}

for name, u in urls.items():
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = resp.read()
            with open(f"frontend/public/payments/{name}.svg", "wb") as f:
                f.write(data)
            print(f"Downloaded official {name}.svg ({len(data)} bytes)")
    except Exception as e:
        print(f"Fetch {name} failed: {e}")
