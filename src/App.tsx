import { Header } from './components/Header';
import { LostItemCard } from './components/LostItemCard';
import { StatsBar } from './components/StatsBar';
import { useLostItemStore } from './store/useLostItemStore';
import { applyFilters } from './utils/filter';

function App() {
  const { items, selectedFloors, onlyUnclaimed, getSortedItems } = useLostItemStore();

  const sortedItems = getSortedItems();
  const filteredItems = applyFilters(sortedItems, { selectedFloors, onlyUnclaimed });

  return (
    <div className="min-h-screen bg-amber-50">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <div className="text-5xl mb-4">📭</div>
            <p>暂无符合条件的失物信息</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <LostItemCard key={item.id} item={item} />
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
