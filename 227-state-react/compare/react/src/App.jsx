// Six kinds of state on one page, each with a +1.
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

function TabCount() {
  const [n, setN] = useState(0)
  return <button id="tab" onClick={() => setN(n + 1)}>This tab: {n}</button>
}

function AddressCount() {
  const [params] = useSearchParams()
  const n = Number(params.get('n') ?? 0)
  return <Link id="address" to={`/?n=${n + 1}`}>The address: {n}</Link>
}

// A count kept by the server: /api/<id> reads it, a POST adds one.
function ServerCount({ id, label, refetchInterval }) {
  const client = useQueryClient()
  const { data } = useQuery({
    queryKey: [id],
    queryFn: () => fetch(`/api/${id}`).then((r) => r.json()),
    refetchInterval,
  })
  const add = useMutation({
    mutationFn: () => fetch(`/api/${id}`, { method: 'POST' }).then((r) => r.json()),
    onSuccess: (n) => client.setQueryData([id], n),
  })
  return <button id={id} onClick={() => add.mutate()}>{label}: {data ?? 0}</button>
}

export default function App() {
  return (
    <>
      <h1>Where state lives</h1>
      <TabCount />
      <AddressCount />
      <ServerCount id="visitor" label="This visitor" />
      <ServerCount id="everyone" label="Everyone, until a restart" />
      <ServerCount id="saved" label="Everyone, for good" />
      <ServerCount id="synced" label="Kept in sync" refetchInterval={1000} />
    </>
  )
}
