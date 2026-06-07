import type { GroupBy } from '../types';

interface GroupSelectorProps {
  groupBy: GroupBy;
  onGroupByChange: (groupBy: GroupBy) => void;
}

const groupOptions: { value: GroupBy; label: string }[] = [
  { value: 'type', label: '按类型' },
  { value: 'capacity', label: '按容量' },
  { value: 'price', label: '按价格' },
];

export default function GroupSelector({ groupBy, onGroupByChange }: GroupSelectorProps) {
  return (
    <div className="group-selector">
      <label>分组方式：</label>
      <div className="group-buttons">
        {groupOptions.map(option => (
          <button
            key={option.value}
            className={`group-btn ${groupBy === option.value ? 'active' : ''}`}
            onClick={() => onGroupByChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
