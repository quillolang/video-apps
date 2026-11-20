import { useState, useRef, useLayoutEffect } from 'react'

export default function CodeFixed() {
  const [code, setCode] = useState('HELLO')
  const input = useRef(null)
  const caret = useRef(0)

  useLayoutEffect(() => {
    input.current.setSelectionRange(caret.current, caret.current)
  }, [code])

  function type(e) {
    caret.current = e.target.selectionStart
    setCode(e.target.value.toUpperCase())
  }

  return (
    <main>
      <h1>Coupon code</h1>
      <input ref={input} value={code} onChange={type} />
      <p>Your code: <b>{code}</b></p>
    </main>
  )
}
