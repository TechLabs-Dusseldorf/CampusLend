import { Mail, Trash2, Clock, User } from 'lucide-react';
import { useState } from 'react';

const ItemCard = ({ item, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Check if ownerEmail is present and valid (basic validation)
  const isEmailValid = item.ownerEmail && typeof item.ownerEmail === 'string' && item.ownerEmail.trim() !== '' && item.ownerEmail.includes('@');

  const handleRequestBorrow = () => {
    const subject = encodeURIComponent(`CampusLend: Request to borrow ${item.title}`);
    const body = encodeURIComponent(`Hi, I saw your listing for ${item.title} on CampusLend. I'm interested in borrowing it. Please let me know if it's still available and we can arrange pickup/delivery.`);
    const mailtoLink = `mailto:${item.ownerEmail}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    onDelete(item.id);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-3">
      <div className="p-6">
        <div className="flex items-start space-x-6">
          {/* Category Badge */}
          <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-full w-fit">
            {item.category}
          </span>

          <div className="flex-1 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 truncate">
              {item.title}
            </h3>
            <p className="text-sm text-slate-600 line-clamp-2">
              {item.description}
            </p>
            <div className="space-y-3 text-sm text-gray-500">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="font-medium">{item.maxBorrowTime}</span>
              </div>
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <span className="font-medium">
                  {isEmailValid ? item.ownerEmail.split('@')[0] : 'Contact'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto flex flex-col gap-2 w-full">
              {isEmailValid ? (
                <button
                  onClick={handleRequestBorrow}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  Request to Borrow
                </button>
              ) : (
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 bg-slate-300 text-slate-500 font-medium py-2 px-4 rounded-lg cursor-not-allowed transition-colors"
                >
                  <Mail className="h-5 w-5 opacity-50" />
                  Contact Unavailable
                </button>
              )}
              {!showDeleteConfirm && (
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-200 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                  Delete
                </button>
              )}
              {showDeleteConfirm && (
                <>
                  <button
                    onClick={handleConfirmDelete}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={handleCancelDelete}
                    className="w-full flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-200 font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;