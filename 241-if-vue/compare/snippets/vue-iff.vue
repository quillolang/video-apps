<span v-if="unread === 0">All read</span>
<span v-else-if="unread === 1">1 new message</span>
<strong v-else>{{ unread }} new messages</strong>
