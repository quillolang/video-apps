-- One student per email from now on.
create unique index students_email on students (email);
