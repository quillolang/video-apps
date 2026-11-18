export const PASTRIES = [
  { id: 1, emoji: '🥐', name: 'Croissant', cents: 325 },
  { id: 2, emoji: '🥯', name: 'Bagel', cents: 250 },
  { id: 3, emoji: '🍩', name: 'Doughnut', cents: 275 },
  { id: 4, emoji: '🧁', name: 'Cupcake', cents: 350 },
  { id: 5, emoji: '🥧', name: 'Apple Pie', cents: 450 },
  { id: 6, emoji: '🍪', name: 'Cookie', cents: 175 },
  { id: 7, emoji: '🥨', name: 'Pretzel', cents: 300 },
  { id: 8, emoji: '🍰', name: 'Cheesecake', cents: 525 },
  { id: 9, emoji: '🥖', name: 'Baguette', cents: 400 },
  { id: 10, emoji: '🧇', name: 'Waffle', cents: 375 },
  { id: 11, emoji: '🥮', name: 'Mooncake', cents: 425 },
  { id: 12, emoji: '🍮', name: 'Flan', cents: 395 },
]

export const dollars = (cents) => `$${(cents / 100).toFixed(2)}`
