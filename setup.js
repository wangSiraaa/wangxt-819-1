import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const files = {
  'src/types/index.ts': `export interface Equipment {
  id: string;
  name: string;
  category: string;
  status: 'normal' | 'maintenance' | 'broken';
}

export interface Room {
  id: string;
  name: string;
  description: string;
  image: string;
  capacity: number;
  equipment: string[];
  isOutOfService: boolean;
  outOfServiceReason?: string;
  basePrice: number;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isPeak: boolean;
  price: number;
  isBooked: boolean;
  bookedBy?: string;
}

export interface Deposit {
  userId: string;
  userName: string;
  amount: number;
  paidAt: string;
  status: 'paid' | 'refunded';
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  date: string;
  timeSlotId: string;
  timeSlot: string;
  userId: string;
  userName: string;
  userPhone: string;
  equipment: string[];
  totalPrice: number;
  depositRequired: boolean;
  depositPaid: boolean;
  status: 'draft' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  remark?: string;
}

export interface FilterOptions {
  capacity?: number;
  equipment?: string[];
  date?: string;
  showOutOfService: boolean;
}

export type UserRole = 'user' | 'admin';
`,

  'src/data/mockData.ts': `import { Room, Equipment, Deposit, TimeSlot } from '../types';

export const mockEquipment: Equipment[] = [
  { id: 'eq1', name: '电吉他', category: '弦乐器', status: 'normal' },
  { id: 'eq2', name: '木吉他', category: '弦乐器', status: 'normal' },
  { id: 'eq3', name: '架子鼓', category: '打击乐器', status: 'maintenance' },
  { id: 'eq4', name: '贝斯', category: '弦乐器', status: 'normal' },
  { id: 'eq5', name: '电子琴', category: '键盘乐器', status: 'normal' },
  { id: 'eq6', name: '麦克风', category: '拾音设备', status: 'normal' },
  { id: 'eq7', name: '音响系统', category: '音响设备', status: 'normal' },
  { id: 'eq8', name: '调音台', category: '音响设备', status: 'broken' },
];

export const mockRooms: Room[] = [
  {
    id: 'room1',
    name: '摇滚排练室 A',
    description: '适合摇滚乐队排练，配备完整的架子鼓和音响系统',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=music%20rehearsal%20studio%20room%20with%20drums%20and%20guitars%20professional%20interior&image_size=square_hd',
    capacity: 8,
    equipment: ['eq1', 'eq3', 'eq4', 'eq6', 'eq7'],
    isOutOfService: false,
    basePrice: 150,
  },
  {
    id: 'room2',
    name: '流行排练室 B',
    description: '适合流行乐队，配备电子琴和调音台',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20music%20studio%20with%20keyboard%20and%20mixer%20bright%20lighting&image_size=square_hd',
    capacity: 6,
    equipment: ['eq2', 'eq4', 'eq5', 'eq6', 'eq7', 'eq8'],
    isOutOfService: false,
    basePrice: 120,
  },
  {
    id: 'room3',
    name: '小型练习室 C',
    description: '适合个人练习或小型组合',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=small%20cozy%20music%20practice%20room%20with%20acoustic%20guitar&image_size=square_hd',
    capacity: 3,
    equipment: ['eq2', 'eq5', 'eq6'],
    isOutOfService: true,
    outOfServiceReason: '空调维修中',
    basePrice: 80,
  },
  {
    id: 'room4',
    name: '专业录音室 D',
    description: '专业级录音设备，适合专辑录制',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20recording%20studio%20with%20microphones%20and%20sound%20proofing&image_size=square_hd',
    capacity: 5,
    equipment: ['eq1', 'eq2', 'eq5', 'eq6', 'eq7', 'eq8'],
    isOutOfService: false,
    basePrice: 300,
  },
];

export const mockDeposits: Deposit[] = [
  {
    userId: 'user1',
    userName: '张三',
    amount: 500,
    paidAt: '2024-01-15T10:00:00Z',
    status: 'paid',
  },
  {
    userId: 'user2',
    userName: '李四',
    amount: 500,
    paidAt: '2024-02-20T14:30:00Z',
    status: 'refunded',
  },
];

export const generateTimeSlots = (date: string, roomId: string): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const bookedSlots = new Set<string>();
  
  const seed = date + roomId;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash;
  }
  const randomBooked = Math.abs(hash) % 5 + 2;
  for (let i = 0; i < randomBooked; i++) {
    const hour = Math.abs(hash + i * 7) % 12 + 9;
    bookedSlots.add(\`\${hour}:00\`);
  }

  for (let hour = 9; hour <= 22; hour++) {
    const startTime = \`\${hour.toString().padStart(2, '0')}:00\`;
    const endTime = \`\${(hour + 1).toString().padStart(2, '0')}:00\`;
    const isPeak = hour >= 18 && hour <= 21;
    const basePrice = mockRooms.find(r => r.id === roomId)?.basePrice || 100;
    
    slots.push({
      id: \`\${roomId}-\${date}-\${hour}\`,
      startTime,
      endTime,
      isPeak,
      price: isPeak ? Math.round(basePrice * 1.5) : basePrice,
      isBooked: bookedSlots.has(startTime),
    });
  }
  
  return slots;
};
`,

  'src/utils/storage.ts': `import { Booking, Deposit, UserRole } from '../types';

const STORAGE_KEYS = {
  BOOKINGS: 'music_studio_bookings',
  DEPOSITS: 'music_studio_deposits',
  DRAFT: 'music_studio_draft',
  USER_ROLE: 'music_studio_role',
  CURRENT_USER: 'music_studio_user',
};

export const storage = {
  getBookings: (): Booking[] => {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return data ? JSON.parse(data) : [];
  },

  saveBookings: (bookings: Booking[]) => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  },

  addBooking: (booking: Booking) => {
    const bookings = storage.getBookings();
    bookings.push(booking);
    storage.saveBookings(bookings);
  },

  updateBooking: (id: string, updates: Partial<Booking>) => {
    const bookings = storage.getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index !== -1) {
      bookings[index] = { ...bookings[index], ...updates };
      storage.saveBookings(bookings);
    }
  },

  cancelBooking: (id: string) => {
    storage.updateBooking(id, { status: 'cancelled' });
  },

  getDeposits: (): Deposit[] => {
    const data = localStorage.getItem(STORAGE_KEYS.DEPOSITS);
    return data ? JSON.parse(data) : [];
  },

  saveDeposits: (deposits: Deposit[]) => {
    localStorage.setItem(STORAGE_KEYS.DEPOSITS, JSON.stringify(deposits));
  },

  addDeposit: (deposit: Deposit) => {
    const deposits = storage.getDeposits();
    deposits.push(deposit);
    storage.saveDeposits(deposits);
  },

  hasPaidDeposit: (userId: string): boolean => {
    const deposits = storage.getDeposits();
    return deposits.some(d => d.userId === userId && d.status === 'paid');
  },

  getDraft: (): Booking | null => {
    const data = localStorage.getItem(STORAGE_KEYS.DRAFT);
    return data ? JSON.parse(data) : null;
  },

  saveDraft: (draft: Partial<Booking>) => {
    localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(draft));
  },

  clearDraft: () => {
    localStorage.removeItem(STORAGE_KEYS.DRAFT);
  },

  getUserRole: (): UserRole => {
    const role = localStorage.getItem(STORAGE_KEYS.USER_ROLE);
    return (role as UserRole) || 'user';
  },

  setUserRole: (role: UserRole) => {
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
  },

  getCurrentUser: () => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : { id: 'user1', name: '张三', phone: '13800138000' };
  },

  setCurrentUser: (user: { id: string; name: string; phone: string }) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },

  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  },
};
`,

  'src/components/RoomCard.tsx': `import React from 'react';
import { Room, Equipment } from '../types';

interface RoomCardProps {
  room: Room;
  equipmentList: Equipment[];
  onClick: () => void;
  selected?: boolean;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, equipmentList, onClick, selected }) => {
  const roomEquipment = equipmentList.filter(eq => room.equipment.includes(eq.id));
  const brokenEquipment = roomEquipment.filter(eq => eq.status === 'broken');
  const maintenanceEquipment = roomEquipment.filter(eq => eq.status === 'maintenance');

  return (
    <div
      className={\`room-card \${selected ? 'selected' : ''} \${room.isOutOfService ? 'out-of-service' : ''}\`}
      onClick={onClick}
    >
      <div className="room-image">
        <img src={room.image} alt={room.name} />
        {room.isOutOfService && (
          <div className="out-of-service-overlay">
            <span>暂停服务</span>
          </div>
        )}
      </div>
      
      <div className="room-info">
        <div className="room-header">
          <h3>{room.name}</h3>
          <span className="room-price">¥{room.basePrice}/小时</span>
        </div>
        
        <p className="room-description">{room.description}</p>
        
        <div className="room-meta">
          <span className="capacity">容纳 {room.capacity} 人</span>
        </div>
        
        <div className="equipment-tags">
          {roomEquipment.slice(0, 4).map(eq => (
            <span
              key={eq.id}
              className={\`equipment-tag \${eq.status}\`}
            >
              {eq.name}
              {eq.status === 'broken' && ' (故障)'}
              {eq.status === 'maintenance' && ' (维护中)'}
            </span>
          ))}
          {roomEquipment.length > 4 && (
            <span className="equipment-tag more">+{roomEquipment.length - 4}</span>
          )}
        </div>
        
        {(brokenEquipment.length > 0 || maintenanceEquipment.length > 0) && (
          <div className="warning-box">
            {brokenEquipment.length > 0 && (
              <p className="warning broken">⚠️ {brokenEquipment.map(e => e.name).join('、')} 故障</p>
            )}
            {maintenanceEquipment.length > 0 && (
              <p className="warning maintenance">🔧 {maintenanceEquipment.map(e => e.name).join('、')} 维护中</p>
            )}
          </div>
        )}
        
        {room.isOutOfService && room.outOfServiceReason && (
          <div className="out-of-service-reason">
            原因: {room.outOfServiceReason}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
`,

  'src/components/TimeSlotSelector.tsx': `import React from 'react';
import { TimeSlot } from '../types';

interface TimeSlotSelectorProps {
  timeSlots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSelect: (slot: TimeSlot) => void;
  hasDeposit: boolean;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  timeSlots,
  selectedSlot,
  onSelect,
  hasDeposit,
}) => {
  return (
    <div className="time-slot-selector">
      <h4>选择时段</h4>
      {!hasDeposit && (
        <div className="deposit-warning">
          ⚠️ 黄金时段 (18:00-22:00) 需要先缴纳押金才能预约
        </div>
      )}
      <div className="time-slots-grid">
        {timeSlots.map(slot => {
          const isDisabled = slot.isBooked || (slot.isPeak && !hasDeposit);
          const isSelected = selectedSlot?.id === slot.id;
          
          return (
            <button
              key={slot.id}
              className={\`time-slot \${slot.isPeak ? 'peak' : ''} \${isSelected ? 'selected' : ''} \${isDisabled ? 'disabled' : ''}\`}
              onClick={() => !isDisabled && onSelect(slot)}
              disabled={isDisabled}
            >
              <span className="slot-time">{slot.startTime} - {slot.endTime}</span>
              <span className="slot-price">¥{slot.price}</span>
              {slot.isPeak && <span className="peak-badge">黄金时段</span>}
              {slot.isBooked && <span className="booked-badge">已预约</span>}
              {isDisabled && !slot.isBooked && slot.isPeak && !hasDeposit && (
                <span className="lock-badge">🔒 需押金</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotSelector;
`,

  'src/components/RoomFilter.tsx': `import React from 'react';
import { FilterOptions, Equipment } from '../types';

interface RoomFilterProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  equipmentList: Equipment[];
}

const RoomFilter: React.FC<RoomFilterProps> = ({
  filters,
  onFilterChange,
  equipmentList,
}) => {
  const handleCapacityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    onFilterChange({ ...filters, capacity: value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, date: e.target.value || undefined });
  };

  const toggleEquipment = (eqId: string) => {
    const current = filters.equipment || [];
    const next = current.includes(eqId)
      ? current.filter(id => id !== eqId)
      : [...current, eqId];
    onFilterChange({ ...filters, equipment: next.length > 0 ? next : undefined });
  };

  const toggleShowOutOfService = () => {
    onFilterChange({ ...filters, showOutOfService: !filters.showOutOfService });
  };

  const clearFilters = () => {
    onFilterChange({ showOutOfService: false });
  };

  return (
    <div className="room-filter">
      <div className="filter-header">
        <h3>筛选条件</h3>
        <button className="clear-btn" onClick={clearFilters}>清除筛选</button>
      </div>
      
      <div className="filter-section">
        <label>日期</label>
        <input
          type="date"
          value={filters.date || ''}
          onChange={handleDateChange}
        />
      </div>
      
      <div className="filter-section">
        <label>容纳人数</label>
        <select value={filters.capacity || ''} onChange={handleCapacityChange}>
          <option value="">不限</option>
          <option value="3">3人以上</option>
          <option value="5">5人以上</option>
          <option value="8">8人以上</option>
        </select>
      </div>
      
      <div className="filter-section">
        <label>设备需求</label>
        <div className="equipment-checkboxes">
          {equipmentList.map(eq => (
            <label key={eq.id} className="equipment-checkbox">
              <input
                type="checkbox"
                checked={(filters.equipment || []).includes(eq.id)}
                onChange={() => toggleEquipment(eq.id)}
              />
              <span>{eq.name}</span>
              {eq.status !== 'normal' && (
                <span className={\`status-dot \${eq.status}\`}></span>
              )}
            </label>
          ))}
        </div>
      </div>
      
      <div className="filter-section">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={filters.showOutOfService}
            onChange={toggleShowOutOfService}
          />
          显示暂停服务的房间
        </label>
      </div>
    </div>
  );
};

export default RoomFilter;
`,

  'src/components/BookingForm.tsx': `import React, { useState, useEffect } from 'react';
import { Room, TimeSlot, Equipment, Booking } from '../types';
import { storage } from '../utils/storage';

interface BookingFormProps {
  room: Room;
  timeSlot: TimeSlot;
  date: string;
  equipmentList: Equipment[];
  onSubmit: (booking: Booking) => void;
  onCancel: () => void;
  onSaveDraft: (draft: Partial<Booking>) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  room,
  timeSlot,
  date,
  equipmentList,
  onSubmit,
  onCancel,
  onSaveDraft,
}) => {
  const currentUser = storage.getCurrentUser();
  const hasDeposit = storage.hasPaidDeposit(currentUser.id);
  
  const [formData, setFormData] = useState({
    userName: currentUser.name,
    userPhone: currentUser.phone,
    selectedEquipment: [] as string[],
    remark: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const draft = storage.getDraft();
    if (draft && draft.roomId === room.id && draft.timeSlotId === timeSlot.id && draft.date === date) {
      setFormData({
        userName: draft.userName || currentUser.name,
        userPhone: draft.userPhone || currentUser.phone,
        selectedEquipment: draft.equipment || [],
        remark: draft.remark || '',
      });
    }
  }, [room.id, timeSlot.id, date, currentUser]);

  const roomEquipment = equipmentList.filter(eq => 
    room.equipment.includes(eq.id) && eq.status === 'normal'
  );

  const depositRequired = timeSlot.isPeak;
  const totalPrice = timeSlot.price;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.userName.trim()) {
      newErrors.userName = '请输入姓名';
    }
    if (!formData.userPhone.trim()) {
      newErrors.userPhone = '请输入手机号';
    } else if (!/^1[3-9]\\d{9}$/.test(formData.userPhone)) {
      newErrors.userPhone = '请输入正确的手机号';
    }
    if (depositRequired && !hasDeposit) {
      newErrors.deposit = '黄金时段需要先缴纳押金';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const booking: Booking = {
      id: \`booking-\${Date.now()}\`,
      roomId: room.id,
      roomName: room.name,
      date,
      timeSlotId: timeSlot.id,
      timeSlot: \`\${timeSlot.startTime}-\${timeSlot.endTime}\`,
      userId: currentUser.id,
      userName: formData.userName,
      userPhone: formData.userPhone,
      equipment: formData.selectedEquipment,
      totalPrice,
      depositRequired,
      depositPaid: hasDeposit,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      remark: formData.remark,
    };

    onSubmit(booking);
  };

  const handleSaveDraft = () => {
    const draft: Partial<Booking> = {
      roomId: room.id,
      roomName: room.name,
      date,
      timeSlotId: timeSlot.id,
      timeSlot: \`\${timeSlot.startTime}-\${timeSlot.endTime}\`,
      userName: formData.userName,
      userPhone: formData.userPhone,
      equipment: formData.selectedEquipment,
      totalPrice,
      depositRequired,
      remark: formData.remark,
    };
    onSaveDraft(draft);
  };

  const toggleEquipment = (eqId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedEquipment: prev.selectedEquipment.includes(eqId)
        ? prev.selectedEquipment.filter(id => id !== eqId)
        : [...prev.selectedEquipment, eqId],
    }));
  };

  return (
    <div className="booking-form">
      <h3>预约确认</h3>
      
      <div className="booking-summary">
        <div className="summary-item">
          <span className="label">房间:</span>
          <span className="value">{room.name}</span>
        </div>
        <div className="summary-item">
          <span className="label">日期:</span>
          <span className="value">{date}</span>
        </div>
        <div className="summary-item">
          <span className="label">时段:</span>
          <span className="value">{timeSlot.startTime} - {timeSlot.endTime}</span>
          {timeSlot.isPeak && <span className="peak-tag">黄金时段</span>}
        </div>
        <div className="summary-item">
          <span className="label">费用:</span>
          <span className="value price">¥{totalPrice}</span>
        </div>
        {depositRequired && (
          <div className="summary-item deposit">
            <span className="label">押金:</span>
            <span className="value">
              {hasDeposit ? '✅ 已缴纳' : '❌ 未缴纳'}
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>姓名 *</label>
          <input
            type="text"
            value={formData.userName}
            onChange={e => setFormData(prev => ({ ...prev, userName: e.target.value }))}
            className={errors.userName ? 'error' : ''}
          />
          {errors.userName && <span className="error-message">{errors.userName}</span>}
        </div>

        <div className="form-group">
          <label>手机号 *</label>
          <input
            type="tel"
            value={formData.userPhone}
            onChange={e => setFormData(prev => ({ ...prev, userPhone: e.target.value }))}
            className={errors.userPhone ? 'error' : ''}
          />
          {errors.userPhone && <span className="error-message">{errors.userPhone}</span>}
        </div>

        <div className="form-group">
          <label>使用设备 (可选)</label>
          <div className="equipment-options">
            {roomEquipment.map(eq => (
              <label key={eq.id} className="equipment-option">
                <input
                  type="checkbox"
                  checked={formData.selectedEquipment.includes(eq.id)}
                  onChange={() => toggleEquipment(eq.id)}
                />
                <span>{eq.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>备注</label>
          <textarea
            value={formData.remark}
            onChange={e => setFormData(prev => ({ ...prev, remark: e.target.value }))}
            placeholder="有什么特殊需求吗？"
            rows={3}
          />
        </div>

        {errors.deposit && (
          <div className="form-error">{errors.deposit}</div>
        )}

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            取消
          </button>
          <button type="button" className="btn-draft" onClick={handleSaveDraft}>
            保存草稿
          </button>
          <button type="submit" className="btn-primary">
            确认预约
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
`,

  'src/components/BookingDraft.tsx': `import React from 'react';
import { Booking } from '../types';

interface BookingDraftProps {
  draft: Partial<Booking> | null;
  onRestore: () => void;
  onClear: () => void;
}

const BookingDraft: React.FC<BookingDraftProps> = ({ draft, onRestore, onClear }) => {
  if (!draft) return null;

  return (
    <div className="booking-draft">
      <div className="draft-header">
        <span className="draft-icon">📝</span>
        <div className="draft-info">
          <h4>有未完成的预约草稿</h4>
          <p>
            {draft.roomName} | {draft.date} | {draft.timeSlot}
          </p>
        </div>
      </div>
      <div className="draft-actions">
        <button className="btn-restore" onClick={onRestore}>
          继续编辑
        </button>
        <button className="btn-clear" onClick={onClear}>
          清除草稿
        </button>
      </div>
    </div>
  );
};

export default BookingDraft;
`,

  'src/components/BookingHistory.tsx': `import React, { useState, useEffect } from 'react';
import { Booking } from '../types';
import { storage } from '../utils/storage';

interface BookingHistoryProps {
  onRefresh?: () => void;
}

const BookingHistory: React.FC<BookingHistoryProps> = ({ onRefresh }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'cancelled' | 'completed'>('all');

  useEffect(() => {
    loadBookings();
  }, [onRefresh]);

  const loadBookings = () => {
    const allBookings = storage.getBookings();
    const currentUser = storage.getCurrentUser();
    setBookings(allBookings.filter(b => b.userId === currentUser.id));
  };

  const filteredBookings = bookings.filter(b => 
    filter === 'all' ? true : b.status === filter
  );

  const handleCancel = (id: string) => {
    if (window.confirm('确定要取消这个预约吗？')) {
      storage.cancelBooking(id);
      loadBookings();
      onRefresh?.();
    }
  };

  const getStatusText = (status: Booking['status']) => {
    const map = {
      draft: '草稿',
      confirmed: '已确认',
      cancelled: '已取消',
      completed: '已完成',
    };
    return map[status];
  };

  const getStatusClass = (status: Booking['status']) => {
    return \`status-\${status}\`;
  };

  return (
    <div className="booking-history">
      <div className="history-header">
        <h3>我的预约</h3>
        <div className="filter-tabs">
          {(['all', 'confirmed', 'cancelled', 'completed'] as const).map(f => (
            <button
              key={f}
              className={\`filter-tab \${filter === f ? 'active' : ''}\`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? '全部' : getStatusText(f)}
            </button>
          ))}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="empty-state">
          <p>暂无预约记录</p>
        </div>
      ) : (
        <div className="booking-list">
          {filteredBookings.map(booking => (
            <div key={booking.id} className="booking-item">
              <div className="booking-main">
                <div className="booking-room">{booking.roomName}</div>
                <div className="booking-detail">
                  <span>📅 {booking.date}</span>
                  <span>⏰ {booking.timeSlot}</span>
                  <span>💰 ¥{booking.totalPrice}</span>
                </div>
                {booking.remark && (
                  <div className="booking-remark">备注: {booking.remark}</div>
                )}
              </div>
              <div className="booking-side">
                <span className={\`booking-status \${getStatusClass(booking.status)}\`}>
                  {getStatusText(booking.status)}
                </span>
                {booking.status === 'confirmed' && (
                  <button
                    className="btn-cancel"
                    onClick={() => handleCancel(booking.id)}
                  >
                    取消预约
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
`,

  'src/components/AdminPanel.tsx': `import React, { useState, useEffect } from 'react';
import { Equipment, Deposit, Room } from '../types';
import { storage } from '../utils/storage';
import { mockEquipment, mockRooms } from '../data/mockData';

interface AdminPanelProps {
  equipmentList: Equipment[];
  onEquipmentUpdate: (equipment: Equipment[]) => void;
  rooms: Room[];
  onRoomsUpdate: (rooms: Room[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  equipmentList,
  onEquipmentUpdate,
  rooms,
  onRoomsUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<'equipment' | 'deposits' | 'rooms'>('equipment');
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [localEquipment, setLocalEquipment] = useState<Equipment[]>(equipmentList);
  const [localRooms, setLocalRooms] = useState<Room[]>(rooms);

  useEffect(() => {
    setDeposits(storage.getDeposits());
  }, []);

  useEffect(() => {
    setLocalEquipment(equipmentList);
  }, [equipmentList]);

  useEffect(() => {
    setLocalRooms(rooms);
  }, [rooms]);

  const handleEquipmentStatusChange = (id: string, status: Equipment['status']) => {
    const updated = localEquipment.map(eq =>
      eq.id === id ? { ...eq, status } : eq
    );
    setLocalEquipment(updated);
    onEquipmentUpdate(updated);
  };

  const handleRoomStatusChange = (id: string, isOutOfService: boolean, reason?: string) => {
    const updated = localRooms.map(room =>
      room.id === id
        ? { ...room, isOutOfService, outOfServiceReason: isOutOfService ? reason : undefined }
        : room
    );
    setLocalRooms(updated);
    onRoomsUpdate(updated);
  };

  const handleDepositRefund = (userId: string) => {
    if (window.confirm('确定要退还该用户的押金吗？')) {
      const updated = deposits.map(d =>
        d.userId === userId ? { ...d, status: 'refunded' as const } : d
      );
      setDeposits(updated);
      storage.saveDeposits(updated);
    }
  };

  const renderEquipmentTab = () => (
    <div className="admin-equipment">
      <h4>设备管理</h4>
      <table className="admin-table">
        <thead>
          <tr>
            <th>设备名称</th>
            <th>类别</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {localEquipment.map(eq => (
            <tr key={eq.id}>
              <td>{eq.name}</td>
              <td>{eq.category}</td>
              <td>
                <span className={\`status-badge \${eq.status}\`}>
                  {eq.status === 'normal' ? '正常' : eq.status === 'maintenance' ? '维护中' : '故障'}
                </span>
              </td>
              <td>
                <select
                  value={eq.status}
                  onChange={e => handleEquipmentStatusChange(eq.id, e.target.value as Equipment['status'])}
                >
                  <option value="normal">正常</option>
                  <option value="maintenance">维护中</option>
                  <option value="broken">故障</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderDepositsTab = () => (
    <div className="admin-deposits">
      <h4>押金管理</h4>
      {deposits.length === 0 ? (
        <p className="empty-text">暂无押金记录</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>用户</th>
              <th>金额</th>
              <th>缴纳时间</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {deposits.map((d, index) => (
              <tr key={index}>
                <td>{d.userName}</td>
                <td>¥{d.amount}</td>
                <td>{new Date(d.paidAt).toLocaleString()}</td>
                <td>
                  <span className={\`status-badge \${d.status}\`}>
                    {d.status === 'paid' ? '已缴纳' : '已退还'}
                  </span>
                </td>
                <td>
                  {d.status === 'paid' && (
                    <button
                      className="btn-refund"
                      onClick={() => handleDepositRefund(d.userId)}
                    >
                      退还押金
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderRoomsTab = () => (
    <div className="admin-rooms">
      <h4>房间管理</h4>
      <table className="admin-table">
        <thead>
          <tr>
            <th>房间名称</th>
            <th>容纳人数</th>
            <th>基础价格</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {localRooms.map(room => (
            <tr key={room.id}>
              <td>{room.name}</td>
              <td>{room.capacity}人</td>
              <td>¥{room.basePrice}/小时</td>
              <td>
                <span className={\`status-badge \${room.isOutOfService ? 'broken' : 'normal'}\`}>
                  {room.isOutOfService ? '暂停服务' : '正常营业'}
                </span>
              </td>
              <td>
                <button
                  className={\`btn-toggle \${room.isOutOfService ? 'btn-enable' : 'btn-disable'}\`}
                  onClick={() => {
                    if (room.isOutOfService) {
                      handleRoomStatusChange(room.id, false);
                    } else {
                      const reason = window.prompt('请输入暂停服务原因:');
                      if (reason !== null) {
                        handleRoomStatusChange(room.id, true, reason);
                      }
                    }
                  }}
                >
                  {room.isOutOfService ? '恢复服务' : '暂停服务'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h3>管理员面板</h3>
      </div>
      
      <div className="admin-tabs">
        <button
          className={\`admin-tab \${activeTab === 'equipment' ? 'active' : ''}\`}
          onClick={() => setActiveTab('equipment')}
        >
          设备管理
        </button>
        <button
          className={\`admin-tab \${activeTab === 'deposits' ? 'active' : ''}\`}
          onClick={() => setActiveTab('deposits')}
        >
          押金管理
        </button>
        <button
          className={\`admin-tab \${activeTab === 'rooms' ? 'active' : ''}\`}
          onClick={() => setActiveTab('rooms')}
        >
          房间管理
        </button>
      </div>
      
      <div className="admin-content">
        {activeTab === 'equipment' && renderEquipmentTab()}
        {activeTab === 'deposits' && renderDepositsTab()}
        {activeTab === 'rooms' && renderRoomsTab()}
      </div>
    </div>
  );
};

export default AdminPanel;
`,

  'src/App.tsx': `import React, { useState, useEffect } from 'react';
import { Room, Equipment, TimeSlot, FilterOptions, Booking, UserRole } from './types';
import { mockRooms, mockEquipment, generateTimeSlots } from './data/mockData';
import { storage } from './utils/storage';
import RoomCard from './components/RoomCard';
import TimeSlotSelector from './components/TimeSlotSelector';
import RoomFilter from './components/RoomFilter';
import BookingForm from './components/BookingForm';
import BookingDraft from './components/BookingDraft';
import BookingHistory from './components/BookingHistory';
import AdminPanel from './components/AdminPanel';
import './App.css';

const App: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>(mockEquipment);
  const [filters, setFilters] = useState<FilterOptions>({ showOutOfService: false });
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [draft, setDraft] = useState<Partial<Booking> | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [currentUser, setCurrentUser] = useState(storage.getCurrentUser());
  const [hasDeposit, setHasDeposit] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setUserRole(storage.getUserRole());
    setHasDeposit(storage.hasPaidDeposit(currentUser.id));
    setDraft(storage.getDraft());
  }, [currentUser.id]);

  useEffect(() => {
    if (selectedRoom) {
      const slots = generateTimeSlots(selectedDate, selectedRoom.id);
      const bookings = storage.getBookings();
      const confirmedBookingSlots = new Set(
        bookings
          .filter(b => b.roomId === selectedRoom.id && b.date === selectedDate && b.status === 'confirmed')
          .map(b => b.timeSlotId)
      );
      setTimeSlots(
        slots.map(slot => ({
          ...slot,
          isBooked: slot.isBooked || confirmedBookingSlots.has(slot.id),
        }))
      );
    }
  }, [selectedRoom, selectedDate, refreshKey]);

  const filteredRooms = rooms.filter(room => {
    if (!filters.showOutOfService && room.isOutOfService) return false;
    if (filters.capacity && room.capacity < filters.capacity) return false;
    if (filters.equipment && filters.equipment.length > 0) {
      const hasAllEquipment = filters.equipment.every(eqId =>
        room.equipment.includes(eqId)
      );
      if (!hasAllEquipment) return false;
    }
    return true;
  });

  const handleRoomSelect = (room: Room) => {
    if (room.isOutOfService) return;
    setSelectedRoom(room);
    setSelectedSlot(null);
    setShowBookingForm(false);
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setShowBookingForm(true);
  };

  const handleBookingSubmit = (booking: Booking) => {
    storage.addBooking(booking);
    storage.clearDraft();
    setDraft(null);
    setShowBookingForm(false);
    setSelectedSlot(null);
    setRefreshKey(prev => prev + 1);
    alert('预约成功！');
  };

  const handleSaveDraft = (draftData: Partial<Booking>) => {
    storage.saveDraft(draftData);
    setDraft(draftData);
    alert('草稿已保存！');
  };

  const handleClearDraft = () => {
    storage.clearDraft();
    setDraft(null);
  };

  const handleRestoreDraft = () => {
    if (draft?.roomId && draft?.date && draft?.timeSlotId) {
      const room = rooms.find(r => r.id === draft.roomId);
      if (room) {
        setSelectedRoom(room);
        setSelectedDate(draft.date);
        const slot = timeSlots.find(s => s.id === draft.timeSlotId);
        if (slot) {
          setSelectedSlot(slot);
          setShowBookingForm(true);
        }
      }
    }
  };

  const toggleRole = () => {
    const newRole: UserRole = userRole === 'user' ? 'admin' : 'user';
    storage.setUserRole(newRole);
    setUserRole(newRole);
  };

  const handleDepositPayment = () => {
    if (hasDeposit) {
      alert('您已经缴纳过押金了');
      return;
    }
    if (window.confirm('确定要缴纳 ¥500 押金吗？')) {
      const newDeposit = {
        userId: currentUser.id,
        userName: currentUser.name,
        amount: 500,
        paidAt: new Date().toISOString(),
        status: 'paid' as const,
      };
      storage.addDeposit(newDeposit);
      setHasDeposit(true);
      alert('押金缴纳成功！');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1>🎵 音乐排练室预约系统</h1>
        </div>
        <div className="header-right">
          <span className="user-info">
            👤 {currentUser.name}
            {hasDeposit && <span className="deposit-badge">✅ 已交押金</span>}
          </span>
          {userRole === 'user' && !hasDeposit && (
            <button className="btn-deposit" onClick={handleDepositPayment}>
              缴纳押金
            </button>
          )}
          <button className="btn-toggle-role" onClick={toggleRole}>
            切换为{userRole === 'user' ? '管理员' : '用户'}
          </button>
          <button
            className={\`btn-history \${showHistory ? 'active' : ''}\`}
            onClick={() => setShowHistory(!showHistory)}
          >
            我的预约
          </button>
        </div>
      </header>

      <BookingDraft
        draft={draft}
        onRestore={handleRestoreDraft}
        onClear={handleClearDraft}
      />

      <main className="app-main">
        {userRole === 'admin' ? (
          <AdminPanel
            equipmentList={equipmentList}
            onEquipmentUpdate={setEquipmentList}
            rooms={rooms}
            onRoomsUpdate={setRooms}
          />
        ) : (
          <>
            <aside className="sidebar">
              <RoomFilter
                filters={filters}
                onFilterChange={setFilters}
                equipmentList={equipmentList}
              />
            </aside>

            <section className="content">
              <div className="date-selector">
                <label>选择日期:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                />
              </div>

              <div className="rooms-grid">
                {filteredRooms.map(room => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    equipmentList={equipmentList}
                    onClick={() => handleRoomSelect(room)}
                    selected={selectedRoom?.id === room.id}
                  />
                ))}
              </div>

              {selectedRoom && !selectedRoom.isOutOfService && (
                <div className="time-slot-section">
                  <TimeSlotSelector
                    timeSlots={timeSlots}
                    selectedSlot={selectedSlot}
                    onSelect={handleSlotSelect}
                    hasDeposit={hasDeposit}
                  />
                </div>
              )}

              {showBookingForm && selectedRoom && selectedSlot && (
                <div className="booking-form-modal">
                  <div className="modal-overlay" onClick={() => setShowBookingForm(false)} />
                  <div className="modal-content">
                    <BookingForm
                      room={selectedRoom}
                      timeSlot={selectedSlot}
                      date={selectedDate}
                      equipmentList={equipmentList}
                      onSubmit={handleBookingSubmit}
                      onCancel={() => setShowBookingForm(false)}
                      onSaveDraft={handleSaveDraft}
                    />
                  </div>
                </div>
              )}
            </section>
          </>
        )}

        {showHistory && (
          <aside className="history-panel">
            <BookingHistory onRefresh={() => setRefreshKey(prev => prev + 1)} />
          </aside>
        )}
      </main>
    </div>
  );
};

export default App;
`,

  'src/index.css': `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: #333;
}

#root {
  min-height: 100vh;
}

button {
  cursor: pointer;
  border: none;
  outline: none;
  font-family: inherit;
}

input, select, textarea {
  font-family: inherit;
  outline: none;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
`,

  'src/App.css': `.app {
  min-height: 100vh;
  background: #f5f7fa;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left h1 {
  font-size: 24px;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.deposit-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.btn-deposit,
.btn-toggle-role,
.btn-history {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-deposit:hover,
.btn-toggle-role:hover,
.btn-history:hover,
.btn-history.active {
  background: rgba(255, 255, 255, 0.3);
}

.app-main {
  display: flex;
  padding: 24px;
  gap: 24px;
  max-width: 1600px;
  margin: 0 auto;
}

.sidebar {
  width: 280px;
  flex-shrink: 0;
}

.content {
  flex: 1;
  min-width: 0;
}

.history-panel {
  width: 380px;
  flex-shrink: 0;
}

.room-filter {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-header h3 {
  font-size: 18px;
  font-weight: 600;
}

.clear-btn {
  background: none;
  color: #667eea;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
}

.clear-btn:hover {
  background: #f0f2ff;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-section label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #555;
}

.filter-section input[type="date"],
.filter-section select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.filter-section input[type="date"]:focus,
.filter-section select:focus {
  border-color: #667eea;
}

.equipment-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.equipment-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.equipment-checkbox:hover {
  background: #f5f7fa;
}

.checkbox-label {
  display: flex !important;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.maintenance {
  background: #ffa500;
}

.status-dot.broken {
  background: #ff4444;
}

.date-selector {
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 12px;
}

.date-selector label {
  font-weight: 500;
  color: #555;
}

.date-selector input[type="date"] {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
}

.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.room-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.room-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.room-card.selected {
  border-color: #667eea;
}

.room-card.out-of-service {
  opacity: 0.7;
  cursor: not-allowed;
}

.room-image {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.room-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.out-of-service-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.out-of-service-overlay span {
  color: white;
  font-size: 18px;
  font-weight: 600;
  background: #ff4444;
  padding: 8px 24px;
  border-radius: 24px;
}

.room-info {
  padding: 16px;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.room-header h3 {
  font-size: 18px;
  font-weight: 600;
}

.room-price {
  color: #667eea;
  font-weight: 600;
  font-size: 16px;
}

.room-description {
  color: #666;
  font-size: 14px;
  margin-bottom: 12px;
  line-height: 1.5;
}

.room-meta {
  margin-bottom: 12px;
}

.capacity {
  font-size: 13px;
  color: #888;
}

.equipment-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.equipment-tag {
  background: #f0f2ff;
  color: #667eea;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
}

.equipment-tag.broken {
  background: #ffe5e5;
  color: #ff4444;
}

.equipment-tag.maintenance {
  background: #fff3e0;
  color: #ffa500;
}

.equipment-tag.more {
  background: #f0f0f0;
  color: #888;
}

.warning-box {
  background: #fffbf0;
  border-left: 4px solid #ffa500;
  padding: 8px 12px;
  border-radius: 4px;
}

.warning {
  font-size: 12px;
  margin: 2px 0;
}

.warning.broken {
  color: #ff4444;
}

.warning.maintenance {
  color: #ffa500;
}

.out-of-service-reason {
  margin-top: 8px;
  font-size: 12px;
  color: #ff4444;
  padding: 8px;
  background: #ffe5e5;
  border-radius: 4px;
}

.time-slot-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.time-slot-selector h4 {
  font-size: 18px;
  margin-bottom: 16px;
}

.deposit-warning {
  background: #fff3e0;
  border: 1px solid #ffa500;
  color: #e68a00;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
}

.time-slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.time-slot {
  background: #f8f9fa;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.time-slot:hover:not(.disabled) {
  border-color: #667eea;
  background: #f0f2ff;
}

.time-slot.selected {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.time-slot.peak {
  border-color: #ffa500;
}

.time-slot.peak.selected {
  background: linear-gradient(135deg, #ffa500, #ff8c00);
  border-color: #ff8c00;
}

.time-slot.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.slot-time {
  font-size: 14px;
  font-weight: 500;
}

.slot-price {
  font-size: 16px;
  font-weight: 600;
}

.peak-badge,
.booked-badge,
.lock-badge {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 8px;
}

.peak-badge {
  background: #fff3e0;
  color: #ffa500;
}

.time-slot.selected .peak-badge {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.booked-badge {
  background: #ffe5e5;
  color: #ff4444;
}

.lock-badge {
  background: #e0e0e0;
  color: #888;
}

.booking-draft {
  background: #fff9e6;
  border-bottom: 1px solid #ffe082;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.draft-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.draft-icon {
  font-size: 24px;
}

.draft-info h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 2px;
}

.draft-info p {
  font-size: 13px;
  color: #888;
}

.draft-actions {
  display: flex;
  gap: 8px;
}

.btn-restore {
  background: #667eea;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
}

.btn-clear {
  background: #e0e0e0;
  color: #555;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
}

.booking-form-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.booking-form h3 {
  font-size: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.booking-summary {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin