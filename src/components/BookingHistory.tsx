import type { Booking } from '../types'

interface BookingHistoryProps {
  bookings: Booking[]
}

export default function BookingHistory({ bookings }: BookingHistoryProps) {
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="booking-history">
      <h3>我的预约</h3>
      {confirmedBookings.length === 0 ? (
        <p className="empty-text">暂无预约记录</p>
      ) : (
        <div className="history-list">
          {confirmedBookings.map(booking => (
            <div key={booking.id} className="history-item">
              <div className="history-main">
                <p className="history-room">{booking.roomName}</p>
                <p className="history-time">
                  {booking.date} {booking.timeSlotLabel}
                  {booking.isGoldenHour && <span className="golden-tag">黄金时段</span>}
                </p>
                <p className="history-band">乐队：{booking.bandName}</p>
              </div>
              <div className="history-status">
                <span className={`status status-${booking.status}`}>
                  {booking.status === 'confirmed' ? '已确认' : booking.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
