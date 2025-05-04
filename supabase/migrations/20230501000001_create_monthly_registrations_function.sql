-- Function to get monthly registration counts
CREATE OR REPLACE FUNCTION get_monthly_registrations()
RETURNS TABLE (
  month TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') AS month,
    COUNT(*) AS count
  FROM
    registrations
  GROUP BY
    DATE_TRUNC('month', created_at)
  ORDER BY
    DATE_TRUNC('month', created_at) DESC
  LIMIT 12;
END;
$$ LANGUAGE plpgsql;
