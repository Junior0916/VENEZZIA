import re

with open('frontend/public/payments/bcp.svg', 'r', encoding='utf-8') as f:
    c = f.read()

# Look for transform or clipPath
clips = re.findall(r'<rect [^>]+>', c)
for cl in clips:
    print("Clip rect:", cl)

# Find all coordinates
coords = re.findall(r'([+-]?\d+\.?\d*)\s+([+-]?\d+\.?\d*)', c)
xs = [float(x) for x, y in coords if abs(float(x)) < 5000]
ys = [float(y) for x, y in coords if abs(float(y)) < 5000]

print(f"X range: {min(xs)} to {max(xs)}")
print(f"Y range: {min(ys)} to {max(ys)}")
