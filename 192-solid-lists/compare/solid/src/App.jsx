// Each quirk, and its fix, at an address of its own: localhost:3000/#guests, #guests-fixed, and so on.
import Guests from './Guests.jsx';
import GuestsFixed from './GuestsFixed.jsx';
import Team from './Team.jsx';
import TeamFixed from './TeamFixed.jsx';
import Pantry from './Pantry.jsx';
import PantryFixed from './PantryFixed.jsx';
import Menu from './Menu.jsx';
import MenuFixed from './MenuFixed.jsx';
import News from './News.jsx';
import NewsFixed from './NewsFixed.jsx';
import './App.css';

const pages = {
  guests: Guests, 'guests-fixed': GuestsFixed,
  team: Team, 'team-fixed': TeamFixed,
  pantry: Pantry, 'pantry-fixed': PantryFixed,
  menu: Menu, 'menu-fixed': MenuFixed,
  news: News, 'news-fixed': NewsFixed,
};

export default function App() {
  const Page = pages[location.hash.slice(1)] ?? Guests;
  return <Page />;
}
