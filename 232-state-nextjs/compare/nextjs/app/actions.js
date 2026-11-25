'use server'
// The +1s, run on the server; each one asks Next.js to draw the page again.
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { add, addEveryone } from './state'

export async function addVisitor() {
  const store = await cookies()
  store.set('visitor', String(Number(store.get('visitor')?.value ?? 0) + 1), { httpOnly: true })
  revalidatePath('/')
}

export async function addEveryoneOne() {
  addEveryone()
  revalidatePath('/')
}

export async function addSaved() {
  add('saved')
  revalidatePath('/')
}

export async function addSynced() {
  add('synced')
  revalidatePath('/')
}
