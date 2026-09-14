import re

with open("src/app/admin/messages/page.js", "r") as f:
    content = f.read()

content = content.replace(
    "window.open('/user/' + u.uid, '_blank')",
    "window.open(u.username ? '/' + u.username : '/user/' + u.uid, '_blank')"
)

with open("src/app/admin/messages/page.js", "w") as f:
    f.write(content)
