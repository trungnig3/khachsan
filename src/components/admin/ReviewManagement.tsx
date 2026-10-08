import React from 'react';
import { Star, CheckCircle2, EyeOff, Trash2, Eye } from 'lucide-react';
import { Review } from '../../types/hotel';
import { hotelStore } from '../../services/hotelStore';
import { useToast } from '../ui/Toast';

interface ReviewManagementProps {
  reviews: Review[];
  onRefresh: () => void;
}

export const ReviewManagement: React.FC<ReviewManagementProps> = ({
  reviews,
  onRefresh,
}) => {
  const { showToast } = useToast();

  const handleToggleApproval = (id: number) => {
    hotelStore.toggleReviewApproval(id);
    showToast('Đã thay đổi trạng thái kiểm duyệt đánh giá!', 'info');
    onRefresh();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Xác nhận xóa đánh giá này khỏi hệ thống?')) {
      hotelStore.deleteReview(id);
      showToast('Đã xóa đánh giá', 'info');
      onRefresh();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h2 className="font-luxury text-2xl font-bold text-[#0F172A]">
          Kiểm Duyệt Đánh Giá Khách Hàng (Reviews Moderation)
        </h2>
        <p className="text-xs text-[#64748B]">
          Quản lý ý kiến đóng góp, điểm xếp hạng sao và phê duyệt hiển thị trên trang chủ
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="divide-y divide-[#F1F5F9]">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-6 hover:bg-[#F8FAFC] transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-[#0F172A]">{rev.customerName}</span>
                    <span className="text-xs text-[#64748B]">·</span>
                    <span className="text-xs text-[#64748B]">{rev.roomTypeName}</span>
                    <span className="text-xs text-[#64748B]">·</span>
                    <span className="font-mono text-xs text-[#94A3B8]">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= rev.rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-slate-200'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-[#0F172A] ml-2">
                      {rev.rating}/5 Sao
                    </span>
                  </div>

                  <p className="text-xs text-[#475569] leading-relaxed max-w-2xl italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleApproval(rev.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      rev.approved
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {rev.approved ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Đang hiển thị</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Đang ẩn</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    title="Xóa đánh giá"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
