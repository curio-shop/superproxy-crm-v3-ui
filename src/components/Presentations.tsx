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
}

export default function Presentations({ showRecordModal, onCloseRecordModal, onOpenRecordModal, onDeletePresentation }: PresentationsProps) {
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
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
              filterType === 'all'
                ? 'bg-blue-50/80 text-blue-700 shadow-sm border border-blue-200'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            All
            <span className={`ml-2 text-xs ${filterType === 'all' ? 'opacity-75' : 'opacity-60'}`}>({presentations.length})</span>
          </button>
          <button
            onClick={() => setFilterType('quote')}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all flex items-center gap-1.5 ${
              filterType === 'quote'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20 border border-blue-500'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <Icon icon="solar:document-text-bold" className="w-4 h-4" />
            Quotes
            <span className={`ml-1 text-xs ${filterType === 'quote' ? 'opacity-75' : 'opacity-60'}`}>({presentations.filter((p) => p.type === 'quote').length})</span>
          </button>
          <button
            onClick={() => setFilterType('invoice')}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all flex items-center gap-1.5 ${
              filterType === 'invoice'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 border border-emerald-500'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <Icon icon="solar:bill-list-bold" className="w-4 h-4" />
            Invoices
            <span className={`ml-1 text-xs ${filterType === 'invoice' ? 'opacity-75' : 'opacity-60'}`}>({presentations.filter((p) => p.type === 'invoice').length})</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <SortDropdown
            value={sortBy}
            options={sortOptions}
            onChange={(value) => setSortBy(value as SortType)}
          />

          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-all ${
                viewMode === 'grid' ? 'bg-slate-100 text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-all ${
                viewMode === 'list' ? 'bg-slate-100 text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => onOpenRecordModal?.()}
            className="flex items-center gap-2 bg-gradient-to-b from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 border-t border-white/20 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Icon icon="solar:videocamera-record-bold" width="18" className="text-indigo-100" />
            <span className="text-sm font-semibold tracking-wide">Record New</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="w-full sm:w-auto sm:min-w-[320px] sm:max-w-md relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Search presentations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600/50 text-sm shadow-sm transition-all hover:border-slate-300"
          />
        </div>

        <ScopeFilter value={scope} onChange={setScope} />
      </div>

      {filteredAndSortedPresentations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-6">
            <Video className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No presentations found</h3>
          <p className="text-slate-500 mb-6 text-center max-w-md">
            {searchQuery
              ? 'Try adjusting your search query or filters'
              : 'Get started by recording your first video presentation'}
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
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

      {showRecordModal && <RecordPresentationModal onClose={onCloseRecordModal} />}
    </div>
  );
}
