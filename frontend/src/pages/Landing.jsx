import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import FeaturesGrid from '../components/FeaturesGrid';
import PublicHeader from '../components/PublicHeader';
import '../styles/landing.css';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-transparent text-text">
      <PublicHeader />

      <main className="mx-auto max-w-7xl px-4">
        <div className="mt-2 rounded-2xl bg-white/60 border border-white/50 glass">
          <div className="px-4 md:px-8">
            <Hero />
          </div>
        </div>

        <section className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
            <p className="text-2xl font-bold">₹0 fees</p>
            <p className="text-sm text-text-muted">Forever free personal tracking</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
            <p className="text-2xl font-bold">2× faster</p>
            <p className="text-sm text-text-muted">Quick add & smart filters</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
            <p className="text-2xl font-bold">Secure</p>
            <p className="text-sm text-text-muted">JWT auth, protected APIs</p>
          </div>
        </section>

        <FeaturesGrid />

        <section aria-labelledby="cta" className="mt-12">
          <h2 id="cta" className="sr-only">Get started</h2>
          <div className="rounded-2xl bg-gradient-to-r from-primary to-blue-600 text-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-blue-100">Start now</p>
              <h3 className="text-2xl md:text-3xl font-bold">Track expenses and share balances with ease</h3>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/register" className="px-6 py-3 rounded-xl bg-white text-primary font-semibold hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/50">Create account</Link>
              <Link to="/login" className="px-6 py-3 rounded-xl border border-white/40 text-white font-medium hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40">Sign in</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-7xl px-4 py-10 text-center text-sm text-text-muted">
        <p>© {new Date().getFullYear()} Expense Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}

