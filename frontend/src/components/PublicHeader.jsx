import { Link } from 'react-router-dom';

export default function PublicHeader() {
  return (
    <header className="w-full border-b border-gray-200/70 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold">ET</div>
          <span className="font-semibold">Expense Tracker</span>
        </div>
        <nav className="flex items-center gap-3">
          <Link to="/login" className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20">Log in</Link>
          <Link to="/register" className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary/50">Sign up</Link>
        </nav>
      </div>
    </header>
  );
}
