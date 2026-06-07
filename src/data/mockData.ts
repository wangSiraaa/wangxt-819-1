import type { Room, TimeSlot, Deposit, Booking, Equipment } from '../types'

export const mockEquipments: Equipment[] = [
  { id: 'eq1', name: '电吉他', category: '乐器', isFaulty: false },
  { id: 'eq2', name: '贝斯', category: '乐器', isFaulty: false },
  { id: 'eq3', name: '架子鼓', category: '乐器', isFaulty: true, faultDescription: '踩锤弹簧损坏' },
  { id: 'eq4', name: '键盘', category: '乐器', isFaulty: false },
  { id: 'eq5', name: '音箱', category: '音响', isFaulty: false },
  { id: 'eq6', name: '调音台', category: '音响', isFaulty: false },
  { id: 'eq7', name: '麦克风', category: '音响', isFaulty: true, faultDescription: '收音不清晰' },
  { id: 'eq8', name: '吉他效果器', category: '配件', isFaulty: false },
]

export const mockRooms: Room[] = [
  {
    id: 'room1',
    name: '摇滚排练室 A',
    capacity: 6,
    area: 40,
    pricePerHour: 120,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20music%20rehearsal%20studio%20with%20drums%20guitars%20and%20speakers%20professional%20equipment&image_size=landscape_16_9',
    equipments: [mockEquipments[0], mockEquipments[1], mockEquipments[2], mockEquipments[4], mockEquipments[6]],
    description: '配备完整摇滚乐队设备，适合重型音乐排练'
  },
  {
    id: 'room2',
    name: '流行排练室 B',
    capacity: 8,
    area: 50,
    pricePerHour: 150,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=bright%20spacious%20music%20rehearsal%20room%20with%20keyboard%20and%20modern%20lighting&image_size=landscape_16_9',
    equipments: [mockEquipments[0], mockEquipments[1], mockEquipments[3], mockEquipments[4], mockEquipments[5], mockEquipments[7]],
    description: '宽敞明亮，适合流行和爵士乐队排练'
  },
  {
    id: 'room3',
    name: '小型工作室 C',
    capacity: 4,
    area: 25,
    pricePerHour: 80,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cozy%20small%20music%20studio%20with%20acoustic%20treatment%20and%20basic%20equipment&image_size=landscape_16_9',
    equipments: [mockEquipments[3], mockEquipments[4], mockEquipments[5]],
    description: '适合小编制乐队和个人练习'
  },
  {
    id: 'room4',
    name: '专业录音棚 D',
    capacity: 10,
    area: 80,
    pricePerHour: 300,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20recording%20studio%20with%20sound%20isolation%20and%20high%20end%20equipment&image_size=landscape_16_9',
    equipments: [mockEquipments[0], mockEquipments[1], mockEquipments[2], mockEquipments[3], mockEquipments[4], mockEquipments[5], mockEquipments[6], mockEquipments[7]],
    description: '专业级隔音和设备，支持录音和正式演出排练'
  }
]

export const generateTimeSlots = (date: string): TimeSlot[] => {
  const slots: TimeSlot[] = []
  const goldenHours = ['18:00', '19:00', '20:00', '21:00']
  
  for (let hour = 9; hour <= 22; hour++) {
    const startTime = `${hour.toString().padStart(2, '0')}:00`
    const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`
    const isGoldenHour = goldenHours.includes(startTime)
    
    slots.push({
      id: `${date}-${hour}`,
      startTime,
      endTime,
      isGoldenHour,
      isAvailable: Math.random() > 0.3
    })
  }
  
  return slots
}

export const mockDeposits: Deposit[] = [
  {
    id: 'dep1',
    userId: 'user1',
    userName: '张三',
    amount: 500,
    isPaid: true,
    paidAt: '2024-01-15'
  },
  {
    id: 'dep2',
    userId: 'user2',
    userName: '李四',
    amount: 500,
    isPaid: false
  }
]

export const mockBookings: Booking[] = []
