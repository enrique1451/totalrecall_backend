\echo 'Delete and recreate totalrecall db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE totalrecall;
CREATE DATABASE totalrecall;
\connect totalrecall

\i totalrecall-schema.sql

\echo 'Delete and recreate totalrecall_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE totalrecall_test;
CREATE DATABASE totalrecall_test;
\connect totalrecall_test

\i totalrecall-schema.sql
