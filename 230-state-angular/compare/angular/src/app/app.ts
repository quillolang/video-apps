// Six kinds of state on one page, each with a +1.
import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap, timer } from 'rxjs';

type Count = 'visitor' | 'everyone' | 'saved' | 'synced';

@Component({
  selector: 'app-root',
  imports: [RouterLink],
  template: `
    <h1>Where state lives</h1>
    <button id="tab" (click)="tab.set(tab() + 1)">This tab: {{ tab() }}</button>
    <a id="address" routerLink="/" [queryParams]="{ n: address() + 1 }">The address: {{ address() }}</a>
    <button id="visitor" (click)="add('visitor')">This visitor: {{ counts().visitor }}</button>
    <button id="everyone" (click)="add('everyone')">Everyone, until a restart: {{ counts().everyone }}</button>
    <button id="saved" (click)="add('saved')">Everyone, for good: {{ counts().saved }}</button>
    <button id="synced" (click)="add('synced')">Kept in sync: {{ counts().synced }}</button>
  `,
})
export class App {
  private http = inject(HttpClient);
  protected tab = signal(0);
  protected address = toSignal(
    inject(ActivatedRoute).queryParamMap.pipe(map((q) => Number(q.get('n') ?? 0))),
    { initialValue: 0 },
  );

  // The counts the server keeps: /api/<id> reads one, a POST adds one.
  protected counts = signal({ visitor: 0, everyone: 0, saved: 0, synced: 0 });

  constructor() {
    for (const id of ['visitor', 'everyone', 'saved'] as Count[]) {
      this.http.get<number>(`/api/${id}`).subscribe((n) => this.set(id, n));
    }
    // Kept in sync: ask for the synced count again, every second.
    timer(0, 1000)
      .pipe(switchMap(() => this.http.get<number>('/api/synced')))
      .subscribe((n) => this.set('synced', n));
  }

  protected add(id: Count) {
    this.http.post<number>(`/api/${id}`, null).subscribe((n) => this.set(id, n));
  }

  private set(id: Count, n: number) {
    this.counts.update((c) => ({ ...c, [id]: n }));
  }
}
