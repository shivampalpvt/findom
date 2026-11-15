import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <h2 className="text-3xl font-black text-slate-900">404 - Page Not Found</h2>
      <p className="text-sm text-slate-500 mt-2">The page or portal route you requested could not be found.</p>
      <Link
        href="/"
        className="mt-6 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
      >
        Return to Homepage
      </Link>
    </div>
  );
}
