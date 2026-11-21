import './globals.css'

export const metadata = { title: 'Bake sale' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
