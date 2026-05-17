CREATE EXTENSION IF NOT EXISTS pgmq;--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pgmq.list_queues()
    WHERE queue_name = 'coin_transfer_events'
  ) THEN
    PERFORM pgmq.create('coin_transfer_events');
  END IF;
END
$$;

