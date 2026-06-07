import type { FilterOptions, Room } from '../types'

interface RoomFilterProps {
  filters: FilterOptions
  onFilterChange: (filters: FilterOptions) => void
  rooms: Room[]
}

export default function RoomFilter({ filters, onFilterChange, rooms }: RoomFilterProps) {
  const allEquipments = [...new Set(rooms.flatMap(r => r.equipments.map(e => e.name)))]
  const maxPrice = Math.max(...rooms.map(r => r.pricePerHour))

  const handleEquipmentToggle = (equipment: string) => {
    const newEquipments = filters.equipments.includes(equipment)
      ? filters.equipments.filter(e => e !== equipment)
      : [...filters.equipments, equipment]
    onFilterChange({ ...filters, equipments: newEquipments })
  }

  const handleCapacityChange = (capacity: number | null) => {
    onFilterChange({ ...filters, capacity })
  }

  const handlePriceChange = (range: [number, number] | null) => {
    onFilterChange({ ...filters, priceRange: range })
  }

  const resetFilters = () => {
    onFilterChange({
      capacity: null,
      equipments: [],
      priceRange: null
    })
  }

  return (
    <div className="room-filter">
      <div className="filter-header">
        <h3>筛选条件</h3>
        <button className="reset-btn" onClick={resetFilters}>重置</button>
      </div>
      
      <div className="filter-section">
        <label>容纳人数</label>
        <select 
          value={filters.capacity ?? ''}
          onChange={(e) => handleCapacityChange(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">不限</option>
          <option value="4">4人及以上</option>
          <option value="6">6人及以上</option>
          <option value="8">8人及以上</option>
          <option value="10">10人及以上</option>
        </select>
      </div>

      <div className="filter-section">
        <label>价格范围（元/小时）</label>
        <div className="price-range">
          <input
            type="range"
            min="0"
            max={maxPrice}
            value={filters.priceRange?.[1] ?? maxPrice}
            onChange={(e) => handlePriceChange([0, Number(e.target.value)])}
          />
          <span>¥0 - ¥{filters.priceRange?.[1] ?? maxPrice}</span>
        </div>
      </div>

      <div className="filter-section">
        <label>设备需求</label>
        <div className="equipment-checkboxes">
          {allEquipments.map(eq => (
            <label key={eq} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.equipments.includes(eq)}
                onChange={() => handleEquipmentToggle(eq)}
              />
              <span>{eq}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
