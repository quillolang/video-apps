// Luigi's kitchen, in React: four small parts, each with a classic bug.
import { useEffect, useState } from 'react';

// 1. Add one, a second after each click.
function Later() {
  const [count, setCount] = useState(0);
  const add = () => setTimeout(() => setCount(count + 1), 1000);
  return <p><button onClick={add}>Add one, in a second</button>
    {' '}{count}</p>;
}

// 2. Ask the oven how hot it is, every second, while its panel is open.
function Oven() {
  const [heat, setHeat] = useState('…');
  useEffect(() => {
    setInterval(async () => {
      setHeat(await (await fetch('/api/oven')).text());
    }, 1000);
  }, []);
  return <p>Oven: {heat}</p>;
}

// 3. A ticker, and a button that makes it ten times faster.
function Ticker() {
  const [speed, setSpeed] = useState(1000);
  const [ticks, setTicks] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTicks((t) => t + 1), speed);
    return () => clearInterval(id);
  }, []);
  return <p><button onClick={() => setSpeed(speed / 10)}>Faster</button>
    {' '}{ticks} ticks, every {speed} ms</p>;
}

// 4. What's under $10, worked out from the menu.
function Cheap() {
  const menu = [['Margherita', 9], ['Funghi', 11], ['Lemonade', 3]];
  const [cheap, setCheap] = useState([]);
  useEffect(() => {
    setCheap(menu.filter(([, price]) => price < 10));
  }, [menu]);
  return <p>Under $10: {cheap.map(([name]) => name).join(', ')}</p>;
}

export default function App() {
  const [open, setOpen] = useState(true);
  return <>
    <h1>🍕 Luigi's kitchen</h1>
    <Later />
    {open && <Oven />}
    <p><button onClick={() => setOpen(false)}>
      Close the oven's panel</button></p>
    <Ticker />
    <Cheap />
  </>;
}
