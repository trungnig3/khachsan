import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  CreditCard,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Sparkles,
  AlertCircle,
  Copy,
  ArrowRight,
  RefreshCw,
  Lock
} from 'lucide-react';
import { useToast } from '../ui/Toast';

export interface VNPayTransactionResult {
  transactionNo: string;
  orderCode: string;
  amount: number;
  bankCode: string;
  responseCode: string; // "00" = success
  payDate: string;
  paymentMethodDesc: string;
}

interface VNPaySandboxModalProps {
  orderCode: string;
  orderInfo: string;
  amount: number;
  customerName: string;
  customerEmail?: string;
  onClose: () => void;
  onPaymentSuccess: (result: VNPayTransactionResult) => void;
}

type TabType = 'QR' | 'ATM' | 'INTL';

export const VNPaySandboxModal: React.FC<VNPaySandboxModalProps> = ({
  orderCode,
  orderInfo,
  amount,
  customerName,
  customerEmail,
  onClose,
  onPaymentSuccess,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('ATM');
  
  // ATM Form state
  const [bank, setBank] = useState('NCB');
  const [cardNumber, setCardNumber] = useState('9704 1985 2619 1432 198');
  const [cardHolder, setCardHolder] = useState('NGUYEN VAN A');
  const [issueDate, setIssueDate] = useState('07/15');
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('123456');

  // Intl Form state
  const [intlCardNumber, setIntlCardNumber] = useState('4000 0012 3456 0001');
  const [intlHolder, setIntlHolder] = useState('NGUYEN VAN A');
  const [intlExpiry, setIntlExpiry] = useState('12/28');
  const [intlCvv, setIntlCvv] = useState('888');

  // Countdown timer (15 minutes)
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successResult, setSuccessResult] = useState<VNPayTransactionResult | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFillTestCardNCB = () => {
    setBank('NCB');
    setCardNumber('9704 1985 2619 1432 198');
    setCardHolder('NGUYEN VAN A');
    setIssueDate('07/15');
    setOtp('123456');
    showToast('Đã điền tự động thông tin thẻ Sandbox NCB thử nghiệm!', 'success');
  };

  const handleFillTestIntl = () => {
    setIntlCardNumber('4000 0012 3456 0001');
    setIntlHolder('NGUYEN VAN A');
    setIntlExpiry('12/28');
    setIntlCvv('888');
    showToast('Đã điền thẻ quốc tế Visa Sandbox thử nghiệm!', 'success');
  };

  // Submit payment
  const handleProceedPayment = (methodType: 'QR' | 'ATM' | 'INTL') => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const randomTxn = Math.floor(10000000 + Math.random() * 90000000).toString();
      const now = new Date();
      const dateStr = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;

      const bankDesc = methodType === 'QR' ? 'VNPAY-QR' : methodType === 'ATM' ? `NCB (Thẻ nội địa)` : `VISA International`;
      
      const result: VNPayTransactionResult = {
        transactionNo: randomTxn,
        orderCode: orderCode,
        amount: amount,
        bankCode: methodType === 'QR' ? 'VNPAYQR' : methodType === 'ATM' ? 'NCB' : 'VISA',
        responseCode: '00', // Success
        payDate: dateStr,
        paymentMethodDesc: `VNPAY Sandbox (${bankDesc})`,
      };

      setSuccessResult(result);
      onPaymentSuccess(result);
      showToast('Giao dịch thanh toán VNPay Sandbox thành công!', 'success');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col relative text-[#0F172A]">
        {/* Top VNPay Header */}
        <div className="bg-gradient-to-r from-[#005BAA] to-[#003C71] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white px-2.5 py-1 rounded-lg flex items-center shadow-sm">
              <span className="font-black text-sm tracking-wider text-[#005BAA]">VN</span>
              <span className="font-black text-sm tracking-wider text-[#ED1C24]">PAY</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs uppercase tracking-wider">CỔNG THANH TOÁN VNPAY</span>
                <span className="bg-[#ED1C24] text-[10px] uppercase font-mono px-2 py-0.2 rounded-full font-bold">
                  SANDBOX TEST
                </span>
              </div>
              <p className="text-[10px] text-blue-200">Môi trường thử nghiệm trực tuyến an toàn & nhanh chóng</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Order Brief Strip */}
        <div className="bg-[#F8FAFC] border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[#64748B]">Đơn hàng:</span>
              <span className="font-mono font-bold text-[#0F172A]">{orderCode}</span>
              <span className="text-slate-300">·</span>
              <span className="text-[#475569]">{customerName}</span>
            </div>
            <div className="text-[11px] text-[#64748B] truncate max-w-md">{orderInfo}</div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase text-[#64748B] block font-semibold">Số tiền thanh toán:</span>
            <span className="font-mono font-extrabold text-base text-[#ED1C24] tabular-nums">
              {amount.toLocaleString('vi-VN')} đ
            </span>
          </div>
        </div>

        {/* Content Body */}
        {successResult ? (
          /* Payment Success View */
          <div className="p-8 text-center space-y-6 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs uppercase font-bold text-emerald-600 tracking-wider block mb-1">
                KẾT QUẢ GIAO DỊCH VNPAY (MÃ: 00)
              </span>
              <h3 className="text-xl font-extrabold text-[#0F172A]">Thanh Toán Thành Công!</h3>
              <p className="text-xs text-[#64748B] mt-1">
                Đơn đặt phòng của quý khách đã được quyết toán thành công và hóa đơn đã được cập nhật sang trạng thái ĐÃ THU.
              </p>
            </div>

            {/* Receipt Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto text-xs text-left space-y-2.5">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-[#64748B]">Mã giao dịch VNPAY:</span>
                <span className="font-mono font-bold text-[#0F172A]">{successResult.transactionNo}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-[#64748B]">Mã đơn hàng:</span>
                <span className="font-mono font-bold text-[#0F172A]">{successResult.orderCode}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-[#64748B]">Số tiền:</span>
                <span className="font-mono font-bold text-[#ED1C24]">
                  {successResult.amount.toLocaleString('vi-VN')} đ
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-[#64748B]">Kênh thanh toán:</span>
                <span className="font-medium text-[#0F172A]">{successResult.paymentMethodDesc}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#64748B]">Trạng thái:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Đã ghi nhận hệ thống
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-[#005BAA] hover:bg-[#004785] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Hoàn tất & Xem Hóa Đơn
              </button>
            </div>
          </div>
        ) : (
          /* Payment Selection & Input View */
          <div className="p-6 sm:p-8 space-y-6">
            {/* Countdown notice banner */}
            <div className="flex items-center justify-between bg-blue-50/80 border border-blue-200 rounded-xl px-4 py-2 text-xs text-[#005BAA]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#005BAA] shrink-0" />
                <span>Giao dịch hết hạn trong: <strong>{formatTime(timeLeft)}</strong></span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[11px] text-blue-700 bg-white px-2 py-0.5 rounded shadow-xs">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>Sandbox 256-bit SSL</span>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl">
              <button
                onClick={() => { setActiveTab('ATM'); setOtpStep(false); }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'ATM'
                    ? 'bg-white text-[#005BAA] shadow-sm'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <Building2 className="w-4 h-4 text-[#005BAA]" />
                <span>Thẻ ATM / NCB Test</span>
              </button>

              <button
                onClick={() => setActiveTab('QR')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'QR'
                    ? 'bg-white text-[#005BAA] shadow-sm'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <QrCode className="w-4 h-4 text-[#ED1C24]" />
                <span>Quét VNPAY-QR</span>
              </button>

              <button
                onClick={() => setActiveTab('INTL')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'INTL'
                    ? 'bg-white text-[#005BAA] shadow-sm'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <CreditCard className="w-4 h-4 text-amber-600" />
                <span>Thẻ Quốc Tế</span>
              </button>
            </div>

            {/* TAB 1: ATM / NỘI ĐỊA (NCB TEST SANDBOX) */}
            {activeTab === 'ATM' && (
              <div className="space-y-4 animate-in fade-in">
                {/* Sandbox helper hint */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      Thông tin thẻ test VNPay Sandbox chính thức:
                    </span>
                    <p className="text-[11px] text-amber-800">
                      Ngân hàng: <strong>NCB</strong> · Số thẻ: <strong>9704 1985 2619 1432 198</strong> · Tên: <strong>NGUYEN VAN A</strong> · Ngày: <strong>07/15</strong> · OTP: <strong>123456</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleFillTestCardNCB}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold rounded-lg cursor-pointer shrink-0 shadow-xs transition-colors"
                  >
                    Điền nhanh thẻ test
                  </button>
                </div>

                {!otpStep ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setOtpStep(true);
                    }}
                    className="space-y-3.5"
                  >
                    <div>
                      <label className="block text-xs font-bold text-[#475569] mb-1">
                        Ngân hàng phát hành
                      </label>
                      <select
                        value={bank}
                        onChange={(e) => setBank(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-[#F8FAFC] border border-slate-300 rounded-xl focus:outline-none focus:border-[#005BAA] font-semibold"
                      >
                        <option value="NCB">NCB (Ngân hàng Quốc Dân - Sandbox hỗ trợ)</option>
                        <option value="VCB">Vietcombank</option>
                        <option value="BIDV">BIDV</option>
                        <option value="CTG">VietinBank</option>
                        <option value="TCB">Techcombank</option>
                        <option value="MB">MB Bank</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#475569] mb-1">
                        Số thẻ ATM nội địa
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="9704 1985 2619 1432 198"
                        required
                        className="w-full px-3.5 py-2 text-xs font-mono bg-[#F8FAFC] border border-slate-300 rounded-xl focus:outline-none focus:border-[#005BAA]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#475569] mb-1">
                          Tên chủ thẻ (Không dấu)
                        </label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                          placeholder="NGUYEN VAN A"
                          required
                          className="w-full px-3.5 py-2 text-xs uppercase font-mono bg-[#F8FAFC] border border-slate-300 rounded-xl focus:outline-none focus:border-[#005BAA]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#475569] mb-1">
                          Ngày phát hành (MM/YY)
                        </label>
                        <input
                          type="text"
                          value={issueDate}
                          onChange={(e) => setIssueDate(e.target.value)}
                          placeholder="07/15"
                          required
                          className="w-full px-3.5 py-2 text-xs font-mono bg-[#F8FAFC] border border-slate-300 rounded-xl focus:outline-none focus:border-[#005BAA]"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full py-3 bg-[#005BAA] hover:bg-[#004785] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Tiếp Tục Nhập Mã Xác Thực OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                ) : (
                  /* OTP Verification Step */
                  <div className="space-y-4 animate-in fade-in">
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs space-y-1">
                      <div className="font-bold text-[#005BAA]">Xác thực mã OTP gửi về số điện thoại</div>
                      <p className="text-slate-600 text-[11px]">
                        Hệ thống VNPay Sandbox đã gửi mã OTP thử nghiệm. Mật khẩu OTP mặc định là: <strong className="font-mono text-emerald-700">123456</strong>
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#475569] mb-1">
                        Mã OTP (6 chữ số)
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-center font-mono text-lg font-bold tracking-widest bg-[#F8FAFC] border border-slate-300 rounded-xl focus:outline-none focus:border-[#005BAA]"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setOtpStep(false)}
                        className="w-1/3 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                      >
                        Quay lại
                      </button>
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleProceedPayment('ATM')}
                        className="w-2/3 py-2.5 bg-[#ED1C24] hover:bg-[#C9141B] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Đang xác thực...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>Xác Nhận Thanh Toán</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: VNPAY-QR */}
            {activeTab === 'QR' && (
              <div className="space-y-4 text-center animate-in fade-in">
                <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 max-w-sm mx-auto flex flex-col items-center">
                  <div className="relative p-3 bg-white rounded-2xl shadow-md border border-slate-200">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=VNPAY_SANDBOX_${orderCode}_${amount}`}
                      alt="VNPAY QR Code"
                      className="w-48 h-48 rounded-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-white p-1 rounded-lg shadow-md border border-slate-200">
                        <span className="font-black text-[10px] text-[#005BAA]">VN</span>
                        <span className="font-black text-[10px] text-[#ED1C24]">PAY</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1">
                    <span className="text-xs font-bold text-[#0F172A] block">
                      Quét mã với App Ngân Hàng hoặc Ví VNPAY
                    </span>
                    <p className="text-[11px] text-[#64748B]">
                      Hỗ trợ hơn 35+ ứng dụng: VCB Digibank, BIDV SmartBanking, VietinBank iPay, MB Bank, MoMo, ZaloPay...
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleProceedPayment('QR')}
                  className="w-full py-3 bg-[#005BAA] hover:bg-[#004785] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang nhận diện quét mã...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mô Phỏng Quét Mã Thành Công (Sandbox)</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TAB 3: THẺ QUỐC TẾ */}
            {activeTab === 'INTL' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleProceedPayment('INTL');
                }}
                className="space-y-3.5 animate-in fade-in"
              >
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-amber-900 block">Thẻ thử nghiệm Visa Sandbox:</span>
                    <span className="font-mono text-[11px] text-amber-800">4000 0012 3456 0001 · 12/28 · CVV: 888</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleFillTestIntl}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold rounded-lg cursor-pointer"
                  >
                    Điền nhanh
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#475569] mb-1">
                    Số thẻ Quốc tế (Visa / MasterCard / JCB)
                  </label>
                  <input
                    type="text"
                    value={intlCardNumber}
                    onChange={(e) => setIntlCardNumber(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 text-xs font-mono bg-[#F8FAFC] border border-slate-300 rounded-xl focus:outline-none focus:border-[#005BAA]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#475569] mb-1">
                      Hạn dùng (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={intlExpiry}
                      onChange={(e) => setIntlExpiry(e.target.value)}
                      required
                      className="w-full px-3.5 py-2 text-xs font-mono bg-[#F8FAFC] border border-slate-300 rounded-xl focus:outline-none focus:border-[#005BAA]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#475569] mb-1">
                      Mã bảo mật CVV / CVC
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={intlCvv}
                      onChange={(e) => setIntlCvv(e.target.value)}
                      required
                      className="w-full px-3.5 py-2 text-xs font-mono bg-[#F8FAFC] border border-slate-300 rounded-xl focus:outline-none focus:border-[#005BAA]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 bg-[#005BAA] hover:bg-[#004785] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang giao dịch thẻ quốc tế...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Thanh Toán Visa Sandbox ({amount.toLocaleString('vi-VN')} đ)</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
