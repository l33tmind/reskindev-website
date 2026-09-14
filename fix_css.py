import re

with open("src/app/freelancer/gigs/edit/[id]/page.js", "r") as f:
    content = f.read()

# Replace ReactQuill with the one including the CSS link
new_quill_ui = """
              <div className="quill-wrapper">
                <link rel="stylesheet" href="https://unpkg.com/react-quill@1.3.3/dist/quill.snow.css" />
                <ReactQuill 
"""
content = content.replace('<div className="quill-wrapper">\n                <ReactQuill ', new_quill_ui)

with open("src/app/freelancer/gigs/edit/[id]/page.js", "w") as f:
    f.write(content)
