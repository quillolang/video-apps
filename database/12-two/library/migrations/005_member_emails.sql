-- One member per email, from now on. No email at all is fine: null is no value, so it's never taken.
create unique index members_email on members (email);
