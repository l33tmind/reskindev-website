import re

with open("src/app/order/[gigId]/[pkg]/page.js", "r") as f:
    content = f.read()

content = content.replace('const [appLinks, setAppLinks] = useState("");\n', '')
content = content.replace('const [credentials, setCredentials] = useState("");\n', '')
content = content.replace('const [requirements, setRequirements] = useState("");\n', '')

with open("src/app/order/[gigId]/[pkg]/page.js", "w") as f:
    f.write(content)
