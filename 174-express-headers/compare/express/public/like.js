// The like button's script, in a file the page loads: helmet's policy lets the site's own files run.
document.getElementById('like').onclick = async () => {
  const r = await fetch('/like', { method: 'POST' })
  document.querySelector('#like span').textContent = await r.text()
}
