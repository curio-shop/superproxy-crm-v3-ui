import { X, Video, Mic } from 'lucide-react';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

interface RecordPresentationModalProps {
  onClose: () => void;
  preSelectedType?: 'quote' | 'invoice';
  preSelectedId?: string;
  documentNumber?: string;
  documentTitle?: string;
}

type RecordingStep = 'select' | 'configure' | 'presentation-mode';
type CameraView = 'thumbnail' | 'full-camera' | null;

const PLACEHOLDER_PHOTO = 'https://ryuxwkawbokdgvkiwzqd.supabase.co/storage/v1/object/public/site-asset/iStock-1198252585%20(1).jpg';

export default function RecordPresentationModal({ onClose, preSelectedType, preSelectedId, documentNumber, documentTitle }: RecordPresentationModalProps) {
  const [currentStep, setCurrentStep] = useState<RecordingStep>(preSelectedType ? 'configure' : 'select');
  const [selectedType, setSelectedType] = useState<'quote' | 'invoice' | null>(preSelectedType || null);
  const [selectedDocument, setSelectedDocument] = useState(preSelectedId || '');
  const [webcamEnabled, setWebcamEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraView, setCameraView] = useState<CameraView>(null);

  const mockQuotes = [
    { id: 'quote-1', number: 'QUO-2024-001', title: 'Enterprise Software Solution' },
    { id: 'quote-2', number: 'QUO-2024-002', title: 'Website Redesign Project' },
    { id: 'quote-3', number: 'QUO-2024-003', title: 'Annual Support Package' },
  ];

  const mockInvoices = [
    { id: 'invoice-1', number: 'INV-2024-089', title: 'December Services' },
    { id: 'invoice-2', number: 'INV-2024-090', title: 'January Hosting' },
    { id: 'invoice-3', number: 'INV-2024-091', title: 'Q4 Marketing Services' },
  ];

  const handleStartPresentation = () => {
    alert('Presentation setup complete! Recording would start here in the full version.');
    onClose();
  };

  const modalContent = (
    <div className="fixed inset-0 z-[300] bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-white/50 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Record New Presentation</h2>
            <p className="text-sm text-slate-500">
              {currentStep === 'select' && 'Select document type'}
              {currentStep === 'configure' && 'Configure recording settings'}
              {currentStep === 'presentation-mode' && `Select how you want to present your ${selectedType}. You can switch views during recording.`}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl p-2 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {currentStep === 'select' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-4">Select Document Type</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setSelectedType('quote');
                      setCurrentStep('configure');
                    }}
                    className="group relative overflow-hidden p-6 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-blue-300 rounded-2xl transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-400/5 blur-2xl rounded-full transition-opacity opacity-0 group-hover:opacity-100"></div>
                    <div className="relative flex flex-col items-center text-center space-y-3">
                      <div className="w-14 h-14 bg-blue-50 group-hover:bg-blue-100 border border-blue-200 rounded-xl flex items-center justify-center transition-all duration-300">
                        <Icon icon="solar:document-text-linear" className="w-7 h-7 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-base font-bold text-slate-900 mb-1">Quote Presentation</p>
                        <p className="text-xs text-slate-500 leading-relaxed">Create a presentation for a quote</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedType('invoice');
                      setCurrentStep('configure');
                    }}
                    className="group relative overflow-hidden p-6 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-emerald-300 rounded-2xl transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/5 blur-2xl rounded-full transition-opacity opacity-0 group-hover:opacity-100"></div>
                    <div className="relative flex flex-col items-center text-center space-y-3">
                      <div className="w-14 h-14 bg-emerald-50 group-hover:bg-emerald-100 border border-emerald-200 rounded-xl flex items-center justify-center transition-all duration-300">
                        <Icon icon="solar:bill-list-linear" className="w-7 h-7 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-base font-bold text-slate-900 mb-1">Invoice Presentation</p>
                        <p className="text-xs text-slate-500 leading-relaxed">Create a presentation for an invoice</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'configure' && selectedType && (
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/30 border border-blue-100/60 shadow-sm">
                <div className="flex items-start gap-4 p-5">
                  <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 shadow-lg shadow-blue-600/30">
                    <Icon icon="solar:videocamera-record-linear" className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">Present with Confidence</h4>
                    <p className="text-[13px] text-slate-600 leading-relaxed">
                      Create personalized video presentations that showcase your quotes and invoices in an engaging way. Help your clients understand the value you're offering with a face-to-face experience.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-3">
                  {documentNumber && documentTitle ? 'Selected Document' : `Select ${selectedType === 'quote' ? 'Quote' : 'Invoice'}`}
                </label>
                {documentNumber && documentTitle ? (
                  <div className="w-full px-4 py-3.5 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedType === 'quote' ? 'bg-blue-100' : 'bg-emerald-100'
                      }`}>
                        <Icon
                          icon={selectedType === 'quote' ? 'solar:document-text-bold' : 'solar:bill-list-bold'}
                          className={`w-5 h-5 ${selectedType === 'quote' ? 'text-blue-600' : 'text-emerald-600'}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900">{documentNumber}</p>
                        <p className="text-xs text-slate-600 truncate">{documentTitle}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <select
                    value={selectedDocument}
                    onChange={(e) => setSelectedDocument(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all hover:border-slate-300 hover:shadow-sm"
                  >
                    <option value="">Choose a {selectedType}...</option>
                    {(selectedType === 'quote' ? mockQuotes : mockInvoices).map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.number} - {doc.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-3">Recording Settings</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center">
                        <Icon icon="solar:videocamera-linear" className="w-4 h-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Webcam</p>
                        <p className="text-xs text-slate-500">Show your video feed</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setWebcamEnabled(!webcamEnabled)}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                        webcamEnabled ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                          webcamEnabled ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center">
                        <Icon icon="solar:microphone-linear" className="w-4 h-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Microphone</p>
                        <p className="text-xs text-slate-500">Record your voice</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setMicEnabled(!micEnabled)}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                        micEnabled ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                          micEnabled ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className={`flex gap-3 pt-2 ${preSelectedType ? 'justify-end' : ''}`}>
                {!preSelectedType && (
                  <button
                    onClick={() => setCurrentStep('select')}
                    className="flex-1 px-5 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-200 hover:shadow-sm active:scale-[0.98]"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={() => setCurrentStep('presentation-mode')}
                  disabled={!selectedDocument && !(documentNumber && documentTitle)}
                  className={`${preSelectedType ? 'w-52' : 'flex-1'} px-5 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-lg shadow-slate-900/30 hover:bg-slate-800 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]`}
                >
                  Continue
                  <Icon icon="solar:arrow-right-linear" className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 'presentation-mode' && selectedType && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setCameraView('thumbnail')}
                    className={`group relative overflow-hidden p-5 bg-white rounded-2xl transition-all duration-300 hover:shadow-lg active:scale-[0.98] ${
                      cameraView === 'thumbnail'
                        ? 'border-2 border-blue-500 shadow-lg shadow-blue-500/20'
                        : 'border-2 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="aspect-video bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl mb-4 overflow-hidden relative border border-slate-200/60 flex items-center justify-center">
                      <div className="w-[70%] h-[85%] bg-white rounded-lg shadow-sm flex flex-col items-center justify-center gap-2.5 p-3.5">
                        <div className="w-full h-2 bg-blue-500 rounded-full"></div>
                        <div className="w-full space-y-1.5">
                          <div className="w-4/5 h-1.5 bg-slate-200 rounded-full"></div>
                          <div className="w-3/5 h-1.5 bg-slate-200 rounded-full"></div>
                        </div>
                        <div className="w-full h-8 bg-slate-100 rounded"></div>
                        <div className="w-full space-y-1.5">
                          <div className="w-2/5 h-1.5 bg-slate-200 rounded-full"></div>
                        </div>
                        <div className="w-full h-6 bg-blue-500 rounded"></div>
                      </div>
                      <div className="absolute top-4 right-4 w-16 h-12 rounded-lg border-2 border-white shadow-lg overflow-hidden">
                        <img
                          src={PLACEHOLDER_PHOTO}
                          alt="Presenter"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="text-left space-y-1.5">
                      <h4 className="text-base font-bold text-slate-900">Thumbnail View</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Show your {selectedType} with your camera in a thumbnail overlay. Best for walking clients through details.
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setCameraView('full-camera')}
                    className={`group relative overflow-hidden p-5 bg-white rounded-2xl transition-all duration-300 hover:shadow-lg active:scale-[0.98] ${
                      cameraView === 'full-camera'
                        ? 'border-2 border-blue-500 shadow-lg shadow-blue-500/20'
                        : 'border-2 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl mb-4 overflow-hidden border border-slate-200/60">
                      <img
                        src={PLACEHOLDER_PHOTO}
                        alt="Presenter"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left space-y-1.5">
                      <h4 className="text-base font-bold text-slate-900">Full-Camera View</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Show only your camera in full view. Best for a personal, engaging face-to-face presentation with clients.
                      </p>
                    </div>
                  </button>
                </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setCurrentStep('configure')}
                  className="flex-1 px-5 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-200 hover:shadow-sm active:scale-[0.98]"
                >
                  Back
                </button>
                <button
                  onClick={handleStartPresentation}
                  disabled={!cameraView}
                  className="flex-1 px-5 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-lg shadow-slate-900/30 hover:bg-slate-800 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  Start Presentation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.getElementById('modal-root')!);
}
