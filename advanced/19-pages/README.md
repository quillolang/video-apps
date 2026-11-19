# My Reply Went to the Wrong Ticket: Pages Without Reloads, and key | Advanced Quillo #19

Help Desk, lesson 19 of Advanced Quillo: pages without reloads. The ticket route still makes the whole page on the server (a 404 for no such ticket), but the page is one component, Tickets (ui/ticket.qwe), that reads url() and matches the path's pieces; TicketPage loads its data with load_ticket, a server fn for agents only. Older and Newer links and a Go to ticket box (navigate) change the page in place, and Back and Forward work; the log shows the next page prefetched. The mistake (steps/v1): TicketPage with no key, so after Newer the address and the replies are ticket 2's but the title, the half-written reply and who is here stay ticket 1's, and the reply lands on ticket 2. The fix (steps/v2): key={id}. The exercise: ?by=Ben in the address, to see one person's replies.

This lesson starts where [18-feeds](../18-feeds) ended.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

On Windows, in PowerShell, in this folder:

```powershell
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.6/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd --watch
```

Quillo gets updates: the official install page, https://quillolang.org/docs/install/, always has the latest.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): the ticket pages as one page, with no key (the lesson's mistake): a reply can land on the wrong ticket
- [`steps/v2`](steps/v2): key={id}: each ticket a fresh page
- this folder: one person's replies, ?by= in the address (the lesson's "your turn")
