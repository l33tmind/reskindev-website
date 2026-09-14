import re

with open("src/components/Navbar.js", "r") as f:
    content = f.read()

# 1. Add imports for usePathname, useRef, toast
import_search = r'import \{ useState, useEffect \} from "react";'
import_replace = """import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";"""
content = re.sub(import_search, import_replace, content)

# 2. Add pathname and isFirstSnapshot to Navbar
nav_start_search = r'export default function Navbar\(\) \{'
nav_start_replace = """export default function Navbar() {
  const pathname = usePathname();
  const isFirstSnapshot = useRef(true);"""
content = re.sub(nav_start_search, nav_start_replace, content)

# 3. Update the onSnapshot logic
snapshot_search = r'const unsubChats = onSnapshot\(qChats, \(snap\) => \{\n\s*let total = 0;\n\s*snap\.forEach\(doc => \{\n\s*const data = doc\.data\(\);\n\s*if \(data\.unreadCount && data\.unreadCount\[user\.uid\]\) \{\n\s*total \+= data\.unreadCount\[user\.uid\];\n\s*\}\n\s*\}\);\n\s*setUnreadTotal\(total\);\n\s*\}\);'

snapshot_replace = """const unsubChats = onSnapshot(qChats, (snap) => {
      let total = 0;
      snap.forEach(doc => {
        const data = doc.data();
        if (data.unreadCount && data.unreadCount[user.uid]) {
          total += data.unreadCount[user.uid];
        }
      });
      
      if (isFirstSnapshot.current) {
        isFirstSnapshot.current = false;
        setUnreadTotal(total);
      } else {
        setUnreadTotal(prev => {
          if (total > prev) {
            // New message received!
            try {
              const audio = new Audio('/notification.mp3');
              audio.play().catch(e => console.log('Audio blocked by browser:', e));
              if (pathname !== '/inbox') {
                toast.success('New message received!', { icon: '💬' });
              }
            } catch(e) {
              console.error(e);
            }
          }
          return total;
        });
      }
    });"""

content = re.sub(snapshot_search, snapshot_replace, content)

with open("src/components/Navbar.js", "w") as f:
    f.write(content)

print("Updated Navbar with notification logic")
