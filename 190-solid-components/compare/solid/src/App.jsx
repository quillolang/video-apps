// Each quirk, and its fix, at an address of its own: localhost:3000/#cart, #cart-fixed, and so on.
// Size.jsx, with Solid 1.x's onMount, is left out: importing it stops the whole app (shots.mjs tries it).
import Cart from './Cart.jsx';
import CartFixed from './CartFixed.jsx';
import Welcome from './Welcome.jsx';
import WelcomeFixed from './WelcomeFixed.jsx';
import Ranking from './Ranking.jsx';
import RankingFixed from './RankingFixed.jsx';
import Profile from './Profile.jsx';
import ProfileFixed from './ProfileFixed.jsx';
import SizeSettled from './SizeSettled.jsx';
import SizeFixed from './SizeFixed.jsx';
import './App.css';

const pages = {
  cart: Cart, 'cart-fixed': CartFixed,
  welcome: Welcome, 'welcome-fixed': WelcomeFixed,
  ranking: Ranking, 'ranking-fixed': RankingFixed,
  profile: Profile, 'profile-fixed': ProfileFixed,
  'size-settled': SizeSettled, 'size-fixed': SizeFixed,
};

export default function App() {
  const Page = pages[location.hash.slice(1)] ?? Cart;
  return <Page />;
}
