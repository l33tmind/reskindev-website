import re

with open("src/app/admin/orders/page.js", "r") as f:
    content = f.read()

filter_search = r'const filteredOrders = orders\.filter\(o => \n    o\.gigTitle\?\.toLowerCase\(\)\.includes\(searchTerm\.toLowerCase\(\)\) \|\| \n    o\.userName\?\.toLowerCase\(\)\.includes\(searchTerm\.toLowerCase\(\)\) \|\|\n    o\.userEmail\?\.toLowerCase\(\)\.includes\(searchTerm\.toLowerCase\(\)\)\n  \);'

filter_replace = """const filteredOrders = orders.filter(o => 
    (searchTerm === 'disputed' ? o.status === 'disputed' : true) &&
    (searchTerm === 'disputed' ? true : (
      o.gigTitle?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      o.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );"""

content = re.sub(filter_search, filter_replace, content)

with open("src/app/admin/orders/page.js", "w") as f:
    f.write(content)

