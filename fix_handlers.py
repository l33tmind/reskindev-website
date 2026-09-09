with open('src/app/admin/services/edit/[id]/page.js', 'r') as f:
    content = f.read()

handle_change_block = """  const handleChange = (e) => {
    const { name, value } = e.target;
    setService(prev => ({ ...prev, [name]: value }));
  };"""

replacement_handle = """  const handleChange = (e) => {
    const { name, value } = e.target;
    setService(prev => ({ ...prev, [name]: value }));
  };

  const handleYoutubeChange = (index, value) => {
    setService(prev => {
      const newUrls = [...(prev.youtubeUrls || [])];
      newUrls[index] = value;
      return { ...prev, youtubeUrls: newUrls };
    });
  };
  const addYoutubeUrl = () => {
    setService(prev => ({ ...prev, youtubeUrls: [...(prev.youtubeUrls || []), ""] }));
  };
  const removeYoutubeUrl = (index) => {
    setService(prev => {
      const newUrls = (prev.youtubeUrls || []).filter((_, i) => i !== index);
      return { ...prev, youtubeUrls: newUrls.length ? newUrls : [""] };
    });
  };"""

content = content.replace(handle_change_block, replacement_handle)

with open('src/app/admin/services/edit/[id]/page.js', 'w') as f:
    f.write(content)
