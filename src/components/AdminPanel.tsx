import { useState } from 'react'
import type { Room, Deposit, Equipment } from '../types'
import { storage } from '../utils/storage'

interface AdminPanelProps {
  rooms: Room[]
  deposits: Deposit[]
  onRoomsChange: (rooms: Room[]) => void
  onDepositsChange: (deposits: Deposit[]) => void
}

export default function AdminPanel({ rooms, deposits, onRoomsChange, onDepositsChange }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'timeSlots' | 'deposits' | 'equipment'>('timeSlots')
  const [selectedRoom, setSelectedRoom] = useState<string>(rooms[0]?.id || '')

  const currentRoom = rooms.find(r => r.id === selectedRoom)

  const toggleEquipmentFault = (equipmentId: string) => {
    const updatedRooms = rooms.map(room => {
      if (room.id === selectedRoom) {
        return {
          ...room,
          equipments: room.equipments.map((eq: Equipment) => {
            if (eq.id === equipmentId) {
              return {
                ...eq,
                isFaulty: !eq.isFaulty,
                faultDescription: !eq.isFaulty ? '待维修' : undefined
              }
            }
            return eq
          })
        }
      }
      return room
    })
    onRoomsChange(updatedRooms)
    storage.saveRooms(updatedRooms)
  }

  const updateEquipmentFaultDescription = (equipmentId: string, description: string) => {
    const updatedRooms = rooms.map(room => {
      if (room.id === selectedRoom) {
        return {
          ...room,
          equipments: room.equipments.map((eq: Equipment) => {
            if (eq.id === equipmentId) {
              return { ...eq, faultDescription: description }
            }
            return eq
          })
        }
      }
      return room
    })
    onRoomsChange(updatedRooms)
    storage.saveRooms(updatedRooms)
  }

  const toggleDepositPaid = (depositId: string) => {
    const updatedDeposits = deposits.map(d => {
      if (d.id === depositId) {
        return {
          ...d,
          isPaid: !d.isPaid,
          paidAt: !d.isPaid ? new Date().toISOString().split('T')[0] : undefined
        }
      }
      return d
    })
    onDepositsChange(updatedDeposits)
    storage.saveDeposits(updatedDeposits)
  }

  return (
    <div className="admin-panel">
      <h2>场地管理员面板</h2>
      
      <div className="admin-tabs">
        <button 
          className={`tab ${activeTab === 'timeSlots' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeSlots')}
        >
          时段管理
        </button>
        <button 
          className={`tab ${activeTab === 'deposits' ? 'active' : ''}`}
          onClick={() => setActiveTab('deposits')}
        >
          押金管理
        </button>
        <button 
          className={`tab ${activeTab === 'equipment' ? 'active' : ''}`}
          onClick={() => setActiveTab('equipment')}
        >
          设备管理
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'timeSlots' && (
          <div className="time-slot-management">
            <h3>时段配置</h3>
            <p className="info-text">黄金时段：18:00 - 22:00（需缴纳押金后方可预约）</p>
            <p className="info-text">普通时段：09:00 - 18:00（所有用户均可预约）</p>
            <div className="time-slot-config">
              <div className="slot-type">
                <h4>普通时段</h4>
                <p>09:00 - 18:00</p>
                <span className="slot-count">共 9 个时段</span>
              </div>
              <div className="slot-type golden">
                <h4>黄金时段</h4>
                <p>18:00 - 22:00</p>
                <span className="slot-count">共 4 个时段</span>
                <span className="deposit-required">需缴押金</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'deposits' && (
          <div className="deposit-management">
            <h3>押金管理</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>用户</th>
                  <th>押金金额</th>
                  <th>缴纳状态</th>
                  <th>缴纳时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {deposits.map(deposit => (
                  <tr key={deposit.id}>
                    <td>{deposit.userName}</td>
                    <td>¥{deposit.amount}</td>
                    <td>
                      <span className={`status ${deposit.isPaid ? 'paid' : 'unpaid'}`}>
                        {deposit.isPaid ? '已缴纳' : '未缴纳'}
                      </span>
                    </td>
                    <td>{deposit.paidAt || '-'}</td>
                    <td>
                      <button 
                        className="btn btn-sm"
                        onClick={() => toggleDepositPaid(deposit.id)}
                      >
                        {deposit.isPaid ? '标记未缴' : '标记已缴'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="equipment-management">
            <h3>故障设备管理</h3>
            <div className="room-selector">
              <label>选择排练室：</label>
              <select 
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
              >
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>{room.name}</option>
                ))}
              </select>
            </div>
            {currentRoom && (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>设备名称</th>
                    <th>类别</th>
                    <th>状态</th>
                    <th>故障描述</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRoom.equipments.map((eq: Equipment) => (
                    <tr key={eq.id} className={eq.isFaulty ? 'faulty-row' : ''}>
                      <td>{eq.name}</td>
                      <td>{eq.category}</td>
                      <td>
                        <span className={`status ${eq.isFaulty ? 'faulty' : 'normal'}`}>
                          {eq.isFaulty ? '故障' : '正常'}
                        </span>
                      </td>
                      <td>
                        {eq.isFaulty ? (
                          <input
                            type="text"
                            value={eq.faultDescription || ''}
                            onChange={(e) => updateEquipmentFaultDescription(eq.id, e.target.value)}
                            placeholder="输入故障描述"
                          />
                        ) : '-'}
                      </td>
                      <td>
                        <button 
                          className={`btn btn-sm ${eq.isFaulty ? 'btn-success' : 'btn-warning'}`}
                          onClick={() => toggleEquipmentFault(eq.id)}
                        >
                          {eq.isFaulty ? '标记正常' : '标记故障'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
