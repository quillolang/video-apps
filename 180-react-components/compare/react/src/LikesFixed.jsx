import { useState } from 'react'

function LikeButton({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>
}

export default function LikesFixed() {
  const [likes, setLikes] = useState(0)
  return (
    <main>
      <h1>Likes</h1>
      <p className="big">{likes} likes</p>
      <LikeButton label="Like" onClick={() => setLikes(likes + 1)} />
    </main>
  )
}
