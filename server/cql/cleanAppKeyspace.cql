DROP KEYSPACE IF EXISTS app;

CREATE KEYSPACE IF NOT EXISTS app
WITH REPLICATION = {'class' : 'SimpleStrategy', 'replication_factor': 1};
