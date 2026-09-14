import re

with open("src/app/admin/services/page.js", "r") as f:
    content = f.read()

# Add draggableItemId state
state_search = r'const \[dragOverIndex, setDragOverIndex\] = useState\(null\);'
state_replace = """const [dragOverIndex, setDragOverIndex] = useState(null);
  const [draggableItemId, setDraggableItemId] = useState(null);"""
if state_search in content:
    content = content.replace(state_search, state_replace)

# Modify draggable prop
card_search = r'draggable\n              onDragStart=\{\(\) => handleDragStart\(index\)\}'
card_replace = """draggable={draggableItemId === service.id}
              onDragStart={() => handleDragStart(index)}"""
if "draggable\n" in content:
    content = re.sub(card_search, card_replace, content)
else:
    # try another way
    content = content.replace("draggable", "draggable={draggableItemId === service.id}")

# Modify the Grip handle to enable dragging
grip_search = r'<div className="absolute top-2 right-2 z-10 bg-black/40 backdrop-blur-sm text-white p-1\.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">'
grip_replace = """<div 
                onMouseEnter={() => setDraggableItemId(service.id)}
                onMouseLeave={() => setDraggableItemId(null)}
                className="absolute top-2 right-2 z-10 bg-black/40 backdrop-blur-sm text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
              >"""
if grip_search in content:
    content = content.replace(grip_search, grip_replace)

with open("src/app/admin/services/page.js", "w") as f:
    f.write(content)
print("Fixed admin services draggable clicks")
