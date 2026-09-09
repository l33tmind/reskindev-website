import re

with open('src/app/admin/services/edit/[id]/page.js', 'r') as f:
    content = f.read()

# 1. Update initial state
content = content.replace('youtubeUrl: "",', 'youtubeUrl: "",\n    youtubeUrls: [""],')

# 2. Update fetch logic
fetch_logic = """
            if (!data.packages || data.packages.length === 0) {
"""
replacement_fetch = """
            if (data.youtubeUrl && (!data.youtubeUrls || data.youtubeUrls.length === 0)) {
              data.youtubeUrls = [data.youtubeUrl];
            } else if (!data.youtubeUrls) {
              data.youtubeUrls = [""];
            }
            if (!data.packages || data.packages.length === 0) {
"""
content = content.replace(fetch_logic, replacement_fetch)

# 3. Add handle array change logic
handle_change_block = """
  const handleChange = (e) => {
    setService({ ...service, [e.target.name]: e.target.value });
  };
"""
replacement_handle = """
  const handleChange = (e) => {
    setService({ ...service, [e.target.name]: e.target.value });
  };

  const handleYoutubeChange = (index, value) => {
    const newUrls = [...service.youtubeUrls];
    newUrls[index] = value;
    setService({ ...service, youtubeUrls: newUrls });
  };
  const addYoutubeUrl = () => {
    setService({ ...service, youtubeUrls: [...service.youtubeUrls, ""] });
  };
  const removeYoutubeUrl = (index) => {
    const newUrls = service.youtubeUrls.filter((_, i) => i !== index);
    setService({ ...service, youtubeUrls: newUrls.length ? newUrls : [""] });
  };
"""
content = content.replace(handle_change_block, replacement_handle)

# 4. Replace preview logic
preview_logic = """
  const ytId = extractYouTubeId(service.youtubeUrl);
  const previewImage = ytId 
    ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` 
    : service.imageUrl;
"""
replacement_preview = """
  const validYtIds = (service.youtubeUrls || []).map(extractYouTubeId).filter(Boolean);
"""
content = content.replace(preview_logic, replacement_preview)

# 5. Replace YouTube URL input section
youtube_input = """
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">YouTube Video URL</label>
                <div className="relative">
                  <Video size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type="text" name="youtubeUrl" value={service.youtubeUrl} onChange={handleChange} className="w-full pl-10 border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#00C6A2]" placeholder="https://youtu.be/..." />
                </div>
              </div>
"""
replacement_youtube = """
              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-gray-700">YouTube Video URLs</label>
                  <button onClick={addYoutubeUrl} className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 flex items-center gap-1">
                    <Plus size={14} /> Add Video
                  </button>
                </div>
                <div className="space-y-3">
                  {(service.youtubeUrls || []).map((url, idx) => (
                    <div key={idx} className="flex items-center gap-2 relative">
                      <div className="relative flex-1">
                        <Video size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input type="text" value={url} onChange={(e) => handleYoutubeChange(idx, e.target.value)} className="w-full pl-10 border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#00C6A2]" placeholder="https://youtu.be/..." />
                      </div>
                      <button onClick={() => removeYoutubeUrl(idx)} className="text-red-400 hover:text-red-600 p-2">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
"""
content = content.replace(youtube_input, replacement_youtube)

# 6. Replace Thumbnail Preview section
thumbnail_preview = """
          {/* Thumbnail Preview Area */}
          <div className="w-full md:w-72 flex flex-col items-center">
            <label className="block text-sm font-bold text-gray-700 mb-2 w-full text-center">Thumbnail Preview</label>
            <div className="w-full aspect-video bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center relative shadow-sm">
              {previewImage ? (
                <img src={previewImage} alt="Thumbnail Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-400 text-sm font-semibold flex flex-col items-center">
                  <Video size={32} className="mb-2 opacity-50" />
                  No Media Link
                </div>
              )}
              {ytId && (
                <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                  YOUTUBE
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              The thumbnail is automatically extracted if you provide a valid YouTube link.
            </p>
          </div>
"""
replacement_thumbnail = """
          {/* Thumbnail Preview Area */}
          <div className="w-full md:w-72 flex flex-col items-center">
            <label className="block text-sm font-bold text-gray-700 mb-2 w-full text-center">Thumbnail Previews</label>
            <div className="w-full flex flex-col gap-3">
              {validYtIds.length > 0 ? (
                validYtIds.map((id, idx) => (
                  <div key={idx} className="w-full aspect-video bg-gray-100 rounded-xl border border-gray-200 overflow-hidden relative shadow-sm">
                    <img src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                      VID {idx + 1}
                    </div>
                  </div>
                ))
              ) : service.imageUrl ? (
                <div className="w-full aspect-video bg-gray-100 rounded-xl border border-gray-200 overflow-hidden relative shadow-sm">
                  <img src={service.imageUrl} alt="Fallback Preview" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                    IMAGE
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                  <Video size={32} className="mb-2 opacity-50" />
                  <span className="text-xs">No Media</span>
                </div>
              )}
            </div>
          </div>
"""
content = content.replace(thumbnail_preview, replacement_thumbnail)

with open('src/app/admin/services/edit/[id]/page.js', 'w') as f:
    f.write(content)

