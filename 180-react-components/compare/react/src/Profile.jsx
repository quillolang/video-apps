import { useState } from 'react'

export default function Profile() {
  const [bio, setBio] = useState('')

  function BioField() {
    return <input value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Your bio" />
  }

  return (
    <main>
      <h1>Profile</h1>
      <BioField />
      <p>{bio.length} of 80 letters</p>
    </main>
  )
}
