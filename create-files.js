const fs = require('fs');
const path = require('path');

function mkdirp(dir) {
  if (!fs.existsSync(dir)) {
    mkdirp(path.dirname(dir));
    fs.mkdirSync(dir);
  }
}

function writeFile(filePath, content) {
  mkdirp(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
  console.log('Created ' + filePath + ' (' + content.length + ' bytes)');
}

// 1. src/types/index.ts
writeFile('src/types/index.ts', `export interface Equipment {
  id: string;
  name: string;
  category: '吉他' | '贝斯' | '鼓组' | '键盘' | '音箱' | '麦克风' | '其他';
  isFaulty: boolean;
  faultDescription?: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  capacity: number;
  pricePerHour: number;
  image: string;
  equipments: Equipment[];
  tags: string[];
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isGoldenHour: boolean;
  priceMultiplier: number;
}

export interface Booking {
  id: string;
  roomId: string;
  date: string;
  timeSlotId: string;
  bandName: string;
  contactPhone: string;
  status: 'draft' | 'confirmed' | 'cancelled';
  createdAt: string;
  isDepositPaid: boolean;
  notes?: string;
}

export interface DepositStatus {
  bandName: string;
  isPaid: boolean;
  amount: number;
  paidDate?: string;
  expiresAt?: string;
}

export type ViewMode = 'user' | 'admin';
`);

console.log('Done');
