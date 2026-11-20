import { useState } from 'react'

export default function Likes() {
  const [likes, setLikes] = useState(0)

  return (
    <main>
      <h1>Likes</h1>
      <p className="big">{likes} likes</p>
      <button class="like" onclick={() => setLikes(likes + 1)}>Like</button>
    </main>
  )
}
