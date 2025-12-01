import { Zap, Users, BarChart3, Shield } from 'lucide-react';

export default function FeaturesGrid() {
  const features = [
    { title: 'Fast Transactions', desc: 'Add and edit quickly with smart filters.', icon: Zap, color: 'text-primary' },
    { title: 'Collaboration', desc: 'Invite friends and settle shared balances.', icon: Users, color: 'text-blue-600' },
    { title: 'Analytics', desc: 'Charts to visualize category and monthly spend.', icon: BarChart3, color: 'text-green-600' },
    { title: 'Secure', desc: 'JWT auth and protected APIs for safety.', icon: Shield, color: 'text-yellow-600' },
  ];

  return (
    <section aria-labelledby="features-title" className="mt-12">
      <div className="text-center">
        <h2 id="features-title" className="text-2xl md:text-3xl font-bold">Everything you need</h2>
        <p className="mt-2 text-text-muted">Minimal features that matter for expense tracking.</p>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f) => (
          <article key={f.title} className="rounded-2xl border border-gray-200 bg-white p-6 card-hover" aria-label={f.title}>
            <div className={`w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center ${f.color}`}>
              <f.icon size={20} />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-text-muted">{f.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
