"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface Message {
  id: string
  booking_id: string
  sender_id: string
  sender_name: string
  sender_role: string
  message: string
  created_at: string
}

interface Props {
  bookingId: string
  currentUserId: string
  currentUserName: string
  currentUserRole: string
  messages: Message[]
}

export default function BookingMessage({ bookingId, currentUserId, currentUserName, currentUserRole, messages: initial }: Props) {
  const [messages, setMessages] = useState<Message[]>(initial)
  const [text, setText] = useState("")
  const [sending, setSending] = useState(false)

  async function send() {
    if (!text.trim()) return
    setSending(true)
    const supabase = createClient()
    const { data } = await supabase.from("booking_messages").insert({
      booking_id: bookingId,
      sender_id: currentUserId,
      sender_name: currentUserName,
      sender_role: currentUserRole,
      message: text.trim()
    }).select().single()
    if (data) setMessages(prev => [...prev, data])
    setText("")
    setSending(false)
  }

  return (
    <div style={{ marginTop: 16, borderTop: "1px solid #222", paddingTop: 16 }}>
      <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.2em", color: "#555", textTransform: "uppercase", marginBottom: 12 }}>Messages</div>
      <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {messages.length === 0 && <div style={{ fontSize: 12, color: "#555" }}>No messages yet</div>}
        {messages.map(m => (
          <div key={m.id} style={{ display: "flex", flexDirection: m.sender_id === currentUserId ? "row-reverse" : "row", gap: 8, alignItems: "flex-start" }}>
            <div style={{ background: m.sender_id === currentUserId ? "#1a2a1a" : "#1a1a2a", border: `1px solid ${m.sender_id === currentUserId ? "#2a4a2a" : "#2a2a4a"}`, borderRadius: 6, padding: "8px 12px", maxWidth: "75%" }}>
              <div style={{ fontSize: 10, color: m.sender_id === currentUserId ? "#4ade80" : "#C9A96E", fontFamily: "monospace", marginBottom: 4 }}>{m.sender_name} · {m.sender_role}</div>
              <div style={{ fontSize: 13, color: "#f0ece4", lineHeight: 1.5 }}>{m.message}</div>
              <div style={{ fontSize: 10, color: "#444", marginTop: 4 }}>{new Date(m.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Type a message..."
          style={{ flex: 1, padding: "8px 12px", background: "#1a1a1a", border: "1px solid #333", borderRadius: 4, color: "#fff", fontSize: 13 }}
        />
        <button onClick={send} disabled={sending || !text.trim()} style={{ padding: "8px 16px", background: "#C9A96E", color: "#000", border: "none", borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "monospace", opacity: sending || !text.trim() ? 0.5 : 1 }}>
          Send
        </button>
      </div>
    </div>
  )
}
