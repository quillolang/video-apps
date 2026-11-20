// Each quirk, and its fix, at an address of its own: localhost:5173/#note, #note-fixed, and so on.
import Note from './Note.jsx'
import NoteFixed from './NoteFixed.jsx'
import Profile from './Profile.jsx'
import ProfileFixed from './ProfileFixed.jsx'
import Likes from './Likes.jsx'
import LikesFixed from './LikesFixed.jsx'
import Welcome from './Welcome.jsx'
import WelcomeFixed from './WelcomeFixed.jsx'
import Inbox from './Inbox.jsx'
import InboxFixed from './InboxFixed.jsx'

const pages = {
  note: Note, 'note-fixed': NoteFixed,
  profile: Profile, 'profile-fixed': ProfileFixed,
  likes: Likes, 'likes-fixed': LikesFixed,
  welcome: Welcome, 'welcome-fixed': WelcomeFixed,
  inbox: Inbox, 'inbox-fixed': InboxFixed,
}

export default function App() {
  const Page = pages[location.hash.slice(1)] ?? Note
  return <Page />
}
