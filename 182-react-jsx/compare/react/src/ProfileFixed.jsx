const user = { name: 'Ana', city: 'Cebu' }

export default function ProfileFixed() {
  return (
    <main>
      <h1>Profile</h1>
      <p className="big">{user.name}, {user.city}</p>
    </main>
  )
}
