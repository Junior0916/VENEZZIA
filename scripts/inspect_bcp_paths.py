with open('frontend/public/payments/bcp.svg', 'r', encoding='utf-8') as f:
    c = f.read()

# Let's see what text or paths are in bcp.svg
import re
paths = re.findall(r'<path[^>]*>', c)
print(f"bcp.svg has {len(paths)} paths")
for p in paths[:5]:
    print(" ", p[:100])
