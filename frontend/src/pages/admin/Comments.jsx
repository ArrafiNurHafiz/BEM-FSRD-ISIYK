import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiTrash2 } from 'react-icons/fi';
import api from '../../services/api';

const AdminComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchComments();
  }, [filter]);

  const fetchComments = async () => {
    try {
      // We need to get all news and their comments
      const newsRes = await api.get('/news?limit=100');
      const allComments = [];
      
      for (const news of newsRes.data.data) {
        try {
          const commentRes = await api.get(`/comments/news/${news.id}?status=${filter}`);
          const commentsWithNews = commentRes.data.data.map(c => ({
            ...c,
            news_title: news.title,
            news_id: news.id,
          }));
          allComments.push(...commentsWithNews);
        } catch (error) {
          // Skip if error
        }
      }
      
      setComments(allComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/comments/${id}/status`, { status });
      fetchComments();
    } catch (error) {
      alert('Error updating comment status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus komentar ini?')) return;
    try {
      await api.delete(`/comments/${id}`);
      fetchComments();
    } catch (error) {
      alert('Error deleting comment');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Komentar</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'pending' ? 'bg-primary-800 text-white' : 'bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'approved' ? 'bg-primary-800 text-white' : 'bg-gray-200'
            }`}
          >
            Approved
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="card p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold">{comment.name}</h4>
                <p className="text-sm text-gray-500">{comment.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Pada: {comment.news_title}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  comment.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : comment.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {comment.status}
              </span>
            </div>
            <p className="text-gray-700 mb-4">{comment.content}</p>
            <div className="flex gap-2">
              {comment.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleStatusChange(comment.id, 'approved')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
                  >
                    <FiCheck className="mr-2" /> Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(comment.id, 'rejected')}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center"
                  >
                    <FiX className="mr-2" /> Reject
                  </button>
                </>
              )}
              <button
                onClick={() => handleDelete(comment.id)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center"
              >
                <FiTrash2 className="mr-2" /> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminComments;

