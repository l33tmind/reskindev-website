import re

with open("src/app/inbox/page.js", "r") as f:
    content = f.read()

old_logic = """  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || !user) return;

    const msgText = newMessage.trim();
    setNewMessage("");
    setIsTyping(false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    const otherUserId = activeChat.participants.find(id => id !== user.uid);
    const currentUnread = activeChat.unreadCount?.[otherUserId] || 0;

    await addDoc(collection(db, "conversations", activeChat.id, "messages"), {
      text: msgText,
      senderId: user.uid,
      senderName: user.displayName || "User",
      createdAt: serverTimestamp(),
      type: "text"
    });

    await updateDoc(doc(db, "conversations", activeChat.id), {
      lastMessage: msgText,
      updatedAt: serverTimestamp(),
      [`unreadCount.${otherUserId}`]: currentUnread + 1,
      [`typing.${user.uid}`]: false
    });
  };"""

new_logic = """  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || !user) return;

    const msgText = newMessage.trim();
    setNewMessage("");
    setIsTyping(false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    let otherUserId = null;
    if (activeChat.participants && activeChat.participants.length > 0) {
      otherUserId = activeChat.participants.find(id => id !== user.uid);
    } else if (activeChat.participantDetails) {
      otherUserId = Object.keys(activeChat.participantDetails).find(id => id !== user.uid);
    }
    
    if (!otherUserId) {
      console.error("Could not determine otherUserId. Using fallback.");
      otherUserId = "unknown";
    }

    const currentUnread = activeChat.unreadCount?.[otherUserId] || 0;

    try {
      await addDoc(collection(db, "conversations", activeChat.id, "messages"), {
        text: msgText,
        senderId: user.uid,
        senderName: user.displayName || "User",
        createdAt: serverTimestamp(),
        type: "text"
      });

      const updateData = {
        lastMessage: msgText,
        updatedAt: serverTimestamp(),
        [`typing.${user.uid}`]: false
      };
      
      if (otherUserId !== "unknown") {
        updateData[`unreadCount.${otherUserId}`] = currentUnread + 1;
      }
      
      await updateDoc(doc(db, "conversations", activeChat.id), updateData);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };"""

content = content.replace(old_logic, new_logic)

with open("src/app/inbox/page.js", "w") as f:
    f.write(content)
