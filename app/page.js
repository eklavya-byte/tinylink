'use client';

import { useState, useEffect } from 'react';
import { Copy, ExternalLink, Trash2, Plus, Search, BarChart2 } from 'lucide-react';

export default function Home() {
  const [links, setLinks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [targetUrl, setTargetUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/links');
      const data = await res.json();
      setLinks(data);
    } catch (err) {
      setError('Failed to fetch links');
    }
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl,
          customCode: customCode || undefined
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create link');
        setLoading(false);
        return;
      }

      setSuccess(`Link created! Short URL: ${window.location.origin}/${data.code}`);
      setTargetUrl('');
      setCustomCode('');
      setShowAddForm(false);
      fetchLinks();
    } catch (err) {
      setError('Failed to create link');
    }
    setLoading(false);
  };

  const handleDelete = async (code) => {
    if (!confirm(`Are you sure you want to delete "${code}"?`)) return;

    try {
      const res = await fetch(`/api/links/${code}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccess('Link deleted');
        fetchLinks();
      }
    } catch (err) {
      setError('Failed to delete link');
    }
  };

  const handleCopy = async (text) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setSuccess('Copied to clipboard!');
        setTimeout(() => setSuccess(''), 2000);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            setSuccess('Copied to clipboard!');
            setTimeout(() => setSuccess(''), 2000);
          } else {
            setError('Failed to copy to clipboard');
            setTimeout(() => setError(''), 2000);
          }
        } catch (err) {
          setError('Failed to copy to clipboard');
          setTimeout(() => setError(''), 2000);
        }
        
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Copy failed:', err);
      setError('Failed to copy to clipboard');
      setTimeout(() => setError(''), 2000);
    }
  };

  const filteredLinks = links.filter(link =>
    link.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.target_url?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const truncateUrl = (url, maxLength = 50) => {
    return url?.length > maxLength ? url.substring(0, maxLength) + '...' : url;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">TinyLink</h1>
          <p className="text-gray-700 text-lg">Shorten URLs, track clicks, manage links</p>
        </div>

        {success && (
          <div className="bg-green-100 border border-green-500 text-green-800 px-4 py-3 rounded mb-4 font-medium">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-500 text-red-800 px-4 py-3 rounded mb-4 font-medium">
            {error}
          </div>
        )}

        {showAddForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Short Link</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Target URL *
                </label>
                <input
                  type="text"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://example.com/your-long-url"
                  className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Custom Code (optional)
                </label>
                <input
                  type="text"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  placeholder="mycode (6-8 alphanumeric characters)"
                  className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-base"
                />
                <p className="text-sm text-gray-600 mt-2">Leave blank to auto-generate</p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={loading || !targetUrl}
                  className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Creating...' : 'Create Link'}
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setError('');
                    setTargetUrl('');
                    setCustomCode('');
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus size={20} />
              Add Link
            </button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 text-gray-500" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by code or URL..."
                className="w-full pl-10 pr-4 py-3 text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-base"
              />
            </div>
          </div>

          {filteredLinks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4 font-medium">
                {searchTerm ? 'No links found' : 'No links yet'}
              </p>
              {!searchTerm && !showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Create Your First Link
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-bold text-gray-900">Short Code</th>
                    <th className="px-4 py-4 text-left text-sm font-bold text-gray-900">Target URL</th>
                    <th className="px-4 py-4 text-left text-sm font-bold text-gray-900">Clicks</th>
                    <th className="px-4 py-4 text-left text-sm font-bold text-gray-900">Last Clicked</th>
                    <th className="px-4 py-4 text-left text-sm font-bold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLinks.map((link) => (
                    <tr key={link.code} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <code className="font-mono font-bold text-indigo-700 text-base">
                            {link.code}
                          </code>
                          <button
                            onClick={() => handleCopy(`${window.location.origin}/${link.code}`)}
                            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                            title="Copy to clipboard"
                          >
                            <Copy size={16} className="text-gray-700" />
                          </button>
                          <a
                            href={`/${link.code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 hover:bg-indigo-100 rounded transition-colors"
                            title="Open short link"
                          >
                            <ExternalLink size={16} className="text-indigo-700" />
                          </a>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <a
                          href={link.target_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 font-medium"
                          title={link.target_url}
                        >
                          {truncateUrl(link.target_url)}
                          <ExternalLink size={14} />
                        </a>
                      </td>
                      <td className="px-4 py-4 font-bold text-gray-900 text-base">{link.clicks}</td>
                      <td className="px-4 py-4 text-sm text-gray-700 font-medium">
                        {formatDate(link.last_clicked)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => alert('Analytics coming soon!')}
                            className="p-2 text-blue-700 hover:bg-blue-100 rounded transition-colors"
                            title="View analytics"
                          >
                            <BarChart2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(link.code)}
                            className="p-2 text-red-700 hover:bg-red-100 rounded transition-colors"
                            title="Delete link"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}