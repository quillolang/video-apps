// Each quirk, and its fix, at an address of its own: localhost:5173/#guests, #guests-fixed, and so on.
import Guests from './Guests.jsx'
import GuestsFixed from './GuestsFixed.jsx'
import Name from './Name.jsx'
import NameFixed from './NameFixed.jsx'
import Notes from './Notes.jsx'
import NotesFixed from './NotesFixed.jsx'
import SignUp from './SignUp.jsx'
import SignUpFixed from './SignUpFixed.jsx'
import Code from './Code.jsx'
import CodeFixed from './CodeFixed.jsx'

const pages = {
  guests: Guests, 'guests-fixed': GuestsFixed,
  name: Name, 'name-fixed': NameFixed,
  notes: Notes, 'notes-fixed': NotesFixed,
  'sign-up': SignUp, 'sign-up-fixed': SignUpFixed,
  code: Code, 'code-fixed': CodeFixed,
}

export default function App() {
  const Page = pages[location.hash.slice(1)] ?? Guests
  return <Page />
}
