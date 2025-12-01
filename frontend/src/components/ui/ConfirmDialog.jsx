import { X } from 'lucide-react';
import { Card } from './Card';

export function ConfirmDialog({ isOpen,onClose,onConfirm,title = 'Confirm Action',message = 'Are you sure?' }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <Card className="w-full max-w-md relative animate-slide-up shadow-2xl border-none">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-text-muted hover:text-text p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X size={20} />
                </button>

                <h3 className="text-2xl font-bold mb-4 text-text">{title}</h3>
                <p className="text-text-muted mb-6">{message}</p>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-text hover:bg-gray-50 transition-all font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-4 py-2 rounded-lg bg-danger text-white hover:bg-danger/90 transition-all font-medium shadow-sm"
                    >
                        Confirm
                    </button>
                </div>
            </Card>
        </div>
    );
}
