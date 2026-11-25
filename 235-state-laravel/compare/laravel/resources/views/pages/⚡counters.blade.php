<?php
// Six kinds of state on one page, each with a +1. The class runs on the server; every press is a request.

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Livewire\Attributes\Computed;
use Livewire\Attributes\Title;
use Livewire\Attributes\Url;
use Livewire\Component;

new #[Title('Where state lives')] class extends Component
{
    public int $tab = 0; // this tab: kept in the page, sent back with each request

    #[Url]
    public int $n = 0; // the address: ?n=

    public function addTab() { $this->tab++; }
    public function addAddress() { $this->n++; }
    public function addVisitor() { session()->increment('visitor'); }
    public function addEveryone()
    {
        Cache::add('everyone', 0); // the database cache only increments a key it already has
        Cache::increment('everyone');
    }
    public function addSaved() { DB::table('counts')->where('name', 'saved')->increment('n'); }
    public function addSynced() { DB::table('counts')->where('name', 'synced')->increment('n'); }

    #[Computed] public function visitor() { return session('visitor', 0); }
    #[Computed] public function everyone() { return Cache::get('everyone', 0); }
    #[Computed] public function saved() { return DB::table('counts')->where('name', 'saved')->value('n'); }
    #[Computed] public function synced() { return DB::table('counts')->where('name', 'synced')->value('n'); }
};
?>

<div>
    <h1>Where state lives</h1>
    <button id="tab" wire:click="addTab">This tab: {{ $tab }}</button>
    <button id="address" wire:click="addAddress">The address: {{ $n }}</button>
    <button id="visitor" wire:click="addVisitor">This visitor: {{ $this->visitor }}</button>
    <button id="everyone" wire:click="addEveryone">Everyone, until a restart: {{ $this->everyone }}</button>
    <button id="saved" wire:click="addSaved">Everyone, for good: {{ $this->saved }}</button>
    {{-- Kept in sync: an island that asks the server again every 2 seconds (wire:poll's default). --}}
    @island
        <div wire:poll>
            <button id="synced" wire:click="addSynced">Kept in sync: {{ $this->synced }}</button>
        </div>
    @endisland
</div>
