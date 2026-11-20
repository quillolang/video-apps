import { useState } from 'react'

function BioField({ bio, onChange }) {
  return <input value={bio} onChange={(e) => onChange(e.target.value)} placeholder="Your bio" />
}

export default function ProfileFixed() {
  const [bio, setBio] = useState('')

  return (
    <main>
      <h1>Profile</h1>
      <BioField bio={bio} onChange={setBio} />
      <p>{bio.length} of 80 letters</p>
    </main>
  )
}
