-- Storage policies for magazines bucket
CREATE POLICY "Magazine files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'magazines');

CREATE POLICY "Only authenticated users can upload magazine files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'magazines' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Only authenticated users can update magazine files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'magazines' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Only authenticated users can delete magazine files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'magazines' AND
  auth.role() = 'authenticated'
);

-- Storage policies for articles bucket
CREATE POLICY "Article files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'articles');

CREATE POLICY "Only authenticated users can upload article files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'articles' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Only authenticated users can update article files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'articles' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Only authenticated users can delete article files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'articles' AND
  auth.role() = 'authenticated'
);

-- Storage policies for events bucket
CREATE POLICY "Event files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'events');

CREATE POLICY "Only authenticated users can upload event files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'events' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Only authenticated users can update event files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'events' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Only authenticated users can delete event files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'events' AND
  auth.role() = 'authenticated'
); 