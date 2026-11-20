// Each quirk, and its fix, at an address of its own: localhost:5173/#players, #players-fixed, and so on.
import Players from './Players.jsx'
import PlayersFixed from './PlayersFixed.jsx'
import Seating from './Seating.jsx'
import SeatingFixed from './SeatingFixed.jsx'
import Likes from './Likes.jsx'
import LikesFixed from './LikesFixed.jsx'
import Clicker from './Clicker.jsx'
import ClickerFixed from './ClickerFixed.jsx'
import Profile from './Profile.jsx'
import ProfileFixed from './ProfileFixed.jsx'

const pages = {
  players: Players, 'players-fixed': PlayersFixed,
  seating: Seating, 'seating-fixed': SeatingFixed,
  likes: Likes, 'likes-fixed': LikesFixed,
  clicker: Clicker, 'clicker-fixed': ClickerFixed,
  profile: Profile, 'profile-fixed': ProfileFixed,
}

export default function App() {
  const Page = pages[location.hash.slice(1)] ?? Players
  return <Page />
}
