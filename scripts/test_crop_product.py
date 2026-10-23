from PIL import Image

# Let's see the coordinates for card_06 (Box Básico)
img = Image.open('frontend/public/hotwheels_pages/page_06.png').convert('RGB')
w, h = img.size
print(f"Page 6 size: {w}x{h}")

# In page 6, the open box is on the right/center
# Coordinates approximately: x from 0.45*w to 0.95*w, y from 0.18*h to 0.62*h
# Also the closed box is at x from 0.1*w to 0.42*w, y from 0.55*h to 0.77*h
crop_open_box = img.crop((int(0.44 * w), int(0.18 * h), int(0.96 * w), int(0.64 * h)))
crop_open_box.save('frontend/public/hotwheels_pages/test_box6_open.jpg')

# In page 4 (Ramos 2), bouquet is on right
img4 = Image.open('frontend/public/hotwheels_pages/page_04.png').convert('RGB')
w4, h4 = img4.size
crop_bouquet = img4.crop((int(0.44 * w4), int(0.24 * h4), int(0.96 * w4), int(0.74 * h4)))
crop_bouquet.save('frontend/public/hotwheels_pages/test_bouquet4.jpg')

print("Cropped test product images")
