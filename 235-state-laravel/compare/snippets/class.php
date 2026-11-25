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
