-- CreateExtension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- AddSearchVectorColumn
-- This migration adds a tsvector column for full-text search on books

-- Add search vector column
ALTER TABLE "Book" ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create index for fast full-text search
CREATE INDEX IF NOT EXISTS book_search_idx ON "Book" USING gin(search_vector);

-- Create trigger to auto-update search vector
CREATE OR REPLACE FUNCTION book_search_vector_trigger() RETURNS trigger AS $$
begin
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.title,'')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.subtitle,'')), 'B') ||
    setweight(to_tsvector('english', coalesce(new.description,'')), 'C') ||
    setweight(to_tsvector('english', array_to_string(new.authors, ' ')), 'B') ||
    setweight(to_tsvector('english', coalesce(new.isbn,'')), 'D');
  return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER book_search_vector_update BEFORE INSERT OR UPDATE
ON "Book" FOR EACH ROW EXECUTE FUNCTION book_search_vector_trigger();

-- Update existing rows
UPDATE "Book" SET search_vector =
  setweight(to_tsvector('english', coalesce(title,'')), 'A') ||
  setweight(to_tsvector('english', coalesce(subtitle,'')), 'B') ||
  setweight(to_tsvector('english', coalesce(description,'')), 'C') ||
  setweight(to_tsvector('english', array_to_string(authors, ' ')), 'B') ||
  setweight(to_tsvector('english', coalesce(isbn,'')), 'D');
