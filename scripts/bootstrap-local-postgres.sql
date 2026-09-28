DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'acc') THEN
    CREATE ROLE acc LOGIN PASSWORD 'acc';
  END IF;
END
$$;

SELECT 'CREATE DATABASE acc_dashboard OWNER acc'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'acc_dashboard')\gexec

GRANT ALL PRIVILEGES ON DATABASE acc_dashboard TO acc;
