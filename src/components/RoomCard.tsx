import type { Room } from '../types'

interface RoomCardProps {
  room: Room
  onSelect: (room: Room) => void
  isSelected: boolean
}

export default function RoomCard({ room, onSelect, isSelected }: RoomCardProps) {
  const faultyEquipments = room.equipments.filter(e => e.isFaulty)
  const hasFaulty = faultyEquipments.length > 0

  return (
    <div 
      className={`room-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(room)}
    >
      <div className="room-image">
        <img src={room.image} alt={room.name} />
        {hasFaulty && (
          <div className="fault-badge">
            <span className="fault-icon">⚠️</span>
            设备故障
          </div>
        )}
      </div>
      <div className="room-info">
        <h3>{room.name}</h3>
        <p className="room-description">{room.description}</p>
        <div className="room-meta">
          <span>容纳 {room.capacity} 人</span>
          <span>{room.area}㎡</span>
          <span className="price">¥{room.pricePerHour}/小时</span>
        </div>
        <div className="equipment-tags">
          {room.equipments.map(eq => (
            <span 
              key={eq.id} 
              className={`tag ${eq.isFaulty ? 'faulty' : ''}`}
              title={eq.isFaulty ? eq.faultDescription : eq.category}
            >
              {eq.name}
              {eq.isFaulty && <span className="fault-mark"> (故障)</span>}
            </span>
          ))}
        </div>
        {hasFaulty && (
          <div className="fault-list">
            <p className="fault-title">故障设备提示：</p>
            <ul>
              {faultyEquipments.map(eq => (
                <li key={eq.id}>
                  <span className="fault-name">{eq.name}</span>
                  <span className="fault-desc">{eq.faultDescription}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
