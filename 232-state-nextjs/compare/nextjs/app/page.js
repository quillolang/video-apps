// The page: its counts are read on the server for each request, inside a Suspense boundary.
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { getEveryone, read } from './state'
import Counters from './counters'

export default function Page({ searchParams }) {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <Counts searchParams={searchParams} />
    </Suspense>
  )
}

async function Counts({ searchParams }) {
  const { n } = await searchParams
  const visitor = Number((await cookies()).get('visitor')?.value ?? 0)
  return (
    <Counters
      address={Number(n ?? 0)}
      visitor={visitor}
      everyone={getEveryone()}
      saved={read('saved')}
      synced={read('synced')}
    />
  )
}
