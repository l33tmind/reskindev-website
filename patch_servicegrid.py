import re

with open("src/components/ServiceGrid.js", "r") as f:
    content = f.read()

# Make the link construction safer
old_link = """<Link href={`/gig/${gig.id}/${gig.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>"""
new_link = """<Link href={`/gig/${gig.id}/${(gig.title || 'service').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>"""

content = content.replace(old_link, new_link)

with open("src/components/ServiceGrid.js", "w") as f:
    f.write(content)

