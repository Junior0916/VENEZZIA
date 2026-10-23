import re

for name in ['bcp.svg', 'bbva.svg', 'culqi.svg']:
    with open(f'frontend/public/payments/{name}', 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    viewbox = re.search(r'viewBox="([^"]+)"', content)
    vb = viewbox.group(1) if viewbox else 'no viewBox'
    print(f"{name}: viewBox={vb}, length={len(content)}")
