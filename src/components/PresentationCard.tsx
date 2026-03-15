import { Play, Eye, MoreVertical, Share2, Trash2, Download } from 'lucide-react';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { Presentation, formatDuration } from '../data/mockPresentations';

interface PresentationCardProps {
  presentation: Presentation;
  onView: (presentation: Presentation) => void;
  onDelete?: (id: string) => void;
}

export default function PresentationCard({ presentation, onView, onDelete }: PresentationCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/presentations/${presentation.id}`);
    alert('Link copied to clipboard!');
    setShowMenu(false);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = presentation.thumbnailUrl;
    link.download = `${presentation.referenceNumber}-${presentation.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(presentation.id);
    }
    setShowMenu(false);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div
      className="group relative bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMenu(false);
      }}
    >
      <div className="relative aspect-video overflow-hidden bg-slate-100 cursor-pointer rounded-t-xl" onClick={() => onView(presentation)}>
        <img
          src={presentation.thumbnailUrl}
          alt={presentation.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />

        <div className="absolute bottom-2 right-2 bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-semibold text-white">
          {formatDuration(presentation.duration)}
        </div>

        <div
          className={`absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] flex items-center justify-center transition-opacity ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center transform transition-transform group-hover:scale-110 shadow-lg">
            <Play className="w-7 h-7 text-white ml-1" fill="currentColor" />
          </div>
        </div>

        <div className={`absolute top-2 left-2 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-md ${
            presentation.type === 'quote'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
          }`}>
            <Icon
              icon={presentation.type === 'quote' ? 'solar:document-text-bold' : 'solar:bill-list-bold'}
              className="w-3.5 h-3.5"
            />
            {presentation.type === 'quote' ? 'Quote' : 'Invoice'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 group-hover:text-slate-900 transition-colors">
            {presentation.title}
          </h3>

          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-slate-100 rounded-md transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-slate-500" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-36 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                <button
                  onClick={handleShare}
                  className="w-full px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Share Link
                </button>
                <button
                  onClick={handleDownload}
                  className="w-full px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={handleDelete}
                  className="w-full px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-700 flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 mb-3">
          <span className="font-mono font-medium">{presentation.referenceNumber}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span className="font-medium">{presentation.views.toLocaleString()} views</span>
          </div>
          <span className="font-medium">{formatDate(presentation.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
