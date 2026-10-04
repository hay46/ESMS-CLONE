import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CommandPalette from './components/layout/CommandPalette';
import AuthModal from './components/auth/AuthModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { I18nProvider } from './context/I18nContext';
import { ToastProvider } from './context/ToastContext';
import Home from './pages/Home';
import About from './pages/About';
import Admissions from './pages/Admissions';
import Academics from './pages/Academics';
import Faculty from './pages/Faculty';
import Blog from './pages/Blog';
import Events from './pages/Events';
import Contact from './pages/Contact';
import Dashboard from './pages/dashboard/Dashboard';
import NotFound from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function Shell() {
  const [authMode, setAuthMode] = useState(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { profile } = useAuth();

  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header onOpenAuth={setAuthMode} onOpenCommand={() => setPaletteOpen(true)} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/events" element={<Events />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/dashboard"
            element={
              profile ? (
                <Dashboard />
              ) : (
                <NavigateToPortal onOpenAuth={() => setAuthMode('login')} />
              )
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <AuthModal mode={authMode} onClose={() => setAuthMode(null)} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}

function NavigateToPortal({ onOpenAuth }) {
  return (
    <section className="bg-slate-50 py-32">
      <div className="container mx-auto px-6 text-center">
        <h1 className="mb-4 text-4xl font-bold text-[#0f172a]">Portal access required</h1>
        <p className="mb-8 text-slate-500">
          Sign in with your school account to open the management portal.
        </p>
        <button
          type="button"
          onClick={onOpenAuth}
          className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700"
        >
          Login to Portal
        </button>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <ToastProvider>
        <AuthProvider>
          <Shell />
        </AuthProvider>
      </ToastProvider>
    </I18nProvider>
  );
}