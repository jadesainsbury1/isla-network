'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Message {
  id: string
  sender_role: string
  sender_name: string
  message: string
  created_at: string
}

interface Props {
  bookingId: string
  currentUserId: string
  currentUserRole: 'concierge' | 'venue'
  currentUserName: string
  notifyEmail: string
  notifyName: string
}

export default function BookingChat({ bookingId, currentUserId, currentUserRole, currentUserName, notifyEmail, notifyName }: Props) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [unread, setUnread] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!open) return
    // Load existing messages
    supabase.from('booking_messages')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setMessages(data || [])
        setUnread(0)
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      })

    // Subscribe to new messages
    const channel = supabase
      .channel('booking-' + bookingId)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'booking_messages',
        filter: 'booking_id=eq.' + bookingId
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message])
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [open, bookingId])

  // Count unread when closed
  useEffect(() => {
    if (open) return
    supabase.from('booking_messages')
      .select('id', { count: 'exact', head: true })
      .eq('booking_id', bookingId)
      .neq('sender_role', currentUserRole)
      .then(({ count }) => setUnread(count || 0))
  }, [open])

  async function send() {
    if (!input.trim()) return
    setSending(true)
    const msg = input.trim()
    setInput('')

    await fetch('/api/booking/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId,
        senderId: currentUserId,
        senderRole: currentUserRole,
        senderName: currentUserName,
        message: msg,
        notifyEmail,
        notifySubject: `New message from ${currentUserName} — ISLA`
      })
    })
    setSending(false)
  }

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          padding: '7px 14px', background: 'transparent', border: '1px solid #333',
          borderRadius: 4, fontSize: 11, color: '#aaa', cursor: 'pointer',
          fontFamily: 'monospace', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6
        }}
      >
        ✦ Message
        {unread > 0 && !open && (
          <span style={{ background: '#ef4444', color: '#fff', borderRadius: '50%', width: 16, height: 16, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{unread}</span>
        )}
      </button>

      {open && (
        <div style={{ marginTop: 12, background: '#0d0d0d', border: '1px solid #222', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.2em', color: '#C9A96E', textTransform: 'uppercase' }}>Booking chat · {notifyName}</span>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 16 }}>×</button>
          </div>

          <div style={{ height: 200, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {messages.length === 0 && (
              <div style={{ color: '#444', fontSize: 12, fontFamily: 'monospace', textAlign: 'center', marginTop: 60 }}>No messages yet. Start the conversation.</div>
            )}
            {messages.map(m => (
              <div key={m.id} style={{ alignSelf: m.sender_role === currentUserRole ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                <div style={{
                  background: m.sender_role === currentUserRole ? '#1a1500' : '#0d1a0d',
                  border: '1px solid ' + (m.sender_role === currentUserRole ? '#2a2000' : '#1a2a1a'),
                  borderRadius: 6, padding: '8px 12px'
                }}>
                  <div style={{ fontSize: 9, fontFamily: 'monospace', color: '#666', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {m.sender_name} · {new Date(m.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div style={{ fontSize: 13, color: '#f0ece4', lineHeight: 1.5 }}>{m.message}</div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding: '10px 14px', borderTop: '1px solid #1a1a1a', display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Type a message..."
              style={{ flex: 1, padding: '8px 12px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 4, color: '#fff', fontSize: 13 }}
            />
            <button
              onClick={send}
              disabled={sending || !input.trim()}
              style={{ padding: '8px 16px', background: '#C9A96E', color: '#000', border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'monospace', opacity: sending || !input.trim() ? 0.5 : 1 }}
            >
              {sending ? '...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
