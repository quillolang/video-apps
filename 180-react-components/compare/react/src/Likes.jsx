import { useState } from 'react'

function LikeButton({ label }) {
  return <button>{label}</button>
}

export default function Likes() {
  const [likes, setLikes] = useState(0)
  return (
    <main>
      <h1>Likes</h1>
      <p className="big">{likes} likes</p>
      <LikeButton label="Like" onClick={() => setLikes(likes + 1)} />
    </main>
  )
}
