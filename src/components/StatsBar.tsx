import { Package, TrendingUp, Building2 } from 'lucide-react';
import { useLostItemStore } from '../store/useLostItemStore';
import { computeStats } from '../utils/statistics';
import { applyFilters } from '../utils/filter';

export function StatsBar() {
  const { items, selectedFloors, onlyUnclaimed } = useLostItemStore();

  const filteredItems = applyFilters(items, { selectedFloors, onlyUnclaimed });
  const stats = computeStats(filteredItems);

  return (
    <div className="bg-amber-50 border-t border-amber-200 px-6 py-4 print:hidden">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm text-center border border-amber-100">
            <div className="flex items-center justify-center mb-2">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Package size={20} className="text-orange-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {stats.unclaimedCount}
            </div>
            <div className="text-xs text-gray-500 mt-1">未认领条数</div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm text-center border border-amber-100">
            <div className="flex items-center justify-center mb-2">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp size={20} className="text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {stats.newThisWeekCount}
            </div>
            <div className="text-xs text-gray-500 mt-1">本周新贴</div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm text-center border border-amber-100">
            <div className="flex items-center justify-center mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Building2 size={20} className="text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {stats.floorsCount}
            </div>
            <div className="text-xs text-gray-500 mt-1">涉及楼层</div>
          </div>
        </div>
      </div>
    </div>
  );
}
