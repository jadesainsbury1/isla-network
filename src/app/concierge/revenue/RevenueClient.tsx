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
              <div style={{fontFamily:"monospace",fontSize:10,letterSpacing:"0.3em",color:"var(--gold)",marginBottom:16}}>ISLA · REVENUE TRACKER</div>
              <div className="empty-state-title">Your commission dashboard starts here.</div>
              <div className="empty-state-sub">Every euro you refer — tracked, confirmed, chased automatically. Log your first booking in 10 seconds.</div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
                <button className="btn btn-gold btn-sm" onClick={() => setShowModal(true)}>+ Log First Booking</button>
                <a href="/demo" style={{ padding: '8px 20px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13, color: 'var(--muted)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>See How It Works →</a>
              </div>
              <div style={{ marginTop: 28, padding: '16px 20px', background: 'var(--surface)', borderRadius: 8, maxWidth: 400, margin: '24px auto 0' }}>
                <div style={{ fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.1em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 10 }}>What you'll see here</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text)', marginBottom: 6 }}><span>Total commissions owed</span><span style={{ color: 'var(--gold)' }}>€0</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text)', marginBottom: 6 }}><span>Confirmed & paid</span><span style={{ color: 'var(--green)' }}>€0</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text)' }}><span>Overdue — chase now</span><span style={{ color: 'var(--red)' }}>€0</span></div>
              </div>
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
