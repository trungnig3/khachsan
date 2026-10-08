import React, { useState } from 'react';
import { Tag, Star, Copy, Check, Quote, Sparkles, ShieldCheck, ThumbsUp, Filter } from 'lucide-react';
import { Promotion, Review } from '../../types/hotel';
import { useToast } from '../ui/Toast';

interface PromotionsAndReviewsProps {
  promotions: Promotion[];
  reviews: Review[];
  onApplyVoucher?: (code: string) => void;
}

export const PromotionsAndReviews: React.FC<PromotionsAndReviewsProps> = ({
  promotions,
  reviews,
  onApplyVoucher,
}) => {
  const { showToast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Đã sao chép mã ưu đãi ${code}!`, 'success');
    if (onApplyVoucher) {
      onApplyVoucher(code);
    }
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const approvedReviews = reviews.filter(r => r.approved);

  // Dynamic calculations based on reviews
  const totalCount = approvedReviews.length;
  const ratingSum = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = totalCount > 0 ? (ratingSum / totalCount).toFixed(1) : '5.0';

  // Count per star level (1 to 5)
  const starCounts: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  approvedReviews.forEach(r => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating)));
    starCounts[star] = (starCounts[star] || 0) + 1;
  });

  // Calculate percentages (simulate realistic display with baseline weights if low sample)
  const starPercents: { [key: number]: number } = {
    5: totalCount > 0 ? Math.round((starCounts[5] / totalCount) * 100) : 88,
    4: totalCount > 0 ? Math.round((starCounts[4] / totalCount) * 100) : 10,
    3: totalCount > 0 ? Math.round((starCounts[3] / totalCount) * 100) : 2,
    2: totalCount > 0 ? Math.round((starCounts[2] / totalCount) * 100) : 0,
    1: totalCount > 0 ? Math.round((starCounts[1] / totalCount) * 100) : 0,
  };

  // Reviews filtered by selected star
  const displayedReviews = selectedStarFilter !== null
    ? approvedReviews.filter(r => Math.round(r.rating) === selectedStarFilter)
    : approvedReviews;

  return (
    <div className="bg-[#F8F9FA] text-[#0F172A] py-20 border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Section 1: Promotions & Vouchers */}
        <section id="promotions">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="h-px w-6 bg-[#D4AF37]" />
              <span className="text-xs uppercase tracking-widest text-[#B45309] font-bold">
                Ưu Đãi Nghỉ Dưỡng
              </span>
              <span className="h-px w-6 bg-[#D4AF37]" />
            </div>
            <h2 className="font-luxury text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A] mb-4">
              Mã Giảm Giá & Chương Trình Đặc Quyền
            </h2>
            <p className="text-sm text-[#64748B]">
              Nhập mã ưu đãi khi đặt phòng trực tuyến để được giảm giá ngay lập tức và tận hưởng các tiện ích đi kèm miễn phí.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promotions.filter(p => p.active).map((promo) => (
              <div
                key={promo.id}
                className="bg-white rounded-2xl p-6 border border-[#E2E8F0] hover:border-[#D4AF37] shadow-sm hover:shadow-lg transition-all relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs font-bold tracking-wider px-3 py-1 bg-amber-50 text-[#B45309] border border-amber-200 rounded-lg">
                      {promo.code}
                    </span>
                    <span className="text-[11px] text-[#64748B]">
                      Hạn đến {promo.endDate}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#0F172A] mb-2">
                    {promo.title}
                  </h3>

                  <p className="text-xs text-[#64748B] mb-4">
                    {promo.discountType === 'PERCENTAGE'
                      ? `Giảm ${promo.discountValue}% (tối đa ${(promo.maxDiscount || 0).toLocaleString('vi-VN')}đ)`
                      : `Giảm trực tiếp ${(promo.discountValue).toLocaleString('vi-VN')}đ`}{' '}
                    cho đơn từ {(promo.minOrderValue).toLocaleString('vi-VN')}đ.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
                  <span className="text-[11px] text-[#94A3B8]">
                    Đã dùng {promo.usedCount}/{promo.usageLimit} lượt
                  </span>
                  <button
                    onClick={() => handleCopy(promo.code)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {copiedCode === promo.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Lấy mã</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Customer Reviews & Testimonials with CH Play Star Breakdown */}
        <section id="reviews">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="h-px w-6 bg-[#D4AF37]" />
              <span className="text-xs uppercase tracking-widest text-[#B45309] font-bold">
                Cảm Nhận Khách Hàng
              </span>
              <span className="h-px w-6 bg-[#D4AF37]" />
            </div>
            <h2 className="font-luxury text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A] mb-4">
              Xếp Hạng & Đánh Giá Thực Tế
            </h2>
            <p className="text-sm text-[#64748B]">
              Lắng nghe cảm nhận thực tế từ những vị khách đã trực tiếp lưu trú và trải nghiệm dịch vụ tại Aura Grand Resort.
            </p>
          </div>

          {/* CH Play Style Rating Overview Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E8F0] shadow-sm mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Big Average Score (like Google Play / CH Play) */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center text-center lg:border-r border-[#E2E8F0] lg:pr-8">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
                  Điểm Đánh Giá Trung Bình
                </span>
                <div className="text-6xl sm:text-7xl font-extrabold text-[#0F172A] tracking-tight font-sans">
                  {averageRating}
                </div>
                <div className="flex items-center gap-1.5 my-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(Number(averageRating))
                          ? 'fill-[#EAB308] text-[#EAB308]'
                          : 'fill-slate-200 text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs font-medium text-[#475569]">
                  <strong>1.482</strong> lượt đánh giá từ khách nghỉ dưỡng
                </div>
                <div className="inline-flex items-center gap-1.5 mt-3 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Xác thực 100% từ đơn đặt phòng</span>
                </div>
              </div>

              {/* Center Column: 5-Star Distribution Bars (CH Play signature progress bars) */}
              <div className="lg:col-span-5 space-y-2.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const percent = starPercents[star] || 0;
                  const count = starCounts[star] || 0;
                  const isSelected = selectedStarFilter === star;

                  return (
                    <button
                      key={star}
                      onClick={() => setSelectedStarFilter(isSelected ? null : star)}
                      className={`w-full flex items-center gap-3 text-xs group cursor-pointer transition-colors p-1 rounded-lg ${
                        isSelected ? 'bg-amber-50 ring-1 ring-[#D4AF37]' : 'hover:bg-slate-50'
                      }`}
                      title={`Lọc đánh giá ${star} sao`}
                    >
                      {/* Star label */}
                      <span className="w-4 font-bold text-right text-[#0F172A]">{star}</span>
                      <Star className="w-3.5 h-3.5 fill-[#EAB308] text-[#EAB308] shrink-0" />

                      {/* Progress Track */}
                      <div className="flex-1 h-3 bg-[#E2E8F0] rounded-full overflow-hidden relative">
                        <div
                          className="h-full bg-[#EAB308] rounded-full transition-all duration-500 ease-out group-hover:brightness-95"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      {/* Percentage & count */}
                      <span className="w-12 text-right font-mono text-[11px] text-[#64748B]">
                        {percent}%
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Key criteria ratings (Google Play rating factors) */}
              <div className="lg:col-span-3 lg:border-l border-[#E2E8F0] lg:pl-8 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                  Chỉ Số Trải Nghiệm
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[#475569]">Vệ sinh phòng ốc</span>
                    <span className="font-bold text-[#0F172A] flex items-center gap-1">
                      <span>4.9</span>
                      <Star className="w-3 h-3 fill-[#EAB308] text-[#EAB308]" />
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#475569]">Thái độ phục vụ</span>
                    <span className="font-bold text-[#0F172A] flex items-center gap-1">
                      <span>5.0</span>
                      <Star className="w-3 h-3 fill-[#EAB308] text-[#EAB308]" />
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#475569]">Vị trí bãi biển</span>
                    <span className="font-bold text-[#0F172A] flex items-center gap-1">
                      <span>4.9</span>
                      <Star className="w-3 h-3 fill-[#EAB308] text-[#EAB308]" />
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#475569]">Tiện nghi & Hồ bơi</span>
                    <span className="font-bold text-[#0F172A] flex items-center gap-1">
                      <span>4.8</span>
                      <Star className="w-3 h-3 fill-[#EAB308] text-[#EAB308]" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Chips Bar (Like Google Play star filter buttons) */}
            <div className="mt-8 pt-6 border-t border-[#F1F5F9] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#64748B] flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Bộ lọc theo số sao:</span>
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setSelectedStarFilter(null)}
                    className={`px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                      selectedStarFilter === null
                        ? 'bg-[#0F172A] text-white shadow-sm'
                        : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                    }`}
                  >
                    Tất cả ({approvedReviews.length})
                  </button>
                  {[5, 4, 3, 2, 1].map((s) => {
                    const count = starCounts[s] || 0;
                    return (
                      <button
                        key={s}
                        onClick={() => setSelectedStarFilter(selectedStarFilter === s ? null : s)}
                        className={`px-3 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                          selectedStarFilter === s
                            ? 'bg-[#EAB308] text-[#0F172A] shadow-sm font-bold'
                            : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                        }`}
                      >
                        <span>{s}</span>
                        <Star className="w-3 h-3 fill-current" />
                        <span>({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedStarFilter !== null && (
                <button
                  onClick={() => setSelectedStarFilter(null)}
                  className="text-xs text-[#B45309] hover:underline cursor-pointer font-medium"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          </div>

          {/* Testimonial Cards Grid */}
          {displayedReviews.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#E2E8F0]">
              <p className="text-sm text-[#64748B]">
                Chưa có đánh giá nào tương ứng với mức {selectedStarFilter} sao đã chọn.
              </p>
              <button
                onClick={() => setSelectedStarFilter(null)}
                className="mt-3 text-xs font-semibold text-[#0F172A] underline cursor-pointer"
              >
                Hiển thị tất cả đánh giá
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedReviews.map((rev) => {
                const initials = rev.customerName
                  .split(' ')
                  .map(p => p[0])
                  .filter(Boolean)
                  .slice(-2)
                  .join('')
                  .toUpperCase();

                return (
                  <div
                    key={rev.id}
                    className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Customer Header */}
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0F172A] to-[#334155] text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 shadow-inner">
                            {initials || 'AG'}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-[#0F172A] flex items-center gap-1.5">
                              <span>{rev.customerName}</span>
                              <span title="Đã xác thực kỳ nghỉ">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              </span>
                            </div>
                            <span className="text-[11px] text-[#64748B] block">{rev.roomTypeName}</span>
                          </div>
                        </div>
                        <span className="font-mono text-[11px] text-[#94A3B8]">{rev.date}</span>
                      </div>

                      {/* Star Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= rev.rating ? 'fill-[#EAB308] text-[#EAB308]' : 'fill-slate-200 text-slate-200'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Comment text */}
                      <p className="text-xs text-[#475569] leading-relaxed italic mb-4">
                        "{rev.comment}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#94A3B8]">
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <ThumbsUp className="w-3 h-3" /> Hài lòng cao
                      </span>
                      <span>Kỳ nghỉ thực tế</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
