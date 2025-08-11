import React, { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { Edit, Trash2, X } from "lucide-react";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    meta_title: "",
    meta_description: "",
    blog_category_id: "",
    youtube_link: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/blogs`);
      const data = await response.json();
      setBlogs(data.blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/blog-categories`);
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) formDataToSend.append(key, formData[key]);
      });

      if (imageFile) {
        formDataToSend.append("blogImage", imageFile);
      }

      const url = editingId
        ? `${BASE_URL}/api/blogs/${editingId}`
        : `${BASE_URL}/api/addblog`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        resetForm();
        fetchBlogs();
        alert(
          editingId ? "Blog updated successfully!" : "Blog added successfully!"
        );
      } else {
        alert("Error saving blog");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error saving blog");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setFormData({
      title: blog.title,
      description: blog.description,
      meta_title: blog.meta_title || "",
      meta_description: blog.meta_description || "",
      blog_category_id: blog.blog_category_id || "",
      youtube_link: blog.youtube_link || "",
    });
    setEditingId(blog.id);
    if (blog.image_url) {
      setImagePreview(blog.image_url);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      try {
        const response = await fetch(`${BASE_URL}/api/blogs/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          fetchBlogs();
          alert("Blog deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      meta_title: "",
      meta_description: "",
      blog_category_id: "",
      youtube_link: "",
    });
    setImageFile(null);
    setImagePreview("");
    setEditingId(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Add custom CSS for CKEditor content */}
      <style jsx>{`
        .ck-content ul {
          list-style-type: disc !important;
          padding-left: 2rem !important;
          margin: 1rem 0 !important;
        }

        .ck-content ol {
          list-style-type: decimal !important;
          padding-left: 2rem !important;
          margin: 1rem 0 !important;
        }

        .ck-content li {
          margin: 0.5rem 0 !important;
          display: list-item !important;
        }

        .ck-content ul ul {
          list-style-type: circle !important;
          padding-left: 1.5rem !important;
        }

        .ck-content ol ol {
          list-style-type: lower-alpha !important;
          padding-left: 1.5rem !important;
        }

        .ck-content blockquote {
          border-left: 4px solid #ccc !important;
          padding-left: 1rem !important;
          margin: 1rem 0 !important;
          font-style: italic !important;
          color: #666 !important;
        }

        .ck-content h1,
        .ck-content h2,
        .ck-content h3,
        .ck-content h4,
        .ck-content h5,
        .ck-content h6 {
          font-weight: bold !important;
          margin: 1rem 0 0.5rem 0 !important;
        }

        .ck-content h1 {
          font-size: 2rem !important;
        }
        .ck-content h2 {
          font-size: 1.5rem !important;
        }
        .ck-content h3 {
          font-size: 1.25rem !important;
        }
        .ck-content h4 {
          font-size: 1.125rem !important;
        }
        .ck-content h5 {
          font-size: 1rem !important;
        }
        .ck-content h6 {
          font-size: 0.875rem !important;
        }
        .ck-content p {
          margin: 0.5rem 0 !important;
        }

        .ck-content strong {
          font-weight: bold !important;
        }

        .ck-content em {
          font-style: italic !important;
        }

        .ck-content a {
          color: #3b82f6 !important;
          text-decoration: underline !important;
        }

        .ck-content table {
          border-collapse: collapse !important;
          width: 100% !important;
          margin: 1rem 0 !important;
        }

        .ck-content table td,
        .ck-content table th {
          border: 1px solid #ddd !important;
          padding: 0.5rem !important;
        }

        .ck-content table th {
          background-color: #f5f5f5 !important;
          font-weight: bold !important;
        }

        /* Styles for blog preview in admin */
        .blog-description-preview ul {
          list-style-type: disc !important;
          padding-left: 2rem !important;
          margin: 1rem 0 !important;
        }

        .blog-description-preview ol {
          list-style-type: decimal !important;
          padding-left: 2rem !important;
          margin: 1rem 0 !important;
        }

        .blog-description-preview li {
          margin: 0.5rem 0 !important;
          display: list-item !important;
        }

        .blog-description-preview ul ul {
          list-style-type: circle !important;
          padding-left: 1.5rem !important;
        }

        .blog-description-preview ol ol {
          list-style-type: lower-alpha !important;
          padding-left: 1.5rem !important;
        }

        .blog-description-preview blockquote {
          border-left: 4px solid #ccc !important;
          padding-left: 1rem !important;
          margin: 1rem 0 !important;
          font-style: italic !important;
          color: #666 !important;
        }

        .blog-description-preview h1,
        .blog-description-preview h2,
        .blog-description-preview h3,
        .blog-description-preview h4,
        .blog-description-preview h5,
        .blog-description-preview h6 {
          font-weight: bold !important;
          margin: 1rem 0 0.5rem 0 !important;
        }

        .blog-description-preview h1 {
          font-size: 2rem !important;
        }
        .blog-description-preview h2 {
          font-size: 1.5rem !important;
        }
        .blog-description-preview h3 {
          font-size: 1.25rem !important;
        }

        .blog-description-preview p {
          margin: 0.5rem 0 !important;
        }

        .blog-description-preview strong {
          font-weight: bold !important;
        }

        .blog-description-preview em {
          font-style: italic !important;
        }

        .blog-description-preview a {
          color: #3b82f6 !important;
          text-decoration: underline !important;
        }

        .blog-description-preview table {
          border-collapse: collapse !important;
          width: 100% !important;
          margin: 1rem 0 !important;
        }

        .blog-description-preview table td,
        .blog-description-preview table th {
          border: 1px solid #ddd !important;
          padding: 0.5rem !important;
        }

        .blog-description-preview table th {
          background-color: #f5f5f5 !important;
          font-weight: bold !important;
        }
      `}</style>

      <h1 className="text-3xl font-bold mb-8">Blog Management</h1>

      {/* Form Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Blog" : "Add New Blog"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="title"
              placeholder="Blog Title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <select
              name="blog_category_id"
              value={formData.blog_category_id}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="meta_title"
              placeholder="Meta Title"
              value={formData.meta_title}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              name="meta_description"
              placeholder="Meta Description"
              value={formData.meta_description}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <input
            type="url"
            name="youtube_link"
            placeholder="YouTube Link (optional)"
            value={formData.youtube_link}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Image Upload */}
          {!formData.youtube_link && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {imagePreview && (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Description
            </label>
            <div className="border border-gray-300 rounded-lg">
              <CKEditor
                editor={ClassicEditor}
                data={formData.description}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setFormData((prev) => ({ ...prev, description: data }));
                }}
                config={{
                  toolbar: [
                    "heading",
                    "|",
                    "bold",
                    "italic",
                    "link",
                    "bulletedList",
                    "numberedList",
                    "|",
                    "outdent",
                    "indent",
                    "|",
                    "blockQuote",
                    "insertTable",
                    "|",
                    "undo",
                    "redo",
                  ],
                  list: {
                    properties: {
                      styles: true,
                      startIndex: true,
                      reversed: true,
                    },
                  },
                  heading: {
                    options: [
                      {
                        model: "paragraph",
                        title: "Paragraph",
                        class: "ck-heading_paragraph",
                      },
                      {
                        model: "heading1",
                        view: "h1",
                        title: "Heading 1",
                        class: "ck-heading_heading1",
                      },
                      {
                        model: "heading2",
                        view: "h2",
                        title: "Heading 2",
                        class: "ck-heading_heading2",
                      },
                      {
                        model: "heading3",
                        view: "h3",
                        title: "Heading 3",
                        class: "ck-heading_heading3",
                      },
                      {
                        model: "heading4",
                        view: "h4",
                        title: "Heading 4",
                        class: "ck-heading_heading4",
                      },
                      {
                        model: "heading5",
                        view: "h5",
                        title: "Heading 5",
                        class: "ck-heading_heading5",
                      },
                      {
                        model: "heading6",
                        view: "h6",
                        title: "Heading 6",
                        class: "ck-heading_heading6",
                      },
                    ],
                  },
                }}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? "Saving..." : editingId ? "Update Blog" : "Add Blog"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b">All Blogs</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Media
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {blog.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {blog.category_name || "Uncategorized"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {blog.youtube_link ? (
                      <span className="text-red-600 text-sm">📺 YouTube</span>
                    ) : blog.image_url ? (
                      <span className="text-green-600 text-sm">🖼️ Image</span>
                    ) : (
                      <span className="text-gray-400 text-sm">No media</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(blog.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
