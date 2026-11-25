'use client'
// Six kinds of state on one page, each with a +1.
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { addEveryoneOne, addSaved, addSynced, addVisitor } from './actions'

export default function Counters({ address, visitor, everyone, saved, synced }) {
  const [tab, setTab] = useState(0)

  // Kept in sync: ask the server for the page again, every second.
  const router = useRouter()
  useEffect(() => {
    const timer = setInterval(() => router.refresh(), 1000)
    return () => clearInterval(timer)
  }, [router])

  return (
    <>
      <h1>Where state lives</h1>
      <button id="tab" onClick={() => setTab(tab + 1)}>This tab: {tab}</button>
      <Link id="address" href={`/?n=${address + 1}`}>The address: {address}</Link>
      <button id="visitor" onClick={() => addVisitor()}>This visitor: {visitor}</button>
      <button id="everyone" onClick={() => addEveryoneOne()}>Everyone, until a restart: {everyone}</button>
      <button id="saved" onClick={() => addSaved()}>Everyone, for good: {saved}</button>
      <button id="synced" onClick={() => addSynced()}>Kept in sync: {synced}</button>
    </>
  )
}
