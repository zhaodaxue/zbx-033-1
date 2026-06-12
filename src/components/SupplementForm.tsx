import { useState } from 'react';
import { X } from 'lucide-react';
import { useLostItemStore } from '../store/useLostItemStore';

interface FormErrors {
  title?: string;
  floor?: string;
  contactTail?: string;
}

export function SupplementForm() {
  const { showForm, setShowForm, addItem } = useLostItemStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [floor, setFloor] = useState<number>(1);
  const [contactTail, setContactTail] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  if (!showForm) return null;

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!title.trim()) {
      errs.title = '请填写物品简述';
    }
    if (floor < 1 || floor > 8) {
      errs.floor = '楼层须为 1–8';
    }
    if (!/^\d{4}$/.test(contactTail)) {
      errs.contactTail = '请输入4位数字';
    }
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    addItem({ title: title.trim(), description: description.trim(), floor, contactTail });
    setTitle('');
    setDescription('');
    setFloor(1);
    setContactTail('');
    setErrors({});
  };

  const handleClose = () => {
    setShowForm(false);
    setErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 print:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-amber-50">
          <h2 className="text-lg font-bold text-amber-900">现场补录</h2>
          <button
            onClick={handleClose}
            className="p-1 rounded hover:bg-amber-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              物品简述 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="如：黑色皮质钱包"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.title ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              详情描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="捡到物品的详细情况（选填）"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              发现楼层
            </label>
            <select
              value={floor}
              onChange={(e) => {
                setFloor(Number(e.target.value));
                if (errors.floor) setErrors((prev) => ({ ...prev, floor: undefined }));
              }}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.floor ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((f) => (
                <option key={f} value={f}>
                  {f} 楼
                </option>
              ))}
            </select>
            {errors.floor && (
              <p className="mt-1 text-xs text-red-500">{errors.floor}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              联系人尾号
            </label>
            <input
              type="text"
              value={contactTail}
              onChange={(e) => {
                setContactTail(e.target.value.replace(/\D/g, '').slice(0, 4));
                if (errors.contactTail) setErrors((prev) => ({ ...prev, contactTail: undefined }));
              }}
              placeholder="4位数字"
              maxLength={4}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                errors.contactTail ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.contactTail && (
              <p className="mt-1 text-xs text-red-500">{errors.contactTail}</p>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            提交补录
          </button>
        </div>
      </div>
    </div>
  );
}
