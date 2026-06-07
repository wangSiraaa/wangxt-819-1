const fs = require('fs');
const path = require('path');

const files = {
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
    bookedSlots.add(hour + ':00');
  }

  for (let hour = 9; hour <= 22; hour++) {
    const startTime = hour.toString().padStart(2, '0') + ':00';
    const endTime = (hour + 1).toString().padStart(2, '0') + ':00';
    const isPeak = hour >= 18 && hour <= 21;
    const basePrice = mockRooms.find(r => r.id === roomId)?.basePrice || 100;
    
    slots.push({
      id: roomId + '-' + date + '-' + hour,
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
};

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content);
  console.log('Created: ' + filePath);
});

console.log('Part 1 completed!');
