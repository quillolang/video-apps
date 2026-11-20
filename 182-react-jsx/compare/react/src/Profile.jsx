const user = { name: 'Ana', city: 'Cebu' }

export default function Profile() {
  return (
    <main>
      <h1>Profile</h1>
      <p className="big">{user}</p>
    </main>
  )
}
