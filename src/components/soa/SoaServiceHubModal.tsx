import React, { useState } from 'react';
import {
  X,
  Cpu,
  Layers,
  Terminal,
  Play,
  Download,
  CheckCircle2,
  Activity,
  Server,
  ShieldCheck,
  Zap,
  ArrowRight,
  FileCode,
  Globe2,
  Code2,
  Database,
  Radio,
  Copy,
  Check
} from 'lucide-react';
import { SOA_SERVICES_CATALOG, SoaGatewayService, SoaServiceEndpoint } from '../../services/soaGateway';
import { useToast } from '../ui/Toast';

interface SoaServiceHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SoaServiceHubModal: React.FC<SoaServiceHubModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'topology' | 'catalog' | 'playground' | 'orchestration' | 'export'>('topology');

  // Playground state
  const [selectedEndpoint, setSelectedEndpoint] = useState<SoaServiceEndpoint>(SOA_SERVICES_CATALOG[3]); // Booking create default
  const [requestHeadersText, setRequestHeadersText] = useState<string>(
    JSON.stringify(selectedEndpoint.requestHeaders, null, 2)
  );
  const [requestBodyText, setRequestBodyText] = useState<string>(
    selectedEndpoint.samplePayload ? JSON.stringify(selectedEndpoint.samplePayload, null, 2) : ''
  );
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectEndpoint = (ep: SoaServiceEndpoint) => {
    setSelectedEndpoint(ep);
    setRequestHeadersText(JSON.stringify(ep.requestHeaders, null, 2));
    setRequestBodyText(ep.samplePayload ? JSON.stringify(ep.samplePayload, null, 2) : '');
    setExecutionResult(null);
  };

  const handleRunApi = () => {
    setIsExecuting(true);
    let parsedBody = null;
    if (requestBodyText.trim()) {
      try {
        parsedBody = JSON.parse(requestBodyText);
      } catch (err) {
        showToast('Cú pháp Payload JSON không hợp lệ!', 'error');
        setIsExecuting(false);
        return;
      }
    }

    setTimeout(() => {
      const result = SoaGatewayService.executeEndpoint(selectedEndpoint.id, parsedBody);
      setExecutionResult(result);
      setIsExecuting(false);
      showToast(`Đã nhận phản hồi HTTP ${result.httpStatus} (${result.durationMs}ms)`, 'success');
    }, 280);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Đã sao chép vào bộ nhớ tạm!', 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Đã tải xuống ${filename}`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0F172A] border border-slate-800 w-full max-w-6xl h-[92vh] max-h-[850px] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/30">
              <Cpu className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide font-luxury">
                  TRUNG TÂM DỊCH VỤ SOA (SOA SERVICE HUB)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-widest">
                  SOA ARCHITECTURE v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Hệ thống phần mềm hướng dịch vụ — Service Catalog, API Gateway & Live Testing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs Bar */}
        <div className="px-6 bg-slate-900/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('topology')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'topology'
                ? 'border-amber-400 text-amber-400 font-bold bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Mô Hình Kiến Trúc SOA</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'catalog'
                ? 'border-amber-400 text-amber-400 font-bold bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe2 className="w-4 h-4" />
            <span>Danh Mục Web Services ({SOA_SERVICES_CATALOG.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('playground')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'playground'
                ? 'border-amber-400 text-amber-400 font-bold bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Kiểm Thử API Trực Tiếp (Playground)</span>
          </button>

          <button
            onClick={() => setActiveTab('orchestration')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'orchestration'
                ? 'border-amber-400 text-amber-400 font-bold bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Chuỗi Tích Hợp (Orchestration & ESB)</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'export'
                ? 'border-amber-400 text-amber-400 font-bold bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Xuất OpenAPI / Postman / WSDL</span>
          </button>
        </div>

        {/* Modal Main Content Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/60">
          
          {/* TAB 1: TOPOLOGY */}
          {activeTab === 'topology' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-start gap-3">
                <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">Mô Hình Kiến Trúc Hướng Dịch Vụ (Service-Oriented Architecture - SOA)</h4>
                  <p className="leading-relaxed">
                    Hệ thống được thiết kế hoàn toàn theo tiêu chuẩn SOA chuyên sâu, phân tách thành các Web Services độc lập
                    giao tiếp thông qua giao thức RESTful API / JSON, mã hóa JWT Bearer Token, và được điều phối trung tâm qua Enterprise Service Bus (ESB) & API Gateway.
                  </p>
                </div>
              </div>

              {/* Topology Layers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                {/* Layer 1: Clients */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <Globe2 className="w-4 h-4" />
                    <span>Layer 1: Presentation</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 font-medium">
                      📱 React Single Page App (Vite + TS)
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 font-medium text-slate-300">
                      💻 Admin Portal & Housekeeping App
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 font-medium text-slate-400">
                      🌐 3rd Party OTA Partners (Booking/Agoda)
                    </div>
                  </div>
                </div>

                {/* Layer 2: API Gateway & ESB */}
                <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/40 space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                    <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>Layer 2: ESB & Gateway</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-200 font-semibold">
                      🛡️ API Gateway Routing (`/api/v1/*`)
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                      🔑 OAuth2 / JWT Security Interceptor
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                      📊 Rate Limiter & Service Discovery
                    </div>
                  </div>
                </div>

                {/* Layer 3: Microservices */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 md:col-span-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    <Server className="w-4 h-4" />
                    <span>Layer 3: SOA Services</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded-lg bg-slate-800 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center justify-between">
                      <span>Auth & Identity Service</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                      Room & Catalog Service
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                      Booking & Reservation Service
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                      Housekeeping & Maintenance
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                      Payment & Invoice Service
                    </div>
                  </div>
                </div>

                {/* Layer 4: Persistence */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
                    <Database className="w-4 h-4" />
                    <span>Layer 4: Data Layer</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 font-medium text-slate-200">
                      🐘 PostgreSQL Database (`hotel_db`)
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 font-medium text-slate-300">
                      ⚡ Spring Data JPA & Hibernate
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 font-medium text-slate-400">
                      📦 In-Memory SOA Store Backup
                    </div>
                  </div>
                </div>

              </div>

              {/* Service Metrics Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs font-semibold block uppercase">Trạng Thái SOA Cluster</span>
                    <span className="text-lg font-bold text-emerald-400">HEALTHY (100% Online)</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs font-semibold block uppercase">Độ Trễ Trung Bình (SLA)</span>
                    <span className="text-lg font-bold text-amber-300">18.4 ms</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs font-semibold block uppercase">Mã Hóa Chuẩn SOA Security</span>
                    <span className="text-lg font-bold text-sky-300">JWT + Spring Security</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CATALOG */}
          {activeTab === 'catalog' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Danh Mục Tất Cả Web Services Khách Sạn (Service Catalog)
                </h3>
                <span className="text-xs text-slate-400">
                  Tổng số: <strong className="text-amber-400">{SOA_SERVICES_CATALOG.length} Web Services</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {SOA_SERVICES_CATALOG.map((svc) => (
                  <div
                    key={svc.id}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-extrabold uppercase ${
                          svc.method === 'POST' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          svc.method === 'GET' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        }`}>
                          {svc.method}
                        </span>
                        <code className="text-xs font-mono font-bold text-slate-200">
                          {svc.path}
                        </code>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          {svc.serviceName.split(' ')[0]}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{svc.name}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{svc.description}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                      <div className="text-right text-[11px]">
                        <span className="text-slate-400 block">SLA Target</span>
                        <span className="text-amber-300 font-bold">&lt; {svc.slaLatencyMs}ms</span>
                      </div>

                      <button
                        onClick={() => {
                          handleSelectEndpoint(svc);
                          setActiveTab('playground');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Thử nghiệm</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PLAYGROUND */}
          {activeTab === 'playground' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
              
              {/* Left Column: Endpoint selector list */}
              <div className="lg:col-span-4 space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  1. Chọn Web Service
                </label>
                <div className="space-y-1.5 max-h-[550px] overflow-y-auto pr-1">
                  {SOA_SERVICES_CATALOG.map((ep) => (
                    <button
                      key={ep.id}
                      onClick={() => handleSelectEndpoint(ep)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        selectedEndpoint.id === ep.id
                          ? 'bg-amber-500/10 border-amber-500 text-white font-semibold shadow-md'
                          : 'bg-slate-900 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          ep.method === 'POST' ? 'bg-amber-500/30 text-amber-300' : 'bg-emerald-500/30 text-emerald-300'
                        }`}>
                          {ep.method}
                        </span>
                        <span className="text-xs font-bold truncate">{ep.name}</span>
                      </div>
                      <code className="text-[11px] font-mono text-slate-400 block truncate">
                        {ep.path}
                      </code>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Execution Form & Results */}
              <div className="lg:col-span-8 space-y-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-xs font-black uppercase">
                        {selectedEndpoint.method}
                      </span>
                      <code className="text-sm font-mono font-bold text-white">
                        {selectedEndpoint.path}
                      </code>
                    </div>

                    <button
                      onClick={handleRunApi}
                      disabled={isExecuting}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/40 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Play className="w-4 h-4 text-slate-950 fill-current" />
                      <span>{isExecuting ? 'Đang thực thi...' : 'Gửi Lệnh Dịch Vụ SOA'}</span>
                    </button>
                  </div>

                  {/* Headers Editor */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Request Headers (JSON)
                    </label>
                    <textarea
                      rows={2}
                      value={requestHeadersText}
                      onChange={(e) => setRequestHeadersText(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-amber-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Request Payload Editor */}
                  {selectedEndpoint.method !== 'GET' && (
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Request Body (JSON Payload)
                      </label>
                      <textarea
                        rows={6}
                        value={requestBodyText}
                        onChange={(e) => setRequestBodyText(e.target.value)}
                        className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-emerald-300 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  )}
                </div>

                {/* Execution Response Inspector */}
                {executionResult && (
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                          Phản Hồi REST SOA:
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          executionResult.httpStatus < 300 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300'
                        }`}>
                          HTTP {executionResult.httpStatus} OK
                        </span>
                        <span className="text-xs text-amber-300 font-mono">
                          ⏱️ {executionResult.durationMs} ms
                        </span>
                      </div>

                      <button
                        onClick={() => handleCopy(JSON.stringify(executionResult.body, null, 2), 'response')}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 text-xs"
                      >
                        {copiedKey === 'response' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy JSON</span>
                      </button>
                    </div>

                    <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-xs font-mono text-slate-200 overflow-x-auto max-h-[250px]">
                      {JSON.stringify(executionResult.body, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 4: ORCHESTRATION */}
          {activeTab === 'orchestration' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Radio className="w-4 h-4 text-amber-400" />
                  <span>Kịch Bản Tích Hợp Đa Dịch Vụ (Service Orchestration Flow)</span>
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  Khi người dùng bấm đặt phòng trên ứng dụng, Enterprise Service Bus (ESB) sẽ kích hoạt chuỗi tích hợp tự động qua các microservices độc lập:
                </p>
              </div>

              {/* Step Sequence Timeline */}
              <div className="space-y-3 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-800">
                
                {/* Step 1 */}
                <div className="flex items-start gap-4 relative">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-sm shrink-0 shadow-lg">
                    1
                  </div>
                  <div className="flex-1 p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">1. Yêu cầu khởi tạo từ Client</span>
                      <code className="text-[10px] text-amber-300 font-mono">POST /api/v1/bookings/create</code>
                    </div>
                    <p className="text-slate-400">Khách hàng chọn phòng P101, điền ngày nhận phòng & số khách.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4 relative">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center font-bold text-sm shrink-0 shadow-lg">
                    2
                  </div>
                  <div className="flex-1 p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">2. AuthService & Security Gateway</span>
                      <code className="text-[10px] text-sky-300 font-mono">JWT Bearer Interceptor</code>
                    </div>
                    <p className="text-slate-400">Kiểm tra tính hợp lệ của Token người dùng và xác minh quyền truy cập ROLE_CUSTOMER / ROLE_ADMIN.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-4 relative">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-sm shrink-0 shadow-lg">
                    3
                  </div>
                  <div className="flex-1 p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">3. RoomCatalogService - Kiểm tra trạng thái phòng</span>
                      <code className="text-[10px] text-emerald-300 font-mono">GET /api/v1/rooms/search</code>
                    </div>
                    <p className="text-slate-400">Khóa tạm thời lịch phòng P101 và xác nhận phòng ở trạng thái AVAILABLE.</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start gap-4 relative">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center font-bold text-sm shrink-0 shadow-lg">
                    4
                  </div>
                  <div className="flex-1 p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">4. PaymentGateway & Housekeeping Schedule</span>
                      <code className="text-[10px] text-purple-300 font-mono">Event Bus Trigger</code>
                    </div>
                    <p className="text-slate-400">Kích hoạt lệnh thanh toán VNPay và tự động xếp lịch dọn phòng cho đội Buồng phòng (Housekeeping).</p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: EXPORT */}
          {activeTab === 'export' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Xuất Hồ Sơ & Tài Liệu Dành Cho Môn Học (SOA Deliverables)
                </h3>
                <p className="text-slate-400">
                  Tải về các tệp định dạng chuẩn để nộp cho giáo viên môn Phát triển phần mềm hướng dịch vụ.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Export 1: OpenAPI 3.0 */}
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 hover:border-amber-500/50 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">OpenAPI 3.0 Specification</h4>
                    <p className="text-xs text-slate-400 mt-1">Định dạng chuẩn REST API Spec (JSON) cho Swagger UI.</p>
                  </div>
                  <button
                    onClick={() => handleDownloadFile(
                      SoaGatewayService.generateOpenApiSpecJson(),
                      'OpenAPI_3.0_SOA_Hotel_Services.json',
                      'application/json'
                    )}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Tải OpenAPI 3.0 (JSON)</span>
                  </button>
                </div>

                {/* Export 2: Postman Collection */}
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 hover:border-amber-500/50 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-300 border border-orange-500/30 flex items-center justify-center font-bold">
                    <Globe2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Postman Collection v2.1</h4>
                    <p className="text-xs text-slate-400 mt-1">Bộ API đầy đủ có thể Import trực tiếp vào ứng dụng Postman.</p>
                  </div>
                  <button
                    onClick={() => handleDownloadFile(
                      SoaGatewayService.generatePostmanCollectionJson(),
                      'Postman_Collection_SOA_Hotel.json',
                      'application/json'
                    )}
                    className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Tải Postman Collection</span>
                  </button>
                </div>

                {/* Export 3: WSDL Contract XML */}
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 hover:border-amber-500/50 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center justify-center font-bold">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">WSDL Web Service Contract</h4>
                    <p className="text-xs text-slate-400 mt-1">Hợp đồng Dịch vụ SOAP/WSDL XML chuẩn SOA Enterprise.</p>
                  </div>
                  <button
                    onClick={() => handleDownloadFile(
                      SoaGatewayService.generateWsdlXml(),
                      'HotelServiceContract.wsdl',
                      'application/xml'
                    )}
                    className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Tải WSDL XML Contract</span>
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SOA API Gateway: <strong>Connected (Port 3000 / 8080)</strong></span>
          </div>
          <span>Môn học: <strong>Phát triển phần mềm hướng dịch vụ (SOA)</strong></span>
        </div>

      </div>
    </div>
  );
};
