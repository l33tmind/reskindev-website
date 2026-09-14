import re

with open("src/app/order/[gigId]/[pkg]/page.js", "r") as f:
    content = f.read()

# 1. Add new state variables
state_vars = """
  const [appLinks, setAppLinks] = useState("");
  const [credentials, setCredentials] = useState("");
  const [requirements, setRequirements] = useState("");
"""
content = re.sub(r'const \[requirements, setRequirements\] = useState\(""\);', state_vars, content)

# 2. Fix handleOrder to include new fields and timeout
handle_order_old = """  const handleOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please Sign In first to place an order.");
      return;
    }
    if (!requirements.trim()) {
      toast.error("Please provide order requirements.");
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "orders"), {
        userId: user?.uid || "unknown",
        userEmail: user?.email || "",
        userName: user?.displayName || "Buyer",
        gigId: gigId || "",
        gigTitle: gig?.title || "Untitled Service",
        freelancerId: gig?.authorId || "admin_id",
        freelancerName: gig?.authorName || "Admin",
        packageName: pkgName || "basic",
        price: finalPrice || 0,
        basePrice: basePrice || 0,
        discountAmount: discountAmount || 0,
        status: "pending", 
        requirements: requirements || "",
        createdAt: serverTimestamp(),
      });
      
      // Update coupon usage count if one was applied
      if (appliedCouponId) {
        const couponRef = doc(db, "coupons", appliedCouponId);
        const cSnap = await getDoc(couponRef);
        if (cSnap.exists()) {
          await updateDoc(couponRef, { usageCount: (cSnap.data().usageCount || 0) + 1 });
        }
      }

      setSuccess(true);
    } catch (error) {
      console.error("Order failed:", error);
      toast.error("Failed to place order. Try again.");
    }
    setSubmitting(false);
  };"""

handle_order_new = """  const handleOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please Sign In first to place an order.");
      return;
    }
    if (!requirements.trim() && !appLinks.trim()) {
      toast.error("Please provide at least some project requirements or links.");
      return;
    }

    setSubmitting(true);
    try {
      const orderData = {
        userId: user?.uid || "unknown",
        userEmail: user?.email || "",
        userName: user?.displayName || "Buyer",
        gigId: gigId || "",
        gigTitle: gig?.title || "Untitled Service",
        freelancerId: gig?.authorId || "admin_id",
        freelancerName: gig?.authorName || "Admin",
        packageName: pkgName || "basic",
        price: finalPrice || 0,
        basePrice: basePrice || 0,
        discountAmount: discountAmount || 0,
        status: "pending", 
        requirements: requirements || "",
        appLinks: appLinks || "",
        credentials: credentials || "",
        createdAt: serverTimestamp(),
      };

      // Wrap in timeout to prevent infinite hang
      const addDocPromise = addDoc(collection(db, "orders"), orderData);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Network timeout: Order took too long to place")), 10000));
      
      await Promise.race([addDocPromise, timeoutPromise]);
      
      // Update coupon usage count if one was applied
      if (appliedCouponId) {
        const couponRef = doc(db, "coupons", appliedCouponId);
        const cSnap = await getDoc(couponRef);
        if (cSnap.exists()) {
          await updateDoc(couponRef, { usageCount: (cSnap.data().usageCount || 0) + 1 });
        }
      }

      setSuccess(true);
    } catch (error) {
      console.error("Order failed:", error);
      toast.error(error.message === "Network timeout: Order took too long to place" ? "Network timeout. Please check your connection." : "Failed to place order. Try again.");
    } finally {
      setSubmitting(false);
    }
  };"""

content = content.replace(handle_order_old, handle_order_new)

# 3. Update the form UI
form_ui_old = """              <form onSubmit={handleOrder}>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Please provide all necessary details for this order (App links, credentials, specifics):
                </label>
                <textarea
                  required
                  rows="6"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-[#00C6A2] focus:border-transparent outline-none mb-6"
                  placeholder="I need..."
                />
                
                <button """

form_ui_new = """              <form onSubmit={handleOrder}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      App Links / URLs (Optional)
                    </label>
                    <input
                      type="text"
                      value={appLinks}
                      onChange={(e) => setAppLinks(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-xl p-4 focus:ring-2 focus:ring-[#00C6A2] focus:border-transparent outline-none text-gray-900 dark:text-white"
                      placeholder="e.g. https://play.google.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Credentials (Optional)
                    </label>
                    <input
                      type="text"
                      value={credentials}
                      onChange={(e) => setCredentials(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-xl p-4 focus:ring-2 focus:ring-[#00C6A2] focus:border-transparent outline-none text-gray-900 dark:text-white"
                      placeholder="Username: ..., Password: ..."
                    />
                    <p className="text-xs text-gray-500 mt-1">Please ensure credentials are for temporary/restricted accounts if possible.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Project Specifics & Requirements <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows="6"
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-xl p-4 focus:ring-2 focus:ring-[#00C6A2] focus:border-transparent outline-none text-gray-900 dark:text-white"
                      placeholder="Describe exactly what you need done..."
                    />
                  </div>
                </div>
                
                <button """

content = content.replace(form_ui_old, form_ui_new)

with open("src/app/order/[gigId]/[pkg]/page.js", "w") as f:
    f.write(content)
