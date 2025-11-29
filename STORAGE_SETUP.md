# Supabase Storage Setup Guide

This guide will help you set up Supabase Storage for profile image uploads.

## Step 1: Create Storage Bucket

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `linkin.one`
3. Navigate to **Storage** in the left sidebar
4. Click **New bucket**
5. Configure the bucket:
   - **Name**: `profile-images`
   - **Public bucket**: ✅ Checked (enables public access to images)
   - **File size limit**: 1 MB
   - **Allowed MIME types**: Leave empty (will validate on client)
6. Click **Create bucket**

## Step 2: Set Up Storage Policies

By default, the bucket is created with no access policies. You need to add policies for authenticated users to upload and everyone to read.

### Policy 1: Allow Authenticated Users to Upload

1. Click on your `profile-images` bucket
2. Go to **Policies** tab
3. Click **New policy**
4. Choose **For full customization** (or start from template)
5. Configure:

   ```
   Policy name: Allow authenticated users to upload
   Allowed operation: INSERT
   Target roles: authenticated

   USING expression: true
   WITH CHECK expression: (bucket_id = 'profile-images')
   ```

6. Click **Review** and **Save policy**

### Policy 2: Allow Public Read Access

1. Click **New policy** again
2. Configure:

   ```
   Policy name: Allow public read access
   Allowed operation: SELECT
   Target roles: public, authenticated

   USING expression: (bucket_id = 'profile-images')
   ```

3. Click **Review** and **Save policy**

### Policy 3: Allow Users to Update Their Own Files

1. Click **New policy** again
2. Configure:

   ```
   Policy name: Allow users to update own files
   Allowed operation: UPDATE
   Target roles: authenticated

   USING expression: (bucket_id = 'profile-images')
   WITH CHECK expression: (bucket_id = 'profile-images')
   ```

3. Click **Review** and **Save policy**

### Policy 4: Allow Users to Delete Their Own Files

1. Click **New policy** again
2. Configure:

   ```
   Policy name: Allow users to delete own files
   Allowed operation: DELETE
   Target roles: authenticated

   USING expression: (bucket_id = 'profile-images')
   ```

3. Click **Review** and **Save policy**

## Alternative: Quick Setup with SQL

You can also run this SQL in the **SQL Editor** to set up all policies at once:

```sql
-- Enable RLS for storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-images');

-- Allow public read access
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
TO public, authenticated
USING (bucket_id = 'profile-images');

-- Allow users to update
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-images')
WITH CHECK (bucket_id = 'profile-images');

-- Allow users to delete
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profile-images');
```

## Step 3: Verify Storage is Working

1. Log in to your application
2. Go to the admin dashboard
3. Navigate to the Profile tab
4. Try uploading an image:
   - Click on the "Upload File" tab
   - Select an image (max 1MB)
   - The image should upload and display in the preview

## Storage Structure

Uploaded files will be stored with this structure:

```
profile-images/
  └── avatars/
      ├── {user-id}-{timestamp}.jpg
      ├── {user-id}-{timestamp}.png
      └── ...
```

## File Size and Type Validation

The application enforces:

- **Max file size**: 1MB (1,048,576 bytes)
- **Allowed types**: Image files only (JPEG, PNG, GIF, WebP, etc.)
- Validation happens on the client side before upload

## Troubleshooting

### "Failed to upload image" error

- Check that the `profile-images` bucket exists
- Verify storage policies are correctly configured
- Ensure the user is authenticated
- Check browser console for specific error messages

### "Row Level Security policy violation" error

- The storage policies may not be set up correctly
- Run the SQL commands above to create the policies
- Make sure RLS is enabled on `storage.objects`

### Image not displaying after upload

- Verify the bucket is set to **Public**
- Check that the public read policy exists
- Clear browser cache and try again

### File size too large

- Ensure the file is under 1MB
- Compress the image before uploading
- Try a different image format (WebP is often smaller)

## Additional Configuration (Optional)

### Set Up Image Transformations

Supabase can automatically resize and optimize images:

1. Go to **Storage** > **Settings**
2. Enable **Image transformations**
3. You can then use transformation parameters in URLs:
   ```
   https://your-project.supabase.co/storage/v1/render/image/public/profile-images/avatars/image.jpg?width=200&height=200
   ```

### Set Up CDN

For better performance, enable the CDN:

1. Go to **Storage** > **Settings**
2. Enable **CDN caching**
3. Images will be served through a CDN for faster delivery

## Security Best Practices

- Keep file size limits reasonable (1MB is good for profile images)
- Validate file types on both client and server
- Consider scanning uploaded files for malware in production
- Regularly clean up unused images
- Monitor storage usage in your Supabase dashboard

## Related Documentation

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Storage Policies Guide](https://supabase.com/docs/guides/storage/security/access-control)
- [Image Transformations](https://supabase.com/docs/guides/storage/serving/image-transformations)
