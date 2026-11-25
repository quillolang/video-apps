import './globals.css'

export const metadata = { title: 'Where state lives' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
