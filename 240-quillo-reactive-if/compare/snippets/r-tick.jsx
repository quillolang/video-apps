const [running, setRunning] = useState(false)
const [speed, setSpeed] = useState(100)
const [ticks, setTicks] = useState(0)
// ...
useEffect(() => {
  if (!running) return
  const id = setInterval(() => setTicks((t) => t + 1), speed)
  return () => clearInterval(id)
}, [running, speed])
// ...
<button onClick={() => setRunning(!running)}>{running ? 'Stop' : 'Start'}</button>
<button onClick={() => setSpeed(speed / 2)}>Faster</button>
<p className="out">{ticks} ticks</p>
{running && <input placeholder="A note, while it runs" aria-label="Note" />}
