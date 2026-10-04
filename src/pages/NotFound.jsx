import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="bg-slate-50 py-32">
      <div className="container mx-auto px-6 text-center">
        <p className="mb-4 text-7xl font-black text-blue-100">404</p>
        <h1 className="mb-6 text-4xl font-bold text-[#0f172a]">Page not found</h1>
        <p className="mx-auto mb-10 max-w-md text-slate-500">
          The page you are looking for has moved or never existed.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700"
        >
          <Home className="h-5 w-5" />
          Back to home
        </Link>
      </div>
    </section>
  );
}