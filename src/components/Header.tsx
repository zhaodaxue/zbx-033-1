import { Printer, Filter } from 'lucide-react';
import { useLostItemStore } from '../store/useLostItemStore';
import { getAllFloors } from '../utils/statistics';

export function Header() {
  const { items, selectedFloors, onlyUnclaimed, toggleFloor, setOnlyUnclaimed } =
    useLostItemStore();

  const allFloors = getAllFloors(items);

  const handlePrint = () => {
    window.print();
  };

  return (
    <header>
      <div className="bg-gradient-to-b from-amber-800 to-amber-900 text-white py-6 px-6 shadow-lg relative overflow-hidden print:bg-white print:text-black print:shadow-none print:py-4 print:border-b-2 print:border-gray-800">
        <div className="absolute inset-0 opacity-10 print:hidden">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(0,0,0,0.1) 50px, rgba(0,0,0,0.1) 51px)',
            }}
          />
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-1 print:text-2xl print:text-black" style={{ fontFamily: '"Noto Serif SC", "Source Han Serif SC", serif' }}>
            🏘️ 楼道失物招领张贴栏
          </h1>
          <p className="text-amber-200 text-center text-sm print:text-gray-600">
            拾金不昧 · 温暖邻里
          </p>
        </div>
      </div>

      <div className="bg-amber-50 border-b border-amber-200 px-6 py-4 shadow-sm print:hidden">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-amber-700" />
              <span className="text-amber-800 font-medium text-sm">楼层筛选：</span>
              <div className="flex flex-wrap gap-2">
                {allFloors.map((floor) => {
                  const isSelected = selectedFloors.includes(floor);
                  return (
                    <button
                      key={floor}
                      onClick={() => toggleFloor(floor)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-orange-500 text-white shadow-md'
                          : 'bg-white text-amber-700 border border-amber-300 hover:bg-amber-100'
                      }`}
                    >
                      {floor}楼
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyUnclaimed}
                  onChange={(e) => setOnlyUnclaimed(e.target.checked)}
                  className="w-4 h-4 accent-orange-500"
                />
                <span className="text-amber-800 text-sm">仅看未认领</span>
              </label>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
              >
                <Printer size={18} />
                <span>打印张贴栏</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
