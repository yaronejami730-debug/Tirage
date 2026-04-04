-- Create storage bucket for lot images
insert into storage.buckets (id, name, public)
values ('lot-images', 'lot-images', true)
on conflict (id) do nothing;

-- Allow public read access
create policy "Public can view lot images"
  on storage.objects for select
  using (bucket_id = 'lot-images');

-- Allow service role to upload/delete
create policy "Service role can upload lot images"
  on storage.objects for insert
  with check (bucket_id = 'lot-images');

create policy "Service role can delete lot images"
  on storage.objects for delete
  using (bucket_id = 'lot-images');
