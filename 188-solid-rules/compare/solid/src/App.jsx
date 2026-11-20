// Each quirk, and its fix, at an address of its own: localhost:3000/#score, #score-fixed, and so on.
import Score from './Score.jsx';
import ScoreFixed from './ScoreFixed.jsx';
import Likes from './Likes.jsx';
import LikesFixed from './LikesFixed.jsx';
import Tickets from './Tickets.jsx';
import TicketsFixed from './TicketsFixed.jsx';
import Groceries from './Groceries.jsx';
import GroceriesFixed from './GroceriesFixed.jsx';
import Note from './Note.jsx';
import NoteFixed from './NoteFixed.jsx';
import './App.css';

const pages = {
  score: Score, 'score-fixed': ScoreFixed,
  likes: Likes, 'likes-fixed': LikesFixed,
  tickets: Tickets, 'tickets-fixed': TicketsFixed,
  groceries: Groceries, 'groceries-fixed': GroceriesFixed,
  note: Note, 'note-fixed': NoteFixed,
};

export default function App() {
  const Page = pages[location.hash.slice(1)] ?? Score;
  return <Page />;
}
