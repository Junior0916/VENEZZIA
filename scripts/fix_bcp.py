with open('frontend/public/payments/bcp.svg', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('<svg width="768" height="212"', '<svg viewBox="0 0 768 212" width="768" height="212"')
with open('frontend/public/payments/bcp.svg', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated bcp.svg with viewBox="0 0 768 212"!')
