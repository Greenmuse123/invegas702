-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('magazines-storage', 'magazines', true),
  ('articles', 'articles', true),
  ('events', 'events', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for magazines-storage bucket
CREATE POLICY "Magazine files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'magazines-storage');

CREATE POLICY "Only admin users can upload magazine files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'magazines-storage' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Only admin users can update magazine files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'magazines-storage' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Only admin users can delete magazine files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'magazines-storage' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Storage policies for articles bucket
CREATE POLICY "Article files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'articles');

CREATE POLICY "Only admin users can upload article files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'articles' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Only admin users can update article files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'articles' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Only admin users can delete article files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'articles' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Storage policies for events bucket
CREATE POLICY "Event files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'events');

CREATE POLICY "Only admin users can upload event files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'events' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Only admin users can update event files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'events' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Only admin users can delete event files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'events' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
); 