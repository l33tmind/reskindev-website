import re

with open("src/app/order/[gigId]/[pkg]/page.js", "r") as f:
    content = f.read()

# 1. Remove state for requirements, appLinks, credentials
content = re.sub(r'const \[requirements, setRequirements\] = useState\(""\);\n', '', content)
content = re.sub(r'const \[appLinks, setAppLinks\] = useState\(""\);\n', '', content)
content = re.sub(r'const \[credentials, setCredentials\] = useState\(""\);\n', '', content)

# 2. Update orderData object
old_orderData = """        basePrice: basePrice || 0,
        discountAmount: discountAmount || 0,
        status: "pending", 
        requirements: requirements || "",
        appLinks: appLinks || "",
        credentials: credentials || "",
        createdAt: serverTimestamp(),"""
        
new_orderData = """        basePrice: basePrice || 0,
        discountAmount: discountAmount || 0,
        status: "requirements", 
        deliveryDays: pkgData.deliveryDays || 3,
        createdAt: serverTimestamp(),"""

content = content.replace(old_orderData, new_orderData)

# 3. Remove requirement inputs from JSX
input_section = r'<div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/10 p-6 md:p-8 shadow-sm mb-6">(.*?)</textarea>\n                  </div>\n                </div>\n              </div>'
# wait, it's safer to just remove the whole div if I can identify it. Let's look at the exact HTML block.
