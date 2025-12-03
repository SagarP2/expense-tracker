import { useState,useEffect } from 'react';
import { X,CreditCard,Wallet } from 'lucide-react';
import { Button } from './ui/Button';
import { formatCurrency } from '../utils/format';

export const PaymentModal = ({
    isOpen,
    onClose,
    payer,
    receiver,
    amount,
    onConfirm
}) => {
    const [paymentMethod,setPaymentMethod] = useState('UPI');
    const [isLoading,setIsLoading] = useState(false);
    const [paymentAmount,setPaymentAmount] = useState(amount);
    const [amountError,setAmountError] = useState('');

    // Update paymentAmount when amount prop changes
    useEffect(() => {
        setPaymentAmount(amount);
        setAmountError('');
    },[amount]);

    const handleAmountChange = (e) => {
        const value = e.target.value;

        // Allow empty string for user to clear and retype
        if (value === '') {
            setPaymentAmount('');
            setAmountError('Amount is required');
            return;
        }

        const numValue = parseFloat(value);

        // Validate numeric
        if (isNaN(numValue)) {
            setAmountError('Please enter a valid number');
            return;
        }

        // Validate positive
        if (numValue <= 0) {
            setAmountError('Amount must be greater than 0');
            setPaymentAmount(value);
            return;
        }

        // Validate not exceeding max
        if (numValue > amount) {
            setAmountError(`Amount cannot exceed ${formatCurrency(amount)}`);
            setPaymentAmount(value);
            return;
        }

        // Valid amount
        setPaymentAmount(value);
        setAmountError('');
    };

    const isValidAmount = paymentAmount && !amountError && parseFloat(paymentAmount) > 0 && parseFloat(paymentAmount) <= amount;

    if (!isOpen) return null;

    const handleConfirm = async () => {
        if (!isValidAmount) return;

        setIsLoading(true);
        try {
            await onConfirm(paymentMethod,parseFloat(paymentAmount));
            onClose();
        } catch (error) {
            // Error handling is done in parent component
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fadeIn">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-text mb-2">Settle Payment</h3>
                    <p className="text-text-muted text-sm">Choose your payment method to complete the settlement</p>
                </div>

                {/* Payment Details */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-100">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-text-muted text-sm">From</span>
                            <span className="font-semibold text-text">{payer}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-text-muted text-sm">To</span>
                            <span className="font-semibold text-text">{receiver}</span>
                        </div>
                        <div className="h-px bg-blue-200 my-2"></div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-text-muted text-sm">Payment Amount</span>
                                <span className="text-xs text-text-muted">Max: {formatCurrency(amount)}</span>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-bold text-lg">₹</span>
                                <input
                                    type="number"
                                    value={paymentAmount}
                                    onChange={handleAmountChange}
                                    disabled={isLoading}
                                    step="0.01"
                                    min="0"
                                    max={amount}
                                    className={`w-full pl-8 pr-4 py-2 text-xl font-bold rounded-lg border-2 transition-colors ${amountError
                                        ? 'border-red-300 bg-red-50 text-red-600'
                                        : 'border-blue-200 bg-white text-primary focus:border-primary focus:ring-2 focus:ring-primary/20'
                                        } outline-none`}
                                    placeholder="0.00"
                                />
                            </div>
                            {amountError && (
                                <p className="text-xs text-red-600 mt-1">{amountError}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Payment Method Selection */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-text mb-3">Payment Method</label>
                    <div className="space-y-3">
                        {/* UPI Option */}
                        <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'UPI'
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="UPI"
                                checked={paymentMethod === 'UPI'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                disabled={isLoading}
                                className="w-4 h-4 text-primary focus:ring-primary"
                            />
                            <div className="ml-3 flex items-center gap-3 flex-1">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${paymentMethod === 'UPI' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    <CreditCard size={20} />
                                </div>
                                <div>
                                    <div className="font-semibold text-text">UPI</div>
                                    <div className="text-xs text-text-muted">Google Pay, PhonePe, Paytm</div>
                                </div>
                            </div>
                        </label>

                        {/* Cash Option */}
                        <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'Cash'
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="Cash"
                                checked={paymentMethod === 'Cash'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                disabled={isLoading}
                                className="w-4 h-4 text-primary focus:ring-primary"
                            />
                            <div className="ml-3 flex items-center gap-3 flex-1">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${paymentMethod === 'Cash' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    <Wallet size={20} />
                                </div>
                                <div>
                                    <div className="font-semibold text-text">Cash</div>
                                    <div className="text-xs text-text-muted">Physical currency</div>
                                </div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-text"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isLoading || !isValidAmount}
                        className="flex-1 bg-primary hover:bg-primary/90 text-white shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Processing...
                            </div>
                        ) : (
                            `Confirm Payment`
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};
