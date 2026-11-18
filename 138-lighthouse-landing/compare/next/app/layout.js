import './globals.css'

const description = 'Sourdough, rye and seeded loaves, baked every morning on Market Lane. '
  + 'Order today, collect tomorrow.'

export const metadata = { title: 'Hearth Bakery: bread worth getting up for', description }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
