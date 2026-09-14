import re

with open("src/app/profile/orders/page.js", "r") as f:
    content = f.read()

# 1. Update stages
stages_old = '  const STAGES = ["pending", "requirements", "processing", "review", "completed"];'
stages_new = '  const STAGES = ["requirements", "processing", "delivered", "completed"];'
content = content.replace(stages_old, stages_new)

# 2. Add New Modals State
state_search = r'  const \[submittingReview, setSubmittingReview\] = useState\(false\);'
state_replace = """  const [submittingReview, setSubmittingReview] = useState(false);

  // New Modals State
  const [reqOrder, setReqOrder] = useState(null);
  const [reqText, setReqText] = useState("");
  const [submittingReq, setSubmittingReq] = useState(false);

  const [revOrder, setRevOrder] = useState(null);
  const [revText, setRevText] = useState("");
  const [submittingRev, setSubmittingRev] = useState(false);"""
content = re.sub(state_search, state_replace, content)

# 3. Add Timer Function
timer_code = """
  // Format Countdown Timer
  const getCountdown = (createdAt, deliveryDays) => {
    if (!createdAt || !deliveryDays) return "N/A";
    
    // We use requirementsSubmittedAt if available, else createdAt
    const startTime = createdAt.toDate ? createdAt.toDate().getTime() : new Date(createdAt).getTime();
    const deadline = startTime + (deliveryDays * 24 * 60 * 60 * 1000);
    const now = new Date().getTime();
    const diff = deadline - now;
    
    if (diff <= 0) return "Late Delivery";
    
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${d}d ${h}h ${m}m remaining`;
  };

  // Action Handlers
  const handleSubmitReq = async (e) => {
    e.preventDefault();
    if (!reqOrder || !reqText) return;
    setSubmittingReq(true);
    try {
      await updateDoc(doc(db, "orders", reqOrder.id), {
        status: "processing",
        requirements: reqText,
        requirementsSubmittedAt: serverTimestamp()
      });
      setOrders(orders.map(o => o.id === reqOrder.id ? { ...o, status: "processing", requirements: reqText, requirementsSubmittedAt: new Date() } : o));
      setReqOrder(null);
      setReqText("");
    } catch (err) {
      console.error(err);
    }
    setSubmittingReq(false);
  };

  const handleRequestRev = async (e) => {
    e.preventDefault();
    if (!revOrder || !revText) return;
    setSubmittingRev(true);
    try {
      await updateDoc(doc(db, "orders", revOrder.id), {
        status: "revision",
        revisionNote: revText
      });
      setOrders(orders.map(o => o.id === revOrder.id ? { ...o, status: "revision", revisionNote: revText } : o));
      setRevOrder(null);
      setRevText("");
    } catch (err) {
      console.error(err);
    }
    setSubmittingRev(false);
  };

  const handleAction = async (orderId, action) => {
    let newStatus = "";
    if (action === "cancel") newStatus = "cancel_requested_by_buyer";
    if (action === "admin") newStatus = "disputed";
    if (!newStatus) return;
    
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (e) {
      console.error(e);
    }
  };
"""

stage_index_func = r'  const getStageIndex = \(status\) => \{'
content = content.replace(stage_index_func, timer_code + '\n' + stage_index_func)

with open("src/app/profile/orders/page.js", "w") as f:
    f.write(content)
