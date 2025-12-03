import { X,AlertCircle,CheckCircle } from 'lucide-react';
import { Card } from './Card';

export function AlertModal({ isOpen,onClose,title,message,type = 'info' }) {
    if (!isOpen) return null;

    const isSuccess = type === 'success';
    const isError = type === 'error';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <Card className="w-full max-w-sm relative animate-slide-up shadow-2xl border-none">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-text-muted hover:text-text p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center pt-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isSuccess ? 'bg-green-100 text-green-600' :
                            isError ? 'bg-red-100 text-red-600' :
                                'bg-blue-100 text-blue-600'
                        }`}>
                        {isSuccess ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                    </div>

                    <h3 className="text-xl font-bold mb-2 text-text">{title}</h3>
                    <p className="text-text-muted mb-6">{message}</p>

                    <button
                        onClick={onClose}
                        className={`w-full py-2.5 rounded-xl text-white font-medium shadow-lg transition-all ${isSuccess ? 'bg-success hover:bg-success/90 shadow-success/20' :
                                isError ? 'bg-danger hover:bg-danger/90 shadow-danger/20' :
                                    'bg-primary hover:bg-primary/90 shadow-primary/20'
                            }`}
                    >
                        Okay
                    </button>
                </div>
            </Card>
        </div>
    );
}
