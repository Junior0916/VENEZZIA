from PIL import Image

img18 = Image.open('frontend/public/hotwheels_pages/page_18.png').convert('RGB')
w, h = img18.size

# Page 18:
# Top box (Goku plush + Coca-Cola/Pilsen + snacks)
box18_top = img18.crop((175, 85, 365, 260))
box18_top.save('frontend/public/hotwheels_pages/test_p18_top.jpg')

# Bottom box (Spiderman plush + Pilsen can + snacks)
box18_bottom = img18.crop((175, 275, 365, 485))
box18_bottom.save('frontend/public/hotwheels_pages/test_p18_bottom.jpg')

# Page 19:
img19 = Image.open('frontend/public/hotwheels_pages/page_19.png').convert('RGB')
# Top box (Penguin plush + Coca-Cola + snacks)
box19_top = img19.crop((165, 50, 365, 270))
box19_top.save('frontend/public/hotwheels_pages/test_p19_top.jpg')

# Bottom box (Lucifer / Pig plush + Pilsen can + snacks)
box19_bottom = img19.crop((165, 280, 365, 495))
box19_bottom.save('frontend/public/hotwheels_pages/test_p19_bottom.jpg')

print("Cropped individual boxes for pages 18 and 19")
