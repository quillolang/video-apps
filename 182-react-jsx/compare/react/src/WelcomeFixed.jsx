export default function WelcomeFixed() {
  const name = 'Ana'

  return (
    <main>
      <h1>Welcome</h1>
      <p className="big">
        Hello{' '}
        <b>{name}</b>!
      </p>
    </main>
  )
}
