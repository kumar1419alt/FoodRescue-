# Data-access boundary

Database adapters belong in this directory in the database phase. Services must
depend on these interfaces rather than importing an ORM or database client directly.
