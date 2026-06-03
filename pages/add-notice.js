import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AddNotice() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    category: 'General',
    priority: 'Normal',
    publishDate: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Extra Date validation check
    if (isNaN(Date.parse(formData.publishDate))) {
      setError('Please enter a valid date.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/');
      } else {
        const data = await res.json();
        setError(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setError('Failed to submit form.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New Notice</h1>
        <Link href="/" className="text-blue-500 hover:underline">View All</Link>
      </div>
      
      {error && <p className="text-red-500 mb-4 text-sm font-medium">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title *</label>
          <input
            type="text"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Body *</label>
          <textarea
            required
            rows="4"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category *</label>
            <select
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="General">General</option>
              <option value="Exam">Exam</option>
              <option value="Event">Event</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Priority *</label>
            <div className="mt-2 flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="priority"
                  value="Normal"
                  checked={formData.priority === 'Normal'}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">Normal</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="priority"
                  value="Urgent"
                  checked={formData.priority === 'Urgent'}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="text-red-600"
                />
                <span className="ml-2 text-sm text-gray-700">Urgent</span>
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Publish Date *</label>
          <input
            type="date"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            value={formData.publishDate}
            onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL (Optional)</label>
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
        >
          {loading ? 'Saving...' : 'Create Notice'}
        </button>
      </form>
    </div>
  );
}