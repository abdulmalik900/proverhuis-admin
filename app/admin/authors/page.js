'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Table from '@/components/Table';
import Modal from '@/components/Modal';
import AdminNav from '@/components/AdminNav';
import AdminFooter from '@/components/AdminFooter';
import ImageUpload from '@/components/ImageUpload';
import Image from 'next/image';
import Toast from '@/components/Toast';

export default function AuthorsPage() {
  const router = useRouter();
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [toast, setToast] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    img: '',
    isActive: true
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

  // Fetch authors
  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/authors');
      const data = await res.json();
      if (data.success) {
        setAuthors(data.data);
      }
    } catch (error) {
      console.error('Error fetching authors:', error);
      setToast({ message: 'Failed to fetch authors', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAuthors();
    }
  }, [isAuthenticated]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Open modal for adding new author
  const handleAdd = () => {
    setEditingAuthor(null);
    setImageFile(null);
    setFormData({
      name: '',
      bio: '',
      img: '',
      isActive: true
    });
    setIsModalOpen(true);
  };

  // Open modal for editing author
  const handleEdit = (author) => {
    setEditingAuthor(author);
    setImageFile(null);
    setFormData({
      name: author.name,
      bio: author.bio || '',
      img: author.img || '',
      isActive: author.isActive
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

      // Now save author with image URL
      const url = editingAuthor 
        ? `/api/authors/${editingAuthor._id}`
        : '/api/authors';
      
      const method = editingAuthor ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          img: imageUrl
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setToast({ 
          message: editingAuthor ? 'Author updated successfully!' : 'Author created successfully!', 
          type: 'success' 
        });
        setIsModalOpen(false);
        setImageFile(null);
        fetchAuthors();
      } else {
        setToast({ message: data.error || 'Something went wrong', type: 'error' });
      }
    } catch (error) {
      console.error('Error saving author:', error);
      setToast({ message: `Failed to save author: ${error.message}`, type: 'error' });
    }
  };

  // Handle delete
  const handleDelete = async (author) => {
    if (!confirm(`Are you sure you want to delete "${author.name}"?`)) {
      return;
    }
    
    try {
      const res = await fetch(`/api/authors/${author._id}`, {
        method: 'DELETE'
      });
      
      const data = await res.json();
      
      if (data.success) {
        setToast({ message: 'Author deleted successfully!', type: 'success' });
        fetchAuthors();
      } else {
        setToast({ message: data.error || 'Failed to delete author', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting author:', error);
      setToast({ message: 'Failed to delete author', type: 'error' });
    }
  };

  // Table columns configuration
  const columns = [
    {
      header: 'Name',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center">
          {row.img && (
            <Image
              src={row.img}
              alt={row.name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full mr-3 object-cover"
            />
          )}
          <span className="font-medium">{row.name}</span>
        </div>
      )
    },
    {
      header: 'Bio',
      accessor: 'bio',
      render: (row) => (
        <div className="max-w-md truncate" title={row.bio}>
          {row.bio || '-'}
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'isActive',
      render: (row) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          row.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
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
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Authors Management</h1>
                <p className="mt-2 text-sm sm:text-base text-gray-600">Manage your blog authors</p>
              </div>
              <button
                onClick={handleAdd}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-300 text-gray-800 rounded-lg hover:from-yellow-400 hover:via-amber-400 hover:to-yellow-400 transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                + Add New Author
              </button>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-500">Loading authors...</div>
            </div>
          ) : (
            <Table
              columns={columns}
              data={authors}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {/* Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          title={editingAuthor ? 'Edit Author' : 'Add New Author'}
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter author name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter author bio"
              />
            </div>

            <div>
              <ImageUpload
                label="Author Image"
                value={formData.img}
                onChange={(url) => setFormData(prev => ({ ...prev, img: url }))}
                onFileSelect={(file) => setImageFile(file)}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                Active
              </label>
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
                {editingAuthor ? 'Update' : 'Create'}
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
