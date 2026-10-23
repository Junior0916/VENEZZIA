import urllib.request

test_urls = [
    'https://raw.githubusercontent.com/culqi/culqi-php/master/culqi-logo.png',
    'https://raw.githubusercontent.com/culqi/culqi-woocommerce/master/assets/images/logo.png',
    'https://raw.githubusercontent.com/culqi/culqi-magento2/master/view/frontend/web/images/culqi.png',
    'https://integrapagos.com/wp-content/uploads/2021/04/culqi-logo.png'
]

for u in test_urls:
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = resp.read()
            ct = resp.headers.get("content-type")
            print(f"Found: {u} ({len(data)} bytes, {ct})")
            with open('frontend/public/payments/culqi.png', 'wb') as f:
                f.write(data)
            break
    except Exception as e:
        print(f"Failed: {u} -> {e}")
