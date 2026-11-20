// Each quirk, and its fix, at an address of its own: localhost:5173/#chat, #chat-fixed, and so on.
import Chat from './Chat.jsx'
import ChatFixed from './ChatFixed.jsx'
import Seats from './Seats.jsx'
import SeatsFixed from './SeatsFixed.jsx'
import Room from './Room.jsx'
import RoomFixed from './RoomFixed.jsx'
import Menu from './Menu.jsx'
import MenuFixed from './MenuFixed.jsx'
import Stopwatch from './Stopwatch.jsx'
import StopwatchFixed from './StopwatchFixed.jsx'

const pages = {
  chat: Chat, 'chat-fixed': ChatFixed,
  seats: Seats, 'seats-fixed': SeatsFixed,
  room: Room, 'room-fixed': RoomFixed,
  menu: Menu, 'menu-fixed': MenuFixed,
  stopwatch: Stopwatch, 'stopwatch-fixed': StopwatchFixed,
}

export default function App() {
  const Page = pages[location.hash.slice(1)] ?? Chat
  return <Page />
}
