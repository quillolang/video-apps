-- Wrong sign-ins, by email (an account or not), so that too many in a row can be refused for a while.
create table failed_sign_ins (
    email text not null,
    at text not null default current_timestamp
);
create index failed_sign_ins_email_at on failed_sign_ins (email, at);
