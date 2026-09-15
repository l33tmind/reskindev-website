import re

with open('src/app/profile/orders/page.js', 'r') as f:
    content = f.read()

# 1. Add handleSubmitReq and handleRequestRev
submit_functions = """
  const handleSubmitReq = async (e) => {
    e.preventDefault();
    if (!reqText.trim()) return;
    setSubmittingReq(true);
    try {
      await updateDoc(doc(db, "orders", reqOrder.id), { 
        status: "processing", 
        requirementsText: reqText,
        requirementsProvided: true,
        updatedAt: serverTimestamp()
      });
      setOrders(orders.map(o => o.id === reqOrder.id ? { ...o, status: "processing" } : o));
      toast.success("Requirements submitted successfully!");
      setReqOrder(null);
      setReqText("");
    } catch (error) {
      toast.error("Failed to submit requirements.");
      console.error(error);
    }
    setSubmittingReq(false);
  };

  const handleRequestRev = async (e) => {
    e.preventDefault();
    if (!revText.trim()) return;
    try {
      await updateDoc(doc(db, "orders", revOrder.id), { 
        status: "revision",
        revisionNote: revText,
        updatedAt: serverTimestamp()
      });
      setOrders(orders.map(o => o.id === revOrder.id ? { ...o, status: "revision" } : o));
      toast.success("Revision requested successfully!");
      setRevOrder(null);
      setRevText("");
    } catch (error) {
      toast.error("Failed to request revision.");
      console.error(error);
    }
  };
"""

content = content.replace('  const submitReview = async (e) => {', submit_functions + '\n  const submitReview = async (e) => {')

# 2. Fix the fallbacks for ContactUserButton
content = content.replace('targetUserId={order.freelancerId}', 'targetUserId={order.freelancerId || order.authorId}')
content = content.replace('targetUserName={order.freelancerName}', 'targetUserName={order.freelancerName || order.authorName || "Seller"}')

with open('src/app/profile/orders/page.js', 'w') as f:
    f.write(content)

print("Done")
