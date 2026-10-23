for name in ['culqi_brand.svg', 'culqi_new.svg']:
    with open(f'frontend/public/payments/{name}', 'r', encoding='utf-8', errors='ignore') as f:
        c = f.read()
    print(f"=== {name} ({len(c)} bytes) ===")
    print(c[:300])
