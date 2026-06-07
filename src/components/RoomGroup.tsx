import { useState } from 'react';
import type { Room } from '../types';
import RoomCard from './RoomCard';

interface RoomGroupProps {
  groupName: string;
  rooms: Room[];
  selectedRoomId: string | null;
  onRoomSelect: (room: Room) => void;
  defaultExpanded?: boolean;
}

export default function RoomGroup({ 
  groupName, 
  rooms, 
  selectedRoomId, 
  onRoomSelect,
  defaultExpanded = true 
}: RoomGroupProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="room-group">
      <button 
        className="group-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="group-title">
          <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>▶</span>
          <h3>{groupName}</h3>
          <span className="group-count">{rooms.length} 间</span>
        </div>
      </button>
      
      {isExpanded && (
        <div className="group-content">
          <div className="rooms-grid">
            {rooms.map(room => (
              <RoomCard
                key={room.id}
                room={room}
                onSelect={onRoomSelect}
                isSelected={selectedRoomId === room.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
