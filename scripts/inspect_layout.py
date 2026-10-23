from PIL import Image

# Let's inspect page 3, 4, 6
# Where are the photo, title, and text located?
# We can take vertical slices or look at the structure
img3 = Image.open('frontend/public/hotwheels_pages/page_03.png').convert('RGB')
print(f"Page 3 size: {img3.size}")

# Let's save a crop of the top half, middle, and bottom half to see where the product photo is
# top 60% vs bottom 40%
img3.crop((0, 0, img3.width, int(img3.height * 0.6))).save('frontend/public/hotwheels_pages/test_p3_top.jpg')
img3.crop((0, int(img3.height * 0.4), img3.width, img3.height)).save('frontend/public/hotwheels_pages/test_p3_bottom.jpg')
print("Saved test slices")
