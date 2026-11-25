const [unread, setUnread] = useState(0)
// ...
{unread === 0 ? (
  <span>All read</span>
) : unread === 1 ? (
  <span>1 new message</span>
) : (
  <strong>{unread} new messages</strong>
)}
