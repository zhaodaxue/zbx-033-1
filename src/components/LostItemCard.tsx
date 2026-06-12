import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, MapPin, Phone, Calendar, CheckCircle } from 'lucide-react';
import type { LostItem } from '../types';
import { useLostItemStore } from '../store/useLostItemStore';

interface LostItemCardProps {
  item: LostItem;
}

export function LostItemCard({ item }: LostItemCardProps) {
  const { expandedItemId, toggleExpand, markAsClaimed } = useLostItemStore();
  const isExpanded = expandedItemId === item.id;

  const showDetails = isExpanded;

  const TEN_MINUTES = 10 * 60 * 1000;
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!item.createdAt || item.isClaimed) return;
    const elapsed = Date.now() - item.createdAt;
    if (elapsed >= TEN_MINUTES) return;
    const remaining = TEN_MINUTES - elapsed;
    const timer = setTimeout(() => setNow(Date.now()), remaining);
    const interval = setInterval(() => setNow(Date.now()), 30000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [item.createdAt, item.isClaimed]);

  const isJustPosted =
    item.createdAt && !item.isClaimed && now - item.createdAt < TEN_MINUTES;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <div
      className={`relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
        item.isClaimed ? 'opacity-60 grayscale' : 'hover:shadow-lg hover:-translate-y-0.5'
      }`}
    >
      {item.isClaimed && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-300">
            <CheckCircle size={14} />
            已认领
          </span>
        </div>
      )}

      {isJustPosted && !item.isClaimed && (
        <div className="absolute top-3 right-3 z-10 print:hidden">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full border border-red-200 animate-pulse">
            刚发布
          </span>
        </div>
      )}

      <div
        className="p-5 cursor-pointer print:cursor-default"
        onClick={() => toggleExpand(item.id)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3
              className={`text-lg font-semibold mb-2 ${
                item.isClaimed ? 'text-gray-500 line-through' : 'text-gray-800'
              }`}
            >
              {item.title}
            </h3>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1">
                <Calendar size={14} />
                {formatDate(item.postDate)}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin size={14} />
                {item.floor}楼
              </span>
              <span className="inline-flex items-center gap-1">
                <Phone size={14} />
                尾号 {item.contactTail}
              </span>
            </div>

            <div className={`${showDetails ? 'block' : 'hidden'} print:block`}>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-gray-600 leading-relaxed mb-4">
                  {item.description}
                </p>

                {!item.isClaimed && (
                  <div className="print:hidden">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsClaimed(item.id);
                      }}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                    >
                      ✓ 标记已认领
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 print:hidden">
            {isExpanded ? (
              <ChevronUp size={20} className="text-gray-400" />
            ) : (
              <ChevronDown size={20} className="text-gray-400" />
            )}
          </div>
        </div>
      </div>

      <div
        className="absolute top-0 left-4 w-3 h-3 rounded-full bg-red-400 shadow-md -mt-1.5"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
      />
    </div>
  );
}
