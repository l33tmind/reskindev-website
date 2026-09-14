import re

with open("src/app/profile/layout.js", "r") as f:
    content = f.read()

old_code = """<h2 className="font-bold text-gray-900 dark:text-white">{user.displayName || "Client User"}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{user.email}</p>"""

new_code = """<h2 className="font-bold text-gray-900 dark:text-white">{user.displayName || "Client User"}</h2>
              {dbUser?.username && (
                <p className="text-[11px] font-bold text-[#00C6A2] mb-1">@{dbUser.username}</p>
              )}
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-4 truncate w-full">{user.email}</p>"""

content = content.replace(old_code, new_code)

with open("src/app/profile/layout.js", "w") as f:
    f.write(content)

print("Updated Profile Layout")
