-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create helper function for distance calculation
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 FLOAT,
  lon1 FLOAT,
  lat2 FLOAT,
  lon2 FLOAT
) RETURNS FLOAT AS $$
BEGIN
  RETURN earth_distance(
    ll_to_earth(lat1, lon1),
    ll_to_earth(lat2, lon2)
  ) / 1000; -- Convert to kilometers
END;
$$ LANGUAGE plpgsql IMMUTABLE;
