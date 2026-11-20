import { useState } from 'react'

export default function LikesFixed() {
  const [likes, setLikes] = useState(0)

  return (
    <main>
      <h1>Likes</h1>
      <p className="big">{likes} likes</p>
      <button className="like" onClick={() => setLikes(likes + 1)}>Like</button>
    </main>
  )
}
