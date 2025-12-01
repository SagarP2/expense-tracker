import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">New • Collaboration tracking</p>
          <h1 id="hero-title" className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Track expenses</span> and share balances effortlessly
          </h1>
          <p className="mt-4 text-lg text-text-muted">Clean workflows, fast filters, and helpful insights designed for everyday use.</p>
          <div className="mt-6 flex items-center gap-3">
            <Link to="/register" className="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary/50">Get started</Link>
            <Link to="/login" className="px-6 py-3 rounded-xl border border-gray-200 text-text font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20">Sign in</Link>
          </div>
          <div className="mt-6 flex items-center gap-6 text-sm text-text-muted">
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-success"></span> No setup required</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary"></span> Secure by design</div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full" aria-hidden="true" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full" aria-hidden="true" />
          <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-soft">
            <svg role="img" aria-label="Analytics preview" viewBox="0 0 400 300" className="w-full h-full">
              <defs>
                <linearGradient id="g" x1="0" x2="1">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
              </defs>
              <rect width="400" height="300" fill="#f8fafc" />
              <rect x="24" y="24" width="352" height="60" rx="12" fill="#ffffff" stroke="#e2e8f0" />
              <rect x="40" y="40" width="200" height="16" rx="8" fill="#e2e8f0" />
              <rect x="24" y="100" width="352" height="160" rx="12" fill="#ffffff" stroke="#e2e8f0" />
              <polyline points="40,220 120,180 200,210 280,150 360,170" fill="none" stroke="#2563eb" strokeWidth="4" />
              <polyline points="40,230 120,190 200,220 280,160 360,185" fill="none" stroke="#ef4444" strokeWidth="3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
