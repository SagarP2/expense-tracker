import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { getMyCollaborations,sendCollabInvite,acceptCollabInvite,rejectCollabInvite,getBalanceSummary } from '../../services/collabApi';
import { Users,Plus,Clock,CheckCircle,XCircle,ArrowRight,Mail } from 'lucide-react';
import { clsx } from 'clsx';

export default function CollaborationList() {
  const [collaborations,setCollaborations] = useState([]);
  const [balances,setBalances] = useState({}); // Store balance for each collaboration
  const [loading,setLoading] = useState(true);
  const [showInviteModal,setShowInviteModal] = useState(false);
  const [inviteEmail,setInviteEmail] = useState('');
  const [inviteLoading,setInviteLoading] = useState(false);
  const [error,setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchCollaborations = async () => {
    try {
      const data = await getMyCollaborations();
      setCollaborations(data);

      // Fetch balance for each active collaboration
      const balancePromises = data
        .filter(c => c.status === 'active')
        .map(async (collab) => {
          try {
            const balance = await getBalanceSummary(collab._id);
            return { id: collab._id,balance };
          } catch (error) {
            console.error(`Failed to fetch balance for ${collab._id}`,error);
            return { id: collab._id,balance: null };
          }
        });

      const balanceResults = await Promise.all(balancePromises);
      const balanceMap = {};
      balanceResults.forEach(({ id,balance }) => {
        balanceMap[id] = balance;
      });
      setBalances(balanceMap);
    } catch (error) {
      console.error('Failed to fetch collaborations',error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaborations();
  },[]);

  const handleSendInvite = async (e) => {
    e.preventDefault();
    setError('');
    setInviteLoading(true);
    try {
      await sendCollabInvite(inviteEmail);
      setShowInviteModal(false);
      setInviteEmail('');
      fetchCollaborations();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send invite');
    } finally {
      setInviteLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await acceptCollabInvite(id);
      fetchCollaborations();
    } catch (error) {
      console.error('Failed to accept invite',error);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectCollabInvite(id);
      fetchCollaborations();
    } catch (error) {
      console.error('Failed to reject invite',error);
    }
  };

  const activeCollabs = collaborations.filter(c => c.status === 'active');
  const pendingInvites = collaborations.filter(c => c.status === 'pending');
  const rejectedInvites = collaborations.filter(c => c.status === 'rejected' && c.createdBy._id === user._id);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-text">Collaborations</h2>
          <p className="text-text-muted mt-1">Manage shared expenses with others</p>
        </div>
        <Button onClick={() => setShowInviteModal(true)} className="flex items-center gap-2 shadow-glow">
          <Plus size={20} />
          Invite User
        </Button>
      </div>

      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-text flex items-center gap-2">
            <Clock size={20} className="text-yellow-600" />
            Pending Invitations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingInvites.map((collab) => {
              const otherUser = collab.users.find(u => u._id !== collab.createdBy._id);
              const isSentByMe = collab.createdBy._id === user._id;

              return (
                <Card key={collab._id} className="p-5 border-l-4 border-l-yellow-500">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                        <Users size={24} />
                      </div>
                      <div>
                        <p className="font-semibold text-text">
                          {isSentByMe ? `Invited ${otherUser?.name}` : `Invitation from ${collab.createdBy.name}`}
                        </p>
                        <p className="text-sm text-text-muted">{otherUser?.email || collab.createdBy.email}</p>
                      </div>
                    </div>
                    <Badge variant="warning" className="bg-yellow-50 text-yellow-700">Pending</Badge>
                  </div>

                  {!isSentByMe && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        onClick={() => handleAccept(collab._id)}
                        className="flex-1 flex items-center justify-center gap-1"
                      >
                        <CheckCircle size={16} />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleReject(collab._id)}
                        className="flex-1 flex items-center justify-center gap-1"
                      >
                        <XCircle size={16} />
                        Reject
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Rejected/Cancelled Invites */}
      {rejectedInvites.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-text flex items-center gap-2">
            <XCircle size={20} className="text-red-600" />
            Cancelled Invitations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rejectedInvites.map((collab) => {
              const otherUser = collab.users.find(u => u._id !== collab.createdBy._id);

              return (
                <Card key={collab._id} className="p-5 border-l-4 border-l-red-500 bg-red-50/50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                        <Users size={24} />
                      </div>
                      <div>
                        <p className="font-semibold text-text">
                          Invitation to {otherUser?.name}
                        </p>
                        <p className="text-sm text-text-muted">{otherUser?.email}</p>
                      </div>
                    </div>
                    <Badge variant="danger" className="bg-red-50 text-red-700">Cancelled</Badge>
                  </div>
                  <p className="text-sm text-red-600 mt-2">This invitation was rejected by the user.</p>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Collaborations */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-text flex items-center gap-2">
          <CheckCircle size={20} className="text-success" />
          Active Collaborations
        </h3>

        {activeCollabs.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                <Users size={40} className="text-gray-400" />
              </div>
              <div>
                <p className="text-text-muted font-medium">No active collaborations yet</p>
                <p className="text-sm text-text-muted mt-1">Invite someone to start sharing expenses</p>
              </div>
              <Button onClick={() => setShowInviteModal(true)} className="mt-2">
                <Plus size={18} className="mr-2" />
                Send Invite
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCollabs.map((collab) => {
              const otherUser = collab.users.find(u => u._id !== user._id);
              const balance = balances[collab._id];
              const isSettled = balance && Math.abs(balance.owedAmount) < 0.01;

              return (
                <Card
                  key={collab._id}
                  hover
                  className="p-6 cursor-pointer group"
                  onClick={() => navigate(`/collaborations/${collab._id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-sm">
                        <Users size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-text group-hover:text-primary transition-colors">
                          {otherUser?.name || 'Shared Group'}
                        </p>
                        <p className="text-sm text-text-muted">{otherUser?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Badge variant="success">Active</Badge>
                      {isSettled && (
                        <Badge variant="default" className="bg-green-100 text-green-700">Settled</Badge>
                      )}
                    </div>
                    <ArrowRight size={18} className="text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-md relative animate-slide-up shadow-2xl border-none">
            <button
              onClick={() => {
                setShowInviteModal(false);
                setError('');
                setInviteEmail('');
              }}
              className="absolute top-4 right-4 text-text-muted hover:text-text p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XCircle size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-text">Invite User</h3>
                <p className="text-sm text-text-muted">Start sharing expenses together</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-danger p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSendInvite} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
                placeholder="user@example.com"
                className="text-base"
              />

              <Button
                type="submit"
                className="w-full py-3 text-base shadow-glow"
                disabled={inviteLoading}
              >
                {inviteLoading ? 'Sending...' : 'Send Invitation'}
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
