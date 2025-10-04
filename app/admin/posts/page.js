'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Table from '@/components/Table';
import Modal from '@/components/Modal';
import RichTextEditor from '@/components/RichTextEditor';
import AdminNav from '@/components/AdminNav';
import AdminFooter from '@/components/AdminFooter';
import ImageUpload from '@/components/ImageUpload';
import Image from 'next/image';
import TagInput from '@/components/TagInput';
import Toast from '@/components/Toast';

export default function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [toast, setToast] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    metadesc: '',
    content: '',
    img: '',
    tags: [],
    author_id: '',
    status: 'draft'
  });

  // Check authentication on mount
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isAdminLoggedIn');
    if (isLoggedIn !== 'true') {
      router.push('/');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Fetch posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (data.success) {
        setPosts(data.data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setToast({ message: 'Failed to fetch posts', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch authors for dropdown
  const fetchAuthors = async () => {
    try {
      const res = await fetch('/api/authors?isActive=true');
      const data = await res.json();
      if (data.success) {
        setAuthors(data.data);
      }
    } catch (error) {
      console.error('Error fetching authors:', error);
      setToast({ message: 'Failed to fetch authors', type: 'error' });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
      fetchAuthors();
    }
  }, [isAuthenticated]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle rich text editor change
  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  // Open modal for adding new post
  const handleAdd = () => {
    setEditingPost(null);
    setImageFile(null);
    setFormData({
      title: '',
      metadesc: '',
      content: '',
      img: '',
      tags: [],
      author_id: '',
      status: 'draft'
    });
    setIsModalOpen(true);
  };

  // Open modal for editing post
  const handleEdit = (post) => {
    setEditingPost(post);
    setImageFile(null);
    setFormData({
      title: post.title,
      metadesc: post.metadesc || '',
      content: post.content,
      img: post.img || '',
      tags: post.tags || [],
      author_id: post.author_id?._id || post.author_id,
      status: post.status
    });
    setIsModalOpen(true);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let imageUrl = formData.img;

      // Upload image if new file selected
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok || !uploadData.success) {
          throw new Error(uploadData.error || 'Image upload failed');
        }

        imageUrl = uploadData.url;
      }

      // Prepare submit data
      const submitData = {
        ...formData,
        img: imageUrl,
        tags: Array.isArray(formData.tags) ? formData.tags : []
      };
    
      const url = editingPost 
        ? `/api/posts/${editingPost._id}`
        : '/api/posts';
      
      const method = editingPost ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });
      
      const data = await res.json();
      
      if (data.success) {
        setToast({ 
          message: editingPost ? 'Post updated successfully!' : 'Post created successfully!', 
          type: 'success' 
        });
        setIsModalOpen(false);
        setImageFile(null);
        fetchPosts();
      } else {
        setToast({ message: data.error || 'Something went wrong', type: 'error' });
      }
    } catch (error) {
      console.error('Error saving post:', error);
      setToast({ message: `Failed to save post: ${error.message}`, type: 'error' });
    }
  };

  // Handle delete
  const handleDelete = async (post) => {
    if (!confirm(`Are you sure you want to delete "${post.title}"?`)) {
      return;
    }
    
    try {
      const res = await fetch(`/api/posts/${post._id}`, {
        method: 'DELETE'
      });
      
      const data = await res.json();
      
      if (data.success) {
        setToast({ message: 'Post deleted successfully!', type: 'success' });
        fetchPosts();
      } else {
        setToast({ message: data.error || 'Failed to delete post', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      setToast({ message: 'Failed to delete post', type: 'error' });
    }
  };

  // Table columns configuration
  const columns = [
    {
      header: 'Title',
      accessor: 'title',
      render: (row) => (
        <div className="flex items-center">
          {row.img && (
            <Image
              src={row.img}
              alt={row.title}
              width={48}
              height={48}
              className="w-12 h-12 rounded mr-3 object-cover"
            />
          )}
          <div>
            <div className="font-medium">{row.title}</div>
            <div className="text-xs text-gray-500">{row.slug}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Author',
      accessor: 'author_id',
      render: (row) => row.author_id?.name || 'Unknown'
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => {
        const statusColors = {
          draft: 'bg-gray-100 text-gray-800',
          published: 'bg-green-100 text-green-800',
          archived: 'bg-red-100 text-red-800'
        };
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${statusColors[row.status]}`}>
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </span>
        );
      }
    },
    {
      header: 'Tags',
      accessor: 'tags',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.tags?.slice(0, 2).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded font-medium">
              {tag}
            </span>
          ))}
          {row.tags?.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              +{row.tags.length - 2}
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Created',
      accessor: 'createdAt',
      render: (row) => new Date(row.createdAt).toLocaleDateString()
    }
  ];

  // Don't render until authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Checking authentication...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminNav />
      <div className="flex-1">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Blog Posts Management</h1>
                <p className="mt-2 text-sm sm:text-base text-gray-600">Manage your blog posts</p>
              </div>
              <button
                onClick={handleAdd}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-300 text-gray-800 rounded-lg hover:from-yellow-400 hover:via-amber-400 hover:to-yellow-400 transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                + Add New Post
              </button>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-500">Loading posts...</div>
            </div>
          ) : (
            <Table
              columns={columns}
              data={posts}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {/* Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          title={editingPost ? 'Edit Post' : 'Add New Post'}
          size="xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter post title"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  name="metadesc"
                  value={formData.metadesc}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="SEO meta description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author <span className="text-red-500">*</span>
                </label>
                <select
                  name="author_id"
                  value={formData.author_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select author</option>
                  {authors.map(author => (
                    <option key={author._id} value={author._id}>
                      {author.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="col-span-2">
                <ImageUpload
                  label="Featured Image"
                  value={formData.img}
                  onChange={(url) => setFormData(prev => ({ ...prev, img: url }))}
                  onFileSelect={(file) => setImageFile(file)}
                />
              </div>

              <div className="col-span-2">
                <TagInput
                  value={formData.tags}
                  onChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content <span className="text-red-500">*</span>
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={handleContentChange}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-300 text-gray-800 rounded-lg hover:from-yellow-400 hover:via-amber-400 hover:to-yellow-400 transition-all font-bold shadow-md"
              >
                {editingPost ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        </div>
      </div>
      </div>
      <AdminFooter />
    </div>
  );
}
