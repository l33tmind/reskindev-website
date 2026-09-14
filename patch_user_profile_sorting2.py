import re

with open("src/app/user/[id]/page.js", "r") as f:
    content = f.read()

old_code = """setGigs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));"""
new_code = """setGigs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a,b) => (a.order || 0) - (b.order || 0)));"""

if old_code in content:
    content = content.replace(old_code, new_code)
    with open("src/app/user/[id]/page.js", "w") as f:
        f.write(content)
    print("Patched src/app/user/[id]/page.js")
else:
    print("Could not find code to replace in src/app/user/[id]/page.js")

