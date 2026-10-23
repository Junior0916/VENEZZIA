from PIL import Image

def make_outer_bg_transparent(img_path, out_path, bg_color=(247, 247, 247), tolerance=15):
    img = Image.open(img_path).convert('RGBA')
    width, height = img.size
    
    # Simple BFS flood fill from (0,0) to only make the outer connected background transparent
    from collections import deque
    queue = deque([(0, 0), (width-1, 0), (0, height-1), (width-1, height-1)])
    visited = set(queue)
    
    def is_bg(pixel):
        r, g, b, a = pixel
        return (abs(r - bg_color[0]) <= tolerance and 
                abs(g - bg_color[1]) <= tolerance and 
                abs(b - bg_color[2]) <= tolerance)
    
    pixels = img.load()
    to_clear = set()
    
    while queue:
        x, y = queue.popleft()
        if is_bg(pixels[x, y]):
            to_clear.add((x, y))
            for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in visited:
                    visited.add((nx, ny))
                    if is_bg(pixels[nx, ny]):
                        queue.append((nx, ny))
    
    for x, y in to_clear:
        pixels[x, y] = (0, 0, 0, 0)
        
    img.save(out_path)
    print(f"Processed {out_path}: cleared {len(to_clear)} outer background pixels.")

for name in ['visa.png', 'mastercard.png', 'yape.png', 'plin.png']:
    make_outer_bg_transparent(f'frontend/public/payments/{name}', f'frontend/public/payments/{name}')
