import { useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { LostItemCard } from './components/LostItemCard';
import { StatsBar } from './components/StatsBar';
import { SupplementForm } from './components/SupplementForm';
import { useLostItemStore } from './store/useLostItemStore';
import { applyFilters } from './utils/filter';

function App() {
  const {
    items,
    selectedFloors,
    onlyUnclaimed,
    expandedItemId,
    getSortedItems,
    getHiddenSupplementCount,
    relaxFilters,
  } = useLostItemStore();

  const sortedItems = getSortedItems();
  const filteredItems = applyFilters(sortedItems, { selectedFloors, onlyUnclaimed });
  const hiddenCount = getHiddenSupplementCount();

  const expandedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (expandedItemId && expandedRef.current) {
      expandedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [expandedItemId]);

  return (
    <div className="min-h-screen bg-amber-50">
      <Header />
      <SupplementForm />

      <main className="max-w-4xl mx-auto px-6 py-8">
        {hiddenCount > 0 && (
          <div className="mb-4 px-4 py-3 bg-amber-100 border border-amber-300 rounded-lg flex items-center justify-between print:hidden">
            <span className="text-amber-800 text-sm">
              有 {hiddenCount} 条新补录未在当前筛选中
            </span>
            <button
              onClick={relaxFilters}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-sm rounded-md font-medium transition-colors"
            >
              放宽筛选查看
            </button>
          </div>
        )}

        {filteredItems.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <div className="text-5xl mb-4">📭</div>
            <p>暂无符合条件的失物信息</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} ref={item.id === expandedItemId ? expandedRef : undefined}>
                <LostItemCard item={item} />
              </div>
            ))}
          </div>
        )}
      </main>

      <StatsBar />

      <footer className="print:hidden bg-amber-100 text-amber-700 text-center py-4 text-sm">
        <p>小区物业 · 失物招领服务中心</p>
      </footer>
    </div>
  );
}

export default App;
