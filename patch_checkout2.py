import re

with open("src/app/order/[gigId]/[pkg]/page.js", "r") as f:
    content = f.read()

# 1. Update orderData object using regex
order_data_search = r'const orderData = \{[\s\S]*?createdAt: serverTimestamp\(\),\n\s*\};'
order_data_replace = """const orderData = {
        gigId: id,
        gigTitle: gig.title,
        packageId: activeTabName.toLowerCase(),
        packageName: pkgData.name,
        price: finalPrice,
        basePrice: basePrice || 0,
        discountAmount: discountAmount || 0,
        status: "requirements", 
        deliveryDays: pkgData.deliveryDays || 3,
        userId: user.uid,
        userName: user.displayName,
        userEmail: user.email,
        authorId: gig.authorId || "admin",
        createdAt: serverTimestamp(),
      };"""

content = re.sub(order_data_search, order_data_replace, content)

with open("src/app/order/[gigId]/[pkg]/page.js", "w") as f:
    f.write(content)
print("Replaced orderData")
