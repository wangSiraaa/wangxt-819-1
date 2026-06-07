import type { TimeSlot } from '../types'

interface TimeSlotSelectorProps {
  slots: TimeSlot[]
  selectedSlot: TimeSlot | null
  onSelect: (slot: TimeSlot) => void
  depositPaid: boolean
}

export default function TimeSlotSelector({ slots, selectedSlot, onSelect, depositPaid }: TimeSlotSelectorProps) {
  return (
    <div className="time-slot-selector">
      <h3>选择时段</h3>
      <div className="time-slots-grid">
        {slots.map(slot => {
          const isDisabled = !slot.isAvailable || (slot.isGoldenHour && !depositPaid)
          const isSelected = selectedSlot?.id === slot.id
          
          return (
            <button
              key={slot.id}
              className={`time-slot ${slot.isGoldenHour ? 'golden' : ''} ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
              onClick={() => !isDisabled && onSelect(slot)}
              disabled={isDisabled}
              title={slot.isGoldenHour && !depositPaid ? '原因：您尚未缴纳押金，黄金时段（18:00-22:00）仅限已缴纳押金的用户预约' : ''}
            >
              <span className="time-range">{slot.startTime} - {slot.endTime}</span>
              {slot.isGoldenHour && <span className="golden-label">黄金时段</span>}
              {!slot.isAvailable && <span className="unavailable-label">已预约</span>}
              {slot.isGoldenHour && !depositPaid && (
                <span className="deposit-warning">押金未缴</span>
              )}
            </button>
          )
        })}
      </div>
      {!depositPaid && (
        <div className="deposit-notice">
          <span className="notice-icon">⚠️</span>
          <div className="notice-content">
            <p className="notice-title">您尚未缴纳押金</p>
            <p className="notice-desc">黄金时段（18:00-22:00）仅限已缴纳押金的用户预约。请联系管理员缴纳押金后再预约此时段。</p>
          </div>
        </div>
      )}
    </div>
  )
}
