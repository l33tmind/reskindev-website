"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Edit2, Trash2, Plus } from "lucide-react";

export default function AdminPages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [pageType, setPageType] = useState("content"); // link or content
  const [linkUrl, setLinkUrl] = useState("");

  const fetchPages = async () => {
    try {
      const snap = await getDocs(collection(db, "pages"));
      setPages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const openForm = (page = null) => {
    if (page) {
      setEditingPage(page);
      setTitle(page.title || "");
      setSlug(page.slug || "");
      setContent(page.content || "");
      setPageType(page.pageType || "content");
      setLinkUrl(page.linkUrl || "");
    } else {
      setEditingPage(null);
      setTitle("");
      setSlug("");
      setContent("");
      setPageType("content");
      setLinkUrl("");
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const data = {
      title,
      slug,
      pageType,
      content: pageType === "content" ? content : "",
      linkUrl: pageType === "link" ? linkUrl : "",
      isVisible: true,
      order: pages.length
    };

    try {
      if (editingPage) {
        await updateDoc(doc(db, "pages", editingPage.id), data);
      } else {
        await addDoc(collection(db, "pages"), data);
      }
      setIsModalOpen(false);
      fetchPages();
    } catch (e) {
      alert("Error saving page");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this page?")) {
      await deleteDoc(doc(db, "pages", id));
      setPages(pages.filter(p => p.id !== id));
    }
  };

  if (loading) return <div>Loading pages...</div>;

  return (
    <div className="max-w-6xl mx-auto relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Manage Pages</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Create and manage dynamic pages like Terms, Privacy Policy, etc.</p>
        </div>
        <button 
          onClick={() => openForm()}
          className="bg-[#00C6A2] hover:bg-[#00b08f] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md flex items-center gap-2"
        >
          <Plus size={18} /> Add Page
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
          <thead className="bg-gray-50 dark:bg-gray-950 border-b border-gray-200 text-gray-900 dark:text-white">
            <tr>
              <th className="px-6 py-4 font-bold">Title</th>
              <th className="px-6 py-4 font-bold">Slug / URL</th>
              <th className="px-6 py-4 font-bold">Type</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 dark:bg-gray-950">
                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{p.title}</td>
                <td className="px-6 py-4">{p.slug || p.linkUrl}</td>
                <td className="px-6 py-4 capitalize">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${p.pageType === 'link' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                    {p.pageType || 'content'}
                  </span>
                </td>
                <td className="px-6 py-4 flex justify-end gap-3">
                  <button onClick={() => openForm(p)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-full">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingPage ? 'Edit Page' : 'Add New Page'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Page Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded-lg p-3" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Type</label>
                <select value={pageType} onChange={(e) => setPageType(e.target.value)} className="w-full border rounded-lg p-3">
                  <option value="content">Content (Rich Text/HTML)</option>
                  <option value="link">External Link</option>
                </select>
              </div>
              
              {pageType === 'link' ? (
                <div>
                  <label className="block text-sm font-bold mb-1">URL</label>
                  <input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className="w-full border rounded-lg p-3" placeholder="https://" />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-bold mb-1">Slug (URL Path)</label>
                    <input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} className="w-full border rounded-lg p-3" placeholder="e.g. privacy-policy" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">HTML Content</label>
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} rows="8" className="w-full border rounded-lg p-3 font-mono text-sm" placeholder="<p>Write your content here...</p>" />
                  </div>
                </>
              )}
            </div>
            
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-lg font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800">Cancel</button>
              <button onClick={handleSave} className="px-6 py-2 rounded-lg font-bold bg-[#00C6A2] text-white hover:bg-[#00b08f]">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
