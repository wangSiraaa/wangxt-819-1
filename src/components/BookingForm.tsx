import { useState } from 'react'
import type { Room, TimeSlot, Booking } from '../types'
import { storage } from '../utils/storage'

interface BookingFormProps {
  room: Room | null
  timeSlot: TimeSlot | null
  date: string
  onSubmit: (booking: Booking) => void
  onSaveDraft: (booking: Booking) => void
}

export default function BookingForm({ room, timeSlot, date, onSubmit, onSaveDraft }: BookingFormProps) {
  const [bandName, setBandName] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [error, setError] = useState('')

  const currentUser = storage.getCurrentUser()
  const depositPaid = storage.checkDepositPaid(currentUser.id)

  const canSubmit = room && timeSlot && bandName && contactName && contactPhone
  const isGoldenHourBlocked = timeSlot?.isGoldenHour && !depositPaid

  const generateBooking = (): Booking => ({
    id: Date.now().toString(),
    roomId: room!.id,
    roomName: room!.name,
    date,
    timeSlotId: timeSlot!.id,
    timeSlotLabel: `${timeSlot!.startTime} - ${timeSlot!.endTime}`,
    bandName,
    contactName,
    contactPhone,
    userId: currentUser.id,
    status: 'draft',
    createdAt: new Date().toISOString(),
    isGoldenHour: timeSlot!.isGoldenHour
  })

  const handleSubmit = () => {
    if (!canSubmit) return
    
    if (isGoldenHourBlocked) {
      setError('黄金时段需缴纳押金后方可预约')
      return
    }

    const booking = generateBooking()
    booking.status = 'confirmed'
    onSubmit(booking)
    setError('')
  }

  const handleSaveDraft = () => {
    if (!room || !timeSlot) return
    const booking = generateBooking()
    onSaveDraft(booking)
  }

  return (
    <div className="booking-form">
      <h3>预约信息</h3>
      
      <div className="booking-summary">
        <div className="summary-item">
          <span className="label">排练室：</span>
          <span className="value">{room?.name || '未选择'}</span>
        </div>
        <div className="summary-item">
          <span className="label">日期：</span>
          <span className="value">{date}</span>
        </div>
        <div className="summary-item">
          <span className="label">时段：</span>
          <span className="value">
            {timeSlot ? `${timeSlot.startTime} - ${timeSlot.endTime}` : '未选择'}
            {timeSlot?.isGoldenHour && <span className="golden-tag">黄金时段</span>}
          </span>
        </div>
        {room && (
          <div className="summary-item">
            <span className="label">费用：</span>
            <span className="value price">¥{room.pricePerHour}</span>
          </div>
        )}
      </div>

      {isGoldenHourBlocked && (
        <div className="alert error">
          <span className="alert-icon">⚠️</span>
          您尚未缴纳押金，无法预约黄金时段（18:00-22:00）
        </div>
      )}

      {error && (
        <div className="alert error">
          <span className="alert-icon">❌</span>
          {error}
        </div>
      )}

      <div className="form-group">
        <label>乐队名称 *</label>
        <input
          type="text"
          value={bandName}
          onChange={(e) => setBandName(e.target.value)}
          placeholder="请输入乐队名称"
        />
      </div>

      <div className="form-group">
        <label>联系人 *</label>
        <input
          type="text"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          placeholder="请输入联系人姓名"
        />
      </div>

      <div className="form-group">
        <label>联系电话 *</label>
        <input
          type="tel"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          placeholder="请输入联系电话"
        />
      </div>

      <div className="form-actions">
        <button 
          className="btn btn-secondary"
          onClick={handleSaveDraft}
          disabled={!room || !timeSlot}
        >
          保存草稿
        </button>
        <button 
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!canSubmit || isGoldenHourBlocked}
        >
          确认预约
        </button>
      </div>
    </div>
  )
}
