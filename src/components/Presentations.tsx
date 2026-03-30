import { useState, useMemo } from 'react';
import { Search, Video, Grid3x3, List, Eye } from 'lucide-react';
import { Icon } from '@iconify/react';
import ScopeFilter from './ScopeFilter';
import SortDropdown from './SortDropdown';
import PresentationCard from './PresentationCard';
import PresentationViewer from './PresentationViewer';
import RecordPresentationModal from './RecordPresentationModal';
import { mockPresentations, Presentation } from '../data/mockPresentations';

type FilterType = 'all' | 'quote' | 'invoice';
type SortType = 'newest' | 'oldest' | 'most-viewed' | 'longest' | 'shortest';
type ViewMode = 'grid' | 'list';

interface PresentationsProps {
  showRecordModal: boolean;
  onCloseRecordModal: () => void;
  onOpenRecordModal?: () => void;
  onDeletePresentation?: (presentation: Presentation) => void;
  isFreeTier?: boolean;
  onUpgrade?: () => void;
}

export default function Presentations({ showRecordModal, onCloseRecordModal, onOpenRecordModal, onDeletePresentation, isFreeTier = false, onUpgrade }: PresentationsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [scope, setScope] = useState<'all' | 'team' | 'personal'>('team');
  const [sortBy, setSortBy] = useState<SortType>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedPresentation, setSelectedPresentation] = useState<Presentation | null>(null);
  const [presentations, setPresentations] = useState(mockPresentations);

  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: 'solar:sort-from-top-to-bottom-linear' },
    { value: 'oldest', label: 'Oldest First', icon: 'solar:sort-from-bottom-to-top-linear' },
    { value: 'most-viewed', label: 'Most Viewed', icon: 'solar:eye-linear' },
    { value: 'longest', label: 'Longest', icon: 'solar:clock-circle-linear' },
    { value: 'shortest', label: 'Shortest', icon: 'solar:hourglass-linear' },
  ];

  const filteredAndSortedPresentations = useMemo(() => {
    let filtered = presentations;

    if (filterType !== 'all') {
      filtered = filtered.filter((p) => p.type === filterType);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.referenceNumber.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        case 'most-viewed':
          return b.views - a.views;
        case 'longest':
          return b.duration - a.duration;
        case 'shortest':
          return a.duration - b.duration;
        default:
          return 0;
      }
    });

    return sorted;
  }, [presentations, filterType, searchQuery, sortBy]);

  const handleDelete = (id: string) => {
    const presentation = presentations.find(p => p.id === id);
    if (presentation) {
      onDeletePresentation?.(presentation);
    }
    setPresentations(presentations.filter((p) => p.id !== id));
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="group w-full sm:w-80 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-500 transition-colors" />
            <input
              type="text"
              placeholder="Search walkthroughs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white text-slate-600 placeholder-slate-400 focus:outline-none focus:border-slate-400 sm:text-sm transition-colors hover:border-slate-300"
            />
          </div>

          {/* Type filter */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${filterType === 'all' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('quote')}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${filterType === 'quote' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Quotes
            </button>
            <button
              onClick={() => setFilterType('invoice')}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${filterType === 'invoice' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Invoices
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => onOpenRecordModal?.()}
            className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50 px-4 py-2 rounded-xl transition-all active:scale-[0.98]"
          >
            <Icon icon="solar:videocamera-record-linear" width="15" className="text-slate-400" />
            <span className="text-[13px] font-medium">Record</span>
          </button>
        </div>
      </div>

      {/* Empty state */}
      {filteredAndSortedPresentations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
            <Video className="w-5 h-5 text-slate-400" />
          </div>
          <h3 className="text-sm font-semibold text-slate-700 mb-1">No walkthroughs found</h3>
          <p className="text-[13px] text-slate-400 text-center max-w-sm">
            {searchQuery
              ? 'Try adjusting your search or filters.'
              : 'Record your first video walkthrough to get started.'}
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
          {filteredAndSortedPresentations.map((presentation) => (
            <PresentationCard
              key={presentation.id}
              presentation={presentation}
              onView={setSelectedPresentation}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {selectedPresentation && (
        <PresentationViewer
          presentation={selectedPresentation}
          onClose={() => setSelectedPresentation(null)}
        />
      )}

      {showRecordModal && <RecordPresentationModal onClose={onCloseRecordModal} isFreeTier={isFreeTier} onUpgrade={onUpgrade} />}
    </div>
  );
}
