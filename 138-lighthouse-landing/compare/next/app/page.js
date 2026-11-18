import Image from 'next/image'
import hero from '../public/hero.jpg'

const features = [
  ['Baked at dawn', 'Every loaf comes out of the oven by seven, so it is still warm when you collect it.'],
  ['Slow sourdough', 'Our starter is twelve years old, and each dough rests for a full day before baking.'],
  ['Order today', 'Choose your loaves by nine tonight, and they are waiting for you in the morning.'],
]

export default function Home() {
  return (
    <>
      <header>
        <a className="brand" href="/">Hearth Bakery</a>
        <nav><a href="/breads">Breads</a><a href="/visit">Visit</a></nav>
      </header>
      <main>
        <section className="hero">
          <Image src={hero} alt="Loaves cooling on the bakery's counter" priority sizes="100vw" />
          <div className="text">
            <h1>Bread worth getting up for</h1>
            <p>Sourdough, rye and seeded loaves, baked every morning on Market Lane.</p>
            <a className="cta" href="/order">Order for tomorrow</a>
          </div>
        </section>
        <section className="features">
          {features.map(([title, text]) => (
            <div key={title}><h2>{title}</h2><p>{text}</p></div>
          ))}
        </section>
      </main>
      <footer>Hearth Bakery, 4 Market Lane. Open every day from 7 till the bread is gone.</footer>
    </>
  )
}
