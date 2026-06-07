export interface Equipment {
  id: string;
  name: string;
  category: string;
  isFaulty: boolean;
  faultDescription?: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  area: number;
  pricePerHour: number;
  image: string;
  equipments: Equipment[];
  description: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isGoldenHour: boolean;
  isAvailable: boolean;
}

export interface Deposit {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  isPaid: boolean;
  paidAt?: string;
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  date: string;
  timeSlotId: string;
  timeSlotLabel: string;
  bandName: string;
  contactName: string;
  contactPhone: string;
  userId: string;
  status: 'draft' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  isGoldenHour: boolean;
}

export interface FilterOptions {
  capacity: number | null;
  equipments: string[];
  priceRange: [number, number] | null;
}

export type UserRole = 'member' | 'admin';
