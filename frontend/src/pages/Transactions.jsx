import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import api from '../utils/axiosInstance';
import { formatCurrency } from '../utils/format';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Plus, Search, Trash2, Edit2, Filter, X, Calendar, ArrowUpRight, ArrowDownRight, Tag } from 'lucide-react';
import clsx from 'clsx';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [lockedType, setLockedType] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null });
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    customCategory: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  // include month filter (default to current month)
  const [filter, setFilter] = useState({
    type: '',
    search: '',
    month: new Date().toISOString().slice(0, 7), // YYYY-MM
  });

  // default categories (for UI only). Keep synced with backend defaults if any.
  const defaultCategories = {
    expense: ['Food', 'Rent', 'Bill', 'Traveling', 'Personal', 'Other'],
    income: ['Salary', 'Home', 'Other'],
  };

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get('/transactions');
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Compute final category to save:
    const categoryToSave =
      formData.category === '__other__'
        ? (formData.customCategory ?? '').trim()
        : (formData.category ?? '').trim();

    if (!categoryToSave) {
      alert('Please provide a category.');
      return;
    }

    // Build payload
    const payload = {
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: categoryToSave,
      description: formData.description,
      date: formData.date,
    };

    try {
      if (editingId) {
        await api.put(`/transactions/${editingId}`, payload);
      } else {
        await api.post('/transactions', payload);
      }

      // Close modal & reset form
      setShowModal(false);
      setEditingId(null);
      setFormData({
        amount: '',
        type: 'expense',
        category: '',
        customCategory: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });

      // Refresh list
      fetchTransactions();
    } catch (error) {
      console.error('Failed to save transaction', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (error) {
      console.error('Failed to delete transaction', error);
    }
  };

  const handleEdit = (t) => {
    setEditingId(t._id);
    setLockedType(null);

    // Determine whether category is a default option or a custom one
    const isDefaultCategory = defaultCategories[t.type || 'expense'].includes(t.category);

    setFormData({
      amount: t.amount,
      type: t.type,
      category: isDefaultCategory ? t.category : '__other__',
      customCategory: isDefaultCategory ? '' : t.category,
      description: t.description || '',
      date: new Date(t.date).toISOString().split('T')[0],
    });

    setShowModal(true);
  };

  // Filter transactions for display
  const filteredTransactions = transactions.filter((t) => {
    const matchesType = filter.type ? t.type === filter.type : true;

    const search = (filter.search ?? '').trim().toLowerCase();
    const matchesSearch =
      !search ||
      (t.description && t.description.toLowerCase().includes(search)) ||
      (t.category && t.category.toLowerCase().includes(search));

    const matchesMonth = filter.month
      ? (() => {
        try {
          const tMonth = new Date(t.date).toISOString().slice(0, 7); // YYYY-MM
          return tMonth === filter.month;
        } catch (err) {
          return typeof t.date === 'string' && t.date.startsWith(filter.month);
        }
      })()
      : true;

    return matchesType && matchesSearch && matchesMonth;
  }).sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (dateB - dateA !== 0) return dateB - dateA;

    // If dates are same, sort by createdAt (newest first)
    const createdA = new Date(a.createdAt || 0);
    const createdB = new Date(b.createdAt || 0);
    return createdB - createdA;
  });

  if (loading)
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-sm">
        <div>
          <h2 className="text-3xl font-bold text-text tracking-tight">Transactions</h2>
          <p className="text-text-muted mt-1 font-medium">Manage your financial records</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            onClick={() => {
              setEditingId(null);
              setLockedType('income');
              setFormData({
                amount: '',
                type: 'income',
                category: '',
                customCategory: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
              });
              setShowModal(true);
            }}
            className="flex-1 sm:flex-none items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-none transition-all hover:-translate-y-0.5"
          >
            <Plus size={18} />
            Add Income
          </Button>
          <Button
            onClick={() => {
              setEditingId(null);
              setLockedType('expense');
              setFormData({
                amount: '',
                type: 'expense',
                category: '',
                customCategory: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
              });
              setShowModal(true);
            }}
            className="flex-1 sm:flex-none items-center justify-center gap-2 shadow-lg shadow-rose-500/20 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white border-none transition-all hover:-translate-y-0.5"
          >
            <Plus size={18} />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white/30 p-2 rounded-2xl border border-white/40 shadow-sm">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border-none bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 shadow-sm transition-all placeholder:text-gray-400"
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          />
        </div>

        {/* Month filter */}
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
          <input
            type="month"
            className="pl-11 pr-4 py-3 rounded-xl border-none bg-white/50 
               focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 
               shadow-sm transition-all cursor-pointer text-sm font-medium text-text min-w-[160px]"
            value={filter.month}
            onChange={(e) => setFilter({ ...filter, month: e.target.value })}
            onKeyDown={(e) => e.preventDefault()}
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
          <select
            className="pl-11 pr-10 py-3 rounded-xl border-none bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 shadow-sm transition-all cursor-pointer text-sm font-medium text-text appearance-none min-w-[140px]"
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-gray-400"></div>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block overflow-hidden p-2 border-0 shadow-lg rounded-3xl bg-white/80 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-5 text-sm font-semibold text-gray-500 uppercase tracking-wider w-[210px]">Date</th>
                <th className="text-left py-4 px-5 text-sm font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                <th className="text-left py-4 px-5 text-sm font-semibold text-gray-500 uppercase tracking-wider w-[180px]">Category</th>
                <th className="text-left py-4 px-5 text-sm font-semibold text-gray-500 uppercase tracking-wider w-[180px]">Amount</th>
                <th className="text-right py-4 px-5 text-sm font-semibold text-gray-500 uppercase tracking-wider w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTransactions.map((t) => (
                <tr key={t._id} className="hover:bg-blue-50/40 transition-colors group">
                  <td className="py-4 px-5 text-base text-text-muted">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg text-gray-500 group-hover:bg-white group-hover:text-primary group-hover:shadow-sm transition-all">
                        <Calendar size={18} />
                      </div>
                      <span className="font-medium text-sm whitespace-nowrap">
                        {new Date(t.date).toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase()}, {new Date(t.date).toLocaleDateString('en-GB').replace(/\//g, '-')}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-base font-medium text-text truncate max-w-[240px]">{t.description}</td>
                  <td className="py-4 px-5">
                    <Badge variant="outline" className="flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-lg text-sm bg-gray-50 border border-gray-200 font-medium text-text-muted">
                      {t.category}
                    </Badge>


                  </td>
                  <td className="py-4 px-5 text-base font-bold">
                    <span
                      className={clsx(
                        'flex items-center gap-1.5 w-fit px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm border',
                        t.type === 'income'
                          ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
                          : 'text-rose-700 bg-rose-50 border-rose-100'
                      )}
                    >
                      {t.type === 'income' ? <ArrowUpRight size={16} strokeWidth={2.5} /> : <ArrowDownRight size={16} strokeWidth={2.5} />}
                      {formatCurrency(t.amount)}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2 transition-opacity translate-x-2">
                      <button onClick={() => handleEdit(t)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => setDeleteDialog({ isOpen: true, id: t._id })} className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-20 text-center text-text-muted">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-gray-50 rounded-full">
                        <Search size={32} className="opacity-20" />
                      </div>
                      <p className="font-medium">No transactions found</p>
                      <p className="text-xs opacity-60">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card >

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredTransactions.map((t) => (
          <Card key={t._id} className="p-5 flex flex-col gap-4 border-none shadow-lg bg-white/90 backdrop-blur-sm rounded-3xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-text text-lg">{t.description || t.category}</p>
                <p className="text-sm text-text-muted flex items-center gap-1.5 mt-1.5 font-medium">
                  <Calendar size={14} className="text-primary/60" />
                  {new Date(t.date).toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase()}, {new Date(t.date).toLocaleDateString('en-GB').replace(/\//g, '-')}
                </p>
              </div>
              <span
                className={clsx(
                  'font-bold text-lg flex items-center gap-1 px-3 py-1 rounded-xl',
                  t.type === 'income' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
                )}
              >
                {t.type === 'income' ? '+' : '-'}
                {formatCurrency(t.amount)}
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <Badge variant="outline" className="bg-gray-50 border-gray-200 px-3 py-1">
                {t.category}
              </Badge>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(t)} className="p-2.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-colors">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => setDeleteDialog({ isOpen: true, id: t._id })} className="p-2.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </Card>
        ))}
        {filteredTransactions.length === 0 && (
          <div className="text-center text-text-muted py-12">
            <div className="p-4 bg-gray-50 rounded-full inline-block mb-3">
              <Search size={24} className="opacity-20" />
            </div>
            <p className="font-medium">No transactions found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {
        showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
            <Card className="w-full max-w-md relative animate-slide-up shadow-2xl border-none rounded-3xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-purple-600"></div>
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-text p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <div className="p-6 pt-8">
                <h3 className="text-2xl font-bold mb-1 text-text">
                  {editingId ? 'Edit Transaction' : lockedType === 'income' ? 'Add Income' : lockedType === 'expense' ? 'Add Expense' : 'Add Transaction'}
                </h3>
                <p className="text-text-muted text-sm mb-6">Enter the details below</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* TYPE SELECTOR - Only show if not locked */}
                  {!lockedType && (
                    <div className="grid grid-cols-2 gap-4 p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value="expense"
                          checked={formData.type === 'expense'}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, type: e.target.value, category: '', customCategory: '' }))
                          }
                          className="hidden peer"
                        />
                        <div className="text-center py-3 rounded-xl text-sm font-bold text-gray-500 transition-all peer-checked:bg-white peer-checked:text-rose-600 peer-checked:shadow-sm">
                          Expense
                        </div>
                      </label>

                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value="income"
                          checked={formData.type === 'income'}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, type: e.target.value, category: '', customCategory: '' }))
                          }
                          className="hidden peer"
                        />
                        <div className="text-center py-3 rounded-xl text-sm font-bold text-gray-500 transition-all peer-checked:bg-white peer-checked:text-emerald-600 peer-checked:shadow-sm">
                          Income
                        </div>
                      </label>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* AMOUNT */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Amount</label>
                      <Input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                        required
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="text-lg font-bold py-3"
                      />
                    </div>

                    {/* CATEGORY FIELD */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Category</label>
                      {formData.category === '__other__' ? (
                        <input
                          type="text"
                          placeholder="Enter custom category"
                          value={formData.customCategory}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              customCategory: e.target.value,
                              category: '__other__',
                            }))
                          }
                          onBlur={() => {
                            setFormData((prev) => {
                              if ((prev.customCategory ?? '').trim() !== '') {
                                return { ...prev, category: '__other__' };
                              } else {
                                return { ...prev, category: '', customCategory: '' };
                              }
                            });
                          }}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                        />
                      ) : (
                        <div className="relative">
                          <select
                            value={formData.category}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === 'Other') {
                                setFormData((prev) => ({ ...prev, category: '__other__', customCategory: '' }));
                              } else {
                                setFormData((prev) => ({ ...prev, category: value, customCategory: '' }));
                              }
                            }}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer text-sm font-medium appearance-none"
                          >
                            <option value="">Select Category</option>
                            {(formData.type === 'expense' ? defaultCategories.expense : defaultCategories.income).map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-currentColor"></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* DESCRIPTION */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Description</label>
                      <Input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="What was this for?"
                        className="py-3"
                      />
                    </div>

                    {/* DATE */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Date</label>
                      <Input
                        type="date"
                        value={formData.date}
                        max={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                        required
                        className="py-3"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full py-4 text-base font-bold shadow-lg shadow-primary/25 mt-4 rounded-xl hover:scale-[1.02] transition-transform">
                    {editingId ? 'Save Changes' : 'Add Transaction'}
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        )
      }

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, id: null })}
        onConfirm={() => handleDelete(deleteDialog.id)}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
      />
    </div >
  );
}
