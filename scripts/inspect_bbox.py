from PIL import Image

img = Image.open('frontend/public/hotwheels_pages/page_03.png').convert('RGB')
bg = img.getpixel((5, 5))
print(f"Background color: {bg}")

# Let's find the bounding box of non-background content or photo
# Let's scan rows and columns
non_bg_rows = []
for y in range(img.height):
    row_non_bg = sum(1 for x in range(img.width) if abs(img.getpixel((x, y))[0] - bg[0]) > 30)
    if row_non_bg > 20:
        non_bg_rows.append(y)

print(f"Content vertical span: {min(non_bg_rows)} to {max(non_bg_rows)} (height {img.height})")
