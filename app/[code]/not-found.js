import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-indigo-600 text-8xl font-bold mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Link Not Found</h1>
        <p className="text-gray-600 mb-6">
          The short link you&apos;re looking for doesn&apos;t exist or has been deleted.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Home size={20} />
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}