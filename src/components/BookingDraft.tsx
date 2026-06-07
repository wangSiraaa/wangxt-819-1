import type { Booking } from '../types'

interface BookingDraftProps {
  draft: Booking | null
  onLoad: (draft: Booking) => void
  onClear: () => void
}

export default function BookingDraft({ draft, onLoad, onClear }: BookingDraftProps) {
  if (!draft) {
    return (
      <div className="booking-draft empty">
        <h3>预约草稿</h3>
        <p className="empty-text">暂无保存的草稿</p>
      </div>
    )
  }

  return (
    <div className="booking-draft">
      <h3>预约草稿</h3>
      <div className="draft-card">
        <div className="draft-info">
          <p><strong>{draft.roomName}</strong></p>
          <p>{draft.date} {draft.timeSlotLabel}</p>
          <p>乐队：{draft.bandName || '未填写'}</p>
          <p className="draft-time">保存于 {new Date(draft.createdAt).toLocaleString()}</p>
        </div>
        <div className="draft-actions">
          <button className="btn btn-sm btn-primary" onClick={() => onLoad(draft)}>
            加载
          </button>
          <button className="btn btn-sm btn-secondary" onClick={onClear}>
            删除
          </button>
        </div>
      </div>
    </div>
  )
}
