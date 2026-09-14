import re

with open("src/components/ContactSellerButton.js", "r") as f:
    content = f.read()

content = content.replace(
    'export default function ContactSellerButton({ authorId, authorName, gigId, gigTitle }) {',
    'export default function ContactSellerButton({ authorId, authorName, gigId, gigTitle, className, buttonText }) {'
)

with open("src/components/ContactSellerButton.js", "w") as f:
    f.write(content)
