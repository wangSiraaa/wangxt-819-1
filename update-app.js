const fs = require('fs');
const path = require('path');

const newAppContent = `import { useState, useEffect, useMemo } from 'react'
import type { Room, TimeSlot, Booking, FilterOptions, Deposit, GroupBy } from './types'
import { storage } from './utils/storage'
import { generateTimeSlots } from './data/mockData'
import RoomCard from './components/RoomCard'
import RoomFilter from './components/RoomFilter'
import TimeSlotSelector from './components/TimeSlotSelector'
import BookingForm from './components/BookingForm'
import BookingDraft from './components/BookingDraft'
import BookingHistory from './components/BookingHistory'
import AdminPanel from './components/AdminPanel'
import RoomGroup from './components/RoomGroup'
import GroupSelector from './components/GroupSelector'
import './App.css'

function App() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [draft, setDraft] = useState<Booking | null>(null)
  
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  
  const [filters, setFilters] = useState<FilterOptions>({
    capacity: null,
    equipments: [],
    priceRange: null
  })
  
  const [groupBy, setGroupBy] = useState<GroupBy>('type')
  
  const [viewMode, setViewMode] = useState<'member' | 'admin'>('member')
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const currentUser = storage.getCurrentUser()
  const depositPaid = storage.checkDepositPaid(currentUser.id)

  useEffect(() => {
    setRooms(storage.getRooms())
    setBookings(storage.getBookings())
    setDeposits(storage.getDeposits())
    setDraft(storage.getDraft())
  }, [])

  useEffect(() => {
    setTimeSlots(generateTimeSlots(selectedDate))
    setSelectedSlot(null)
  }, [selectedDate, selectedRoom])

  const filteredRooms = rooms.filter(room => {
    if (filters.capacity && room.capacity < filters.capacity) return false
    if (filters.priceRange && room.pricePerHour > filters.priceRange[1]) return false
    if (filters.equipments.length > 0) {
      const roomEquipmentNames = room.equipments.map(e => e.name)
      return filters.equipments.every(eq => roomEquipmentNames.includes(eq))
    }
    return true
  })

  const roomGroups = useMemo(() => {
    return groupRooms(filteredRooms, groupBy)
  }, [filteredRooms, groupBy])

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room)
    setSelectedSlot(null)
  }

  const handleBookingSubmit = (booking: Booking) => {
    const newBookings = [...bookings, booking]
    setBookings(newBookings)
    storage.addBooking(booking)
    
    const updatedSlots = timeSlots.map(slot => 
      slot.id === booking.timeSlotId ? { ...slot, isAvailable: false } : slot
    )
    setTimeSlots(updatedSlots)
    
    setSelectedSlot(null)
    setSuccessMessage('预约成功！')
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleSaveDraft = (booking: Booking) => {
    setDraft(booking)
    storage.saveDraft(booking)
    setSuccessMessage('草稿已保存！')
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleLoadDraft = (draftBooking: Booking) => {
    const room = rooms.find(r => r.id === draftBooking.roomId)
    if (room) {
      setSelectedRoom(room)
      setSelectedDate(draftBooking.date)
      const slot = timeSlots.find(s => s.id === draftBooking.timeSlotId)
      if (slot) setSelectedSlot(slot)
    }
    setSuccessMessage('草稿已加载！')
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleClearDraft = () => {
    setDraft(null)
    storage.clearDraft()
  }

  const toggleRole = () => {
    const newRole = viewMode === 'member' ? 'admin' : 'member'
    setViewMode(newRole)
    storage.setCurrentUser({ ...currentUser, role: newRole })
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🎸 音乐排练室预约墙</h1>
          <div className="header-actions">
            <div className="user-info">
              <span>欢迎，{currentUser.name}</span>
              <span className={`deposit-status ${depositPaid ? 'paid' : 'unpaid'}`}>
                押金：{depositPaid ? '已缴纳' : '未缴纳'}
              </span>
            </div>
            <button className="role-toggle" onClick={toggleRole}>
              切换到{viewMode === 'member' ? '管理员' : '用户'}模式
            </button>
          </div>
        </div>
      </header>

      {showSuccess && (
        <div className="toast success">
          <span>✅</span>
          {successMessage}
        </div>
      )}

      <main className="main">
        {viewMode === 'member' ? (
          <div className="member-view">
            <div className="sidebar">
              <RoomFilter 
                filters={filters} 
                onFilterChange={setFilters} 
                rooms={rooms}
              />
              <BookingDraft 
                draft={draft}
                onLoad={handleLoadDraft}
                onClear={handleClearDraft}
              />
              <BookingHistory bookings={bookings} />
            </div>
            
            <div className="content">
              <div className="date-selector">
                <label>选择日期：</label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="rooms-toolbar">
                <GroupSelector groupBy={groupBy} onGroupByChange={setGroupBy} />
              </div>

              <div className="room-groups">
                {roomGroups.map(group => (
                  <RoomGroup
                    key={group.id}
                    groupName={group.name}
                    rooms={group.rooms}
                    selectedRoomId={selectedRoom?.id || null}
                    onRoomSelect={handleRoomSelect}
                    defaultExpanded={true}
                  />
                ))}
              </div>

              {selectedRoom && (
                <div className="booking-section">
                  <TimeSlotSelector
                    slots={timeSlots}
                    selectedSlot={selectedSlot}
                    onSelect={setSelectedSlot}
                    depositPaid={depositPaid}
                  />
                  
                  <BookingForm
                    room={selectedRoom}
                    timeSlot={selectedSlot}
                    date={selectedDate}
                    onSubmit={handleBookingSubmit}
                    onSaveDraft={handleSaveDraft}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <AdminPanel
            rooms={rooms}
            deposits={deposits}
            onRoomsChange={setRooms}
            onDepositsChange={setDeposits}
          />
        )}
      </main>

      <footer className="footer">
        <p>音乐排练室预约系统 © 2024</p>
      </footer>
    </div>
  )
}

function groupRooms(rooms: Room[], groupBy: GroupBy) {
  switch (groupBy) {
    case 'type':
      return groupByType(rooms)
    case 'capacity':
      return groupByCapacity(rooms)
    case 'price':
      return groupByPrice(rooms)
    default:
      return [{ id: 'all', name: '全部排练室', rooms }]
  }
}

function groupByType(rooms: Room[]) {
  const groups: Record<string, Room[]> = {
    '摇滚排练室': [],
    '流行排练室': [],
    '小型练习室': [],
    '专业录音棚': [],
    '其他': [],
  }

  rooms.forEach((room) => {
    if (room.name.includes('摇滚')) {
      groups['摇滚排练室'].push(room)
    } else if (room.name.includes('流行')) {
      groups['流行排练室'].push(room)
    } else if (room.name.includes('小型') || room.name.includes('练习')) {
      groups['小型练习室'].push(room)
    } else if (room.name.includes('录音') || room.name.includes('专业')) {
      groups['专业录音棚'].push(room)
    } else {
      groups['其他'].push(room)
    }
  })

  return Object.entries(groups)
    .filter(([_, rooms]) => rooms.length > 0)
    .map(([name, rooms]) => ({
      id: name,
      name,
      rooms,
    }))
}

function groupByCapacity(rooms: Room[]) {
  const groups: Record<string, Room[]> = {
    '小型 (1-4人)': [],
    '中型 (5-8人)': [],
    '大型 (9人以上)': [],
  }

  rooms.forEach((room) => {
    if (room.capacity <= 4) {
      groups['小型 (1-4人)'].push(room)
    } else if (room.capacity <= 8) {
      groups['中型 (5-8人)'].push(room)
    } else {
      groups['大型 (9人以上)'].push(room)
    }
  })

  return Object.entries(groups)
    .filter(([_, rooms]) => rooms.length > 0)
    .map(([name, rooms]) => ({
      id: name,
      name,
      rooms,
    }))
}

function groupByPrice(rooms: Room[]) {
  const groups: Record<string, Room[]> = {
    '经济型 (¥100以下)': [],
    '标准型 (¥100-200)': [],
    '高端型 (¥200以上)': [],
  }

  rooms.forEach((room) => {
    if (room.pricePerHour < 100) {
      groups['经济型 (¥100以下)'].push(room)
    } else if (room.pricePerHour <= 200) {
      groups['标准型 (¥100-200)'].push(room)
    } else {
      groups['高端型 (¥200以上)'].push(room)
    }
  })

  return Object.entries(groups)
    .filter(([_, rooms]) => rooms.length > 0)
    .map(([name, rooms]) => ({
      id: name,
      name,
      rooms,
    }))
}

export default App
`;

const appPath = path.join(__dirname, 'src/App.tsx');
fs.writeFileSync(appPath, newAppContent);
console.log('Updated: src/App.tsx');
