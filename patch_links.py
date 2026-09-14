import re

# 1. Update ServiceGrid.js
with open("src/components/ServiceGrid.js", "r") as f:
    content = f.read()

content = content.replace(
    'router.push(`/user/${gig.authorId || \'admin\'}`);',
    'router.push(gig.authorUsername ? `/${gig.authorUsername}` : `/user/${gig.authorId || \'admin\'}`);'
)

with open("src/components/ServiceGrid.js", "w") as f:
    f.write(content)

# 2. Update saved/page.js
with open("src/app/profile/saved/page.js", "r") as f:
    content = f.read()

content = content.replace(
    'router.push(`/user/${gig.authorId || \'admin\'}`);',
    'router.push(gig.authorUsername ? `/${gig.authorUsername}` : `/user/${gig.authorId || \'admin\'}`);'
)

with open("src/app/profile/saved/page.js", "w") as f:
    f.write(content)

