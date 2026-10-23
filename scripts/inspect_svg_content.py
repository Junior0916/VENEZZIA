import re

with open('frontend/public/payments/bcp.svg', 'r', encoding='utf-8', errors='ignore') as f:
    bcp = f.read()

print("BCP start:", bcp[:400])

with open('frontend/public/payments/culqi.svg', 'r', encoding='utf-8', errors='ignore') as f:
    culqi = f.read()

print("Culqi start:", culqi[:400])
