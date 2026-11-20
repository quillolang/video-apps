// Each quirk, and its fix, at an address of its own: localhost:5173/#score, #score-fixed, and so on.
import Score from './Score.jsx'
import ScoreFixed from './ScoreFixed.jsx'
import Greeting from './Greeting.jsx'
import GreetingFixed from './GreetingFixed.jsx'
import Groceries from './Groceries.jsx'
import GroceriesFixed from './GroceriesFixed.jsx'
import Clicks from './Clicks.jsx'
import ClicksFixed from './ClicksFixed.jsx'
import Later from './Later.jsx'
import LaterFixed from './LaterFixed.jsx'

const pages = {
  score: Score, 'score-fixed': ScoreFixed,
  greeting: Greeting, 'greeting-fixed': GreetingFixed,
  groceries: Groceries, 'groceries-fixed': GroceriesFixed,
  clicks: Clicks, 'clicks-fixed': ClicksFixed,
  later: Later, 'later-fixed': LaterFixed,
}

export default function App() {
  const Page = pages[location.hash.slice(1)] ?? Score
  return <Page />
}
