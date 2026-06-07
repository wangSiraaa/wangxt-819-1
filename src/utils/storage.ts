import type { Booking, Deposit, Room } from '../types'
import { mockRooms, mockDeposits, mockBookings } from '../data/mockData'

const STORAGE_KEYS = {
  ROOMS: 'booking_rooms',
  BOOKINGS: 'booking_records',
  DEPOSITS: 'booking_deposits',
  DRAFT: 'booking_draft',
  CURRENT_USER: 'booking_current_user',
  FAULTY_EQUIPMENT: 'booking_faulty_equipment'
}

export const storage = {
  getRooms(): Room[] {
    const data = localStorage.getItem(STORAGE_KEYS.ROOMS)
    if (data) {
      return JSON.parse(data)
    }
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(mockRooms))
    return mockRooms
  },

  saveRooms(rooms: Room[]) {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms))
  },

  getBookings(): Booking[] {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS)
    if (data) {
      return JSON.parse(data)
    }
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(mockBookings))
    return mockBookings
  },

  saveBookings(bookings: Booking[]) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings))
  },

  addBooking(booking: Booking) {
    const bookings = this.getBookings()
    bookings.push(booking)
    this.saveBookings(bookings)
  },

  getDeposits(): Deposit[] {
    const data = localStorage.getItem(STORAGE_KEYS.DEPOSITS)
    if (data) {
      return JSON.parse(data)
    }
    localStorage.setItem(STORAGE_KEYS.DEPOSITS, JSON.stringify(mockDeposits))
    return mockDeposits
  },

  saveDeposits(deposits: Deposit[]) {
    localStorage.setItem(STORAGE_KEYS.DEPOSITS, JSON.stringify(deposits))
  },

  getCurrentUserId(): string {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
    if (user) {
      return JSON.parse(user).id
    }
    const defaultUser = { id: 'user1', name: '张三', role: 'member' }
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(defaultUser))
    return defaultUser.id
  },

  setCurrentUser(user: { id: string; name: string; role: string }) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
  },

  getCurrentUser() {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
    if (user) {
      return JSON.parse(user)
    }
    const defaultUser = { id: 'user1', name: '张三', role: 'member' }
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(defaultUser))
    return defaultUser
  },

  getDraft(): Booking | null {
    const data = localStorage.getItem(STORAGE_KEYS.DRAFT)
    return data ? JSON.parse(data) : null
  },

  saveDraft(draft: Booking) {
    localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(draft))
  },

  clearDraft() {
    localStorage.removeItem(STORAGE_KEYS.DRAFT)
  },

  updateEquipmentFault(roomId: string, equipmentId: string, isFaulty: boolean, faultDescription?: string) {
    const rooms = this.getRooms()
    const room = rooms.find(r => r.id === roomId)
    if (room) {
      const equipment = room.equipments.find(e => e.id === equipmentId)
      if (equipment) {
        equipment.isFaulty = isFaulty
        equipment.faultDescription = faultDescription
        this.saveRooms(rooms)
      }
    }
  },

  checkDepositPaid(userId: string): boolean {
    const deposits = this.getDeposits()
    const deposit = deposits.find(d => d.userId === userId)
    return deposit?.isPaid ?? false
  }
}
