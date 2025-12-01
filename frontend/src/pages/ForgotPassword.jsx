import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import PublicHeader from '../components/PublicHeader';
import api from '../utils/axiosInstance';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setStatus('success');
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed');
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-screen">
      <PublicHeader />
      <div className="flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text">Forgot Password</h1>
            <p className="text-text-muted">Enter your email to receive a reset link</p>
          </div>

          {status === 'success' ? (
            <div className="bg-green-50 text-success p-3 rounded-lg mb-4 text-sm">
              If an account exists for this email, a reset link has been sent.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {error && <div className="bg-red-50 text-danger p-3 rounded-lg text-sm">{error}</div>}
              <Button type="submit" className="w-full" disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending…' : 'Send Reset Link'}
              </Button>
            </form>
          )}

          <p className="mt-4 text-center text-sm text-text-muted">
            Remembered it?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Back to sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
