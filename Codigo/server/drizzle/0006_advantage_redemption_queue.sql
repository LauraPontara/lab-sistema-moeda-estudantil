DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pgmq.list_queues()
    WHERE queue_name = 'advantage_redemption_events'
  ) THEN
    PERFORM pgmq.create('advantage_redemption_events');
  END IF;
END
$$;