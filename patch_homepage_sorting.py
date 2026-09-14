import re

with open("src/app/page.js", "r") as f:
    content = f.read()

# Add sorting to the getGigs function
old_code = """).filter(gig => gig.status !== 'pending');"""
new_code = """).filter(gig => gig.status !== 'pending').sort((a, b) => (a.order || 0) - (b.order || 0));"""

if old_code in content:
    content = content.replace(old_code, new_code)
    with open("src/app/page.js", "w") as f:
        f.write(content)
    print("Patched src/app/page.js")
else:
    print("Could not find code to replace in src/app/page.js")

