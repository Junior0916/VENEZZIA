import re

with open('frontend/public/payments/bbva.svg', 'r') as f:
    bbva = f.read()

fills = re.findall(r'fill="([^"]+)"|fill:([^;"]+)', bbva)
print("BBVA fills:", fills)

with open('frontend/public/payments/bcp.svg', 'r') as f:
    bcp = f.read()

fills_bcp = re.findall(r'fill="([^"]+)"|fill:([^;"]+)', bcp)
print("BCP fills:", set(str(f) for f in fills_bcp))
