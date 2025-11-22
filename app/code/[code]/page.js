'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Copy, ExternalLink, ArrowLeft } from 'lucide-react';

export default function StatsPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code;
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (code) {
      // eslint-disable-next-line react-hooks/immutability
      fetchLink();
    }
  }, [code]);

  const fetchLink = async () => {
    try {
      const res = await fetch(`/api/links/${code}`);
      if (!res.ok) {
        setError('Link not found');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setLink(data);
    } catch (err) {
      setError('Failed to fetch link');
    }
    setLoading(false);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
          <p className="text-gray-600 mb-4">Link not found</p>
          <button
            onClick={() => router.push('/')}
            className="text-indigo-600 hover:underline"
          >
            Go back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Link Statistics</h1>
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              <ArrowLeft size={20} />
              Back
            </button>
          </div>

          <div className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-sm text-gray-500 mb-1">Short Code</h2>
              <div className="flex items-center gap-2">
                <code className="text-2xl font-mono font-bold text-indigo-600">
                  {link.code}
                </code>
                <button
                  onClick={() => handleCopy(`${window.location.origin}/${link.code}`)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <Copy size={20} />
                </button>
              </div>
            </div>

            <div className="border-b pb-4">
              <h2 className="text-sm text-gray-500 mb-1">Target URL</h2>
              <div className="flex items-center gap-2">
                <p className="text-lg break-all">{link.target_url}</p>
                <a
                  href={link.target_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <ExternalLink size={20} />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                <h3 className="text-sm text-gray-600 mb-2">Total Clicks</h3>
                <p className="text-4xl font-bold text-blue-600">{link.clicks}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                <h3 className="text-sm text-gray-600 mb-2">Created</h3>
                <p className="text-sm font-semibold text-green-700">
                  {formatDate(link.created_at)}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                <h3 className="text-sm text-gray-600 mb-2">Last Clicked</h3>
                <p className="text-sm font-semibold text-purple-700">
                  {formatDate(link.last_clicked)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}