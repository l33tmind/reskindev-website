import re

with open("src/app/admin/messages/page.js", "r") as f:
    content = f.read()

# 1. Add allUsersMap state
state_search = r'const \[participantStats, setParticipantStats\] = useState\(\[\]\);'
state_replace = """const [participantStats, setParticipantStats] = useState([]);
  const [allUsersMap, setAllUsersMap] = useState({});"""
content = re.sub(state_search, state_replace, content)

# 2. Add useEffect to fetch all users globally
effect_search = r'  useEffect\(\(\) => \{\n    // Fetch Flagged Keywords'
effect_replace = """  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      const map = {};
      snap.docs.forEach(d => {
        map[d.id] = d.data();
      });
      setAllUsersMap(map);
    });
    return () => unsubUsers();
  }, []);

  useEffect(() => {
    // Fetch Flagged Keywords"""
content = re.sub(effect_search, effect_replace, content)

# 3. Update filteredConversations logic
filter_search = r"""  const filteredConversations = conversations\.filter\(c => \{
    const p1 = Object\.values\(c\.participantDetails \|\| \{\}\)\[0\]\?\.name \|\| "";
    const p2 = Object\.values\(c\.participantDetails \|\| \{\}\)\[1\]\?\.name \|\| "";
    return p1\.toLowerCase\(\)\.includes\(search\.toLowerCase\(\)\) \|\| p2\.toLowerCase\(\)\.includes\(search\.toLowerCase\(\)\);
  \}\);"""

filter_replace = """  const filteredConversations = conversations.filter(c => {
    const p1Id = c.participants?.[0];
    const p2Id = c.participants?.[1];
    
    const p1Name = Object.values(c.participantDetails || {})[0]?.name || "";
    const p2Name = Object.values(c.participantDetails || {})[1]?.name || "";
    
    const p1User = allUsersMap[p1Id] || {};
    const p2User = allUsersMap[p2Id] || {};
    
    const p1Username = p1User.username || "";
    const p2Username = p2User.username || "";

    const s = search.toLowerCase();

    return p1Name.toLowerCase().includes(s) || 
           p2Name.toLowerCase().includes(s) ||
           p1Username.toLowerCase().includes(s) ||
           p2Username.toLowerCase().includes(s);
  });"""
content = re.sub(filter_search, filter_replace, content)

# 4. Add username to Participant Details right sidebar
sidebar_search = r"""                    <div className="flex justify-between text-gray-500">
                      <span>Email:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200 truncate ml-2" title=\{u\.email\}>\{u\.email\}</span>
                    </div>"""

sidebar_replace = """                    <div className="flex justify-between text-gray-500">
                      <span>Email:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200 truncate ml-2" title={u.email}>{u.email}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Username:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200 truncate ml-2">@{u.username || "N/A"}</span>
                    </div>"""
content = re.sub(sidebar_search, sidebar_replace, content)


with open("src/app/admin/messages/page.js", "w") as f:
    f.write(content)

