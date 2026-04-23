'use client'
import { useState } from 'react'
import type { Booking, Venue } from '@/lib/types'
import LogBookingModal from '@/components/LogBookingModal'

interface Props {
  bookings: Booking[]
  venues: Venue[]
  conciergeId: string
  totals: { owed: number; confirmed: number; overdue: number }
}

const STATUS_BADGE: Record<string, string> = {
  pending: 'badge-pending',
  confirmed: 'badge-confirmed',
  paid: 'badge-paid',
  overdue: 'badge-overdue',
  rejected: 'badge-rejected',
}

function fmt(n: number) {
  return `€${n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

export default function RevenueClient({ bookings, venues, conciergeId, totals }: Props) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div className="topbar">
        <div className="page-title">My Revenue</div>
        <button className="btn btn-gold btn-sm" onClick={() => setShowModal(true)}>
          + Log Booking
        </button>
      </div>

      <div className="body">
        {/* Stats */}
        <div className="money-header">
          <div className="money-box">
            <span className="money-val gold">{fmt(totals.owed)}</span>
            <span className="money-label gold">Total owed</span>
          </div>
          <div className="money-box">
            <span className="money-val green">{fmt(totals.confirmed)}</span>
            <span className="money-label green">Confirmed</span>
          </div>
          <div className="money-box">
            <span className="money-val red">{fmt(totals.overdue)}</span>
            <span className="money-label red">Overdue</span>
          </div>
        </div>

        {/* Bookings table */}
        <div className="table-card">
          <div className="table-header">
            <span className="table-title">All Bookings</span>
            <span className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{bookings.length} total</span>
          </div>
          {bookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">💰</div>
              <div className="empty-state-title">No bookings yet</div>
              <div className="empty-state-sub">Log your first booking to start tracking commissions</div>
              <button className="btn btn-gold btn-sm" style={{ marginTop: 16 }} onClick={() => setShowModal(true)}>
                + Log First Booking
              </button>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Venue</th>
                  <th>Date</th>
                  <th>Covers</th>
                  <th>Commission</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td className="td-name">{(b.venue as Venue)?.name || '—'}</td>
                    <td className="td-mono td-muted">{new Date(b.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="td-mono">{b.covers || '—'}</td>
                    <td className="td-mono td-gold">{b.estimated_commission ? fmt(b.estimated_commission) : '—'}</td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[b.status] || ''}`}>{b.status}</span>
                    </td>
                    <td className="td-muted">{b.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <LogBookingModal
          venues={venues}
          conciergeId={conciergeId}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
