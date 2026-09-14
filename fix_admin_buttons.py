import re

with open("src/app/admin/messages/page.js", "r") as f:
    content = f.read()

# Replace the button block
old_buttons = """                       <button className="flex-1 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-1.5 rounded-lg font-bold text-[10px] uppercase transition-colors">
                         View Profile
                       </button>
                       <button className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 py-1.5 rounded-lg font-bold text-[10px] uppercase transition-colors">
                         Ban User
                       </button>"""

new_buttons = """                       <button 
                         onClick={() => window.open('/user/' + u.uid, '_blank')}
                         className="flex-1 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-1.5 rounded-lg font-bold text-[10px] uppercase transition-colors"
                       >
                         View Profile
                       </button>
                       <button 
                         onClick={async () => {
                           if(window.confirm('Are you sure you want to ban ' + u.displayName + '?')) {
                             try {
                               await updateDoc(doc(db, "users", u.uid), { banned: true });
                               toast.success(u.displayName + ' banned successfully.');
                             } catch(err) {
                               toast.error('Failed to ban user.');
                             }
                           }
                         }}
                         className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 py-1.5 rounded-lg font-bold text-[10px] uppercase transition-colors"
                       >
                         Ban User
                       </button>"""

content = content.replace(old_buttons, new_buttons)

with open("src/app/admin/messages/page.js", "w") as f:
    f.write(content)
