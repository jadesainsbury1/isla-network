'use client'
import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Doc {
  id: string
  name: string
  url: string
  type: string
  uploaded_at: string
}

interface Props {
  venueId: string
  userId: string
  initial: Doc[]
}

const DOC_TYPES = ['Menu', 'Bed Package', 'Rate Card', 'Floor Plan', 'Other']

export default function VenueDocuments({ venueId, userId, initial }: Props) {
  const [docs, setDocs] = useState<Doc[]>(initial)
  const [label, setLabel] = useState('Menu')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `docs/${userId}-${Date.now()}.${ext}`
    const { error: upErr } = await supabase.storage.from('bill-photos').upload(path, file, { upsert: true })
    if (upErr) { setError(upErr.message); setUploading(false); return }
    const { data } = supabase.storage.from('bill-photos').getPublicUrl(path)

    const newDoc: Doc = {
      id: Date.now().toString(),
      name: label,
      url: data.publicUrl,
      type: ext || 'pdf',
      uploaded_at: new Date().toISOString(),
    }

    const updated = [...docs, newDoc]
    setDocs(updated)
    await persist(updated)
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleDelete(id: string) {
    const updated = docs.filter(d => d.id !== id)
    setDocs(updated)
    await persist(updated)
  }

  async function persist(updated: Doc[]) {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('venues').update({ documents: updated }).eq('id', venueId)
    setSaving(false)
  }

  const isPdf = (url: string) => url.toLowerCase().includes('.pdf')

  return (
    <div>
      {/* Upload row */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <select
          value={label}
          onChange={e => setLabel(e.target.value)}
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 12px', color: 'var(--text)', fontSize: 12, fontFamily: 'inherit' }}
        >
          {DOC_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="btn btn-gold"
          disabled={uploading}
          style={{ fontSize: 11, padding: '8px 16px' }}
        >
          {uploading ? 'Uploading...' : '+ Upload Document'}
        </button>
        {saving && <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'monospace' }}>Saving...</span>}
        <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" style={{ display: 'none' }} onChange={handleUpload} />
      </div>

      {error && <div style={{ fontSize: 12, color: '#f44336', marginBottom: 12 }}>{error}</div>}

      {docs.length === 0 && (
        <div style={{ fontSize: 12, color: 'var(--muted)', padding: '16px 0' }}>No documents uploaded yet. Add menus, rate cards, or bed packages for concierges to download.</div>
      )}

      {docs.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {docs.map(doc => (
            <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 18 }}>{isPdf(doc.url) ? '📄' : '🖼'}</span>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--cream)', fontWeight: 500 }}>{doc.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'monospace' }}>{doc.type.toUpperCase()} · {new Date(doc.uploaded_at).toLocaleDateString('en-GB')}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: 'var(--gold)', fontFamily: 'monospace', textDecoration: 'none' }}>View ↗</a>
                <button type="button" onClick={() => handleDelete(doc.id)} style={{ fontSize: 11, color: '#f44336', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'monospace', padding: 0 }}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
