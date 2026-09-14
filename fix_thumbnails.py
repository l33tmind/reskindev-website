import os
import re

files_to_check = [
    "src/components/ServiceGrid.js",
    "src/app/admin/services/page.js",
    "src/app/profile/saved/page.js",
    "src/app/freelancer/gigs/page.js"
]

for filepath in files_to_check:
    if os.path.exists(filepath):
        with open(filepath, "r") as f:
            content = f.read()
        
        # Replace fixed heights with aspect-video for standard gig grids
        if "ServiceGrid.js" in filepath:
            content = content.replace('className="w-full h-48 relative overflow-hidden', 'className="w-full aspect-video relative overflow-hidden')
        elif "admin/services/page.js" in filepath:
            content = content.replace('className="w-full h-48 bg-gray-100', 'className="w-full aspect-video bg-gray-100')
        elif "profile/saved/page.js" in filepath:
            content = content.replace('className="w-full h-48 relative', 'className="w-full aspect-video relative')
        elif "freelancer/gigs/page.js" in filepath:
            content = content.replace('className="h-40 bg-gray-100', 'className="w-full aspect-video bg-gray-100')
            
        with open(filepath, "w") as f:
            f.write(content)

print("Thumbnails fixed to aspect-video (YouTube 16:9 ratio)")
