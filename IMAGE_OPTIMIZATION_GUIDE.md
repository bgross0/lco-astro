# Image Optimization & CMS Enhancement Guide

## Current Issues Identified

1. **Poor Image Resolution**: Images served at wrong sizes for different devices
2. **No Optimization Pipeline**: Raw images served without compression
3. **Limited Cloudflare Integration**: Not using Image Transform or Polish
4. **CMS Upload Issues**: No automatic optimization on upload

## Immediate Solutions

### 1. Enable Cloudflare Image Optimization

#### A. Cloudflare Polish (Automatic - No Code Changes)
1. Log into Cloudflare Dashboard
2. Go to **Speed → Optimization → Image Optimization**
3. Enable **Polish**: Set to "Lossy" for best compression
4. Enable **WebP**: Automatic conversion for supported browsers
5. Enable **Mirage**: Lazy loads images on mobile

#### B. Cloudflare Image Resizing (Requires Pro Plan)
1. Enable **Image Resizing** in Cloudflare dashboard
2. Use the CloudflareImage component I created:

```astro
import CloudflareImage from '@/components/common/CloudflareImage.astro';

<CloudflareImage
  src="/images/hero.jpg"
  alt="Hero image"
  width={1600}
  height={900}
  quality={85}
  loading="eager"
/>
```

### 2. Implement Astro Image Optimization

#### Step 1: Move images to src/assets
```bash
# Create assets directory
mkdir -p src/assets/images

# Move images (keeping originals in public for CMS)
cp -r public/images/* src/assets/images/
```

#### Step 2: Update components to use Astro Image
```astro
---
import { Image } from 'astro:assets';
import heroImage from '@/assets/images/hero.jpg';
---

<Image
  src={heroImage}
  alt="Hero"
  widths={[400, 800, 1600]}
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 1600px"
  quality={80}
  format="webp"
/>
```

### 3. CMS Image Upload Improvements

#### A. Add image optimization webhook
Create a Cloudflare Function to optimize images on upload:

```javascript
// functions/api/optimize-image.js
export async function onRequest(context) {
  const { request, env } = context;
  const formData = await request.formData();
  const file = formData.get('file');

  // Use Cloudflare Images API to optimize
  const optimized = await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/images/v1`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.CF_IMAGES_TOKEN}`
    },
    body: formData
  });

  return optimized;
}
```

#### B. Update Decap CMS configuration
```yaml
# public/admin/config.yml
media_library:
  name: cloudinary  # Or use uploadcare
  config:
    cloud_name: your_cloud_name
    api_key: your_api_key
    multiple: false
    max_file_size: 10000000  # 10MB
    transformations:
      - width: 2400
        quality: auto:eco
        fetch_format: auto
```

### 4. Performance Quick Wins

#### A. Add loading priorities
```astro
// For above-the-fold images
<img loading="eager" fetchpriority="high" />

// For below-the-fold images
<img loading="lazy" decoding="async" />
```

#### B. Preload critical images
```html
<!-- In BaseLayout.astro -->
<link rel="preload" as="image" href="/images/hero.webp" type="image/webp">
```

#### C. Use responsive images everywhere
```astro
<picture>
  <source
    media="(max-width: 768px)"
    srcset="/images/hero-mobile.webp"
    type="image/webp"
  />
  <source
    media="(min-width: 769px)"
    srcset="/images/hero-desktop.webp"
    type="image/webp"
  />
  <img src="/images/hero.jpg" alt="Hero" />
</picture>
```

## Implementation Priority

### Phase 1: Immediate (Today)
1. ✅ Enable Cloudflare Polish & WebP
2. ✅ Add loading="lazy" to all non-hero images
3. ✅ Implement CloudflareImage component for new images

### Phase 2: This Week
1. Migrate hero images to Astro Image component
2. Set up image optimization pipeline
3. Configure Cloudflare Image Transform rules

### Phase 3: Next Sprint
1. Integrate Cloudinary or Uploadcare for CMS
2. Migrate all existing images to optimized versions
3. Set up automated image optimization workflow

## Testing Checklist

- [ ] Test on slow 3G connection
- [ ] Verify WebP fallbacks work
- [ ] Check Lighthouse scores before/after
- [ ] Test CMS image uploads
- [ ] Verify responsive images load correctly
- [ ] Test lazy loading behavior

## Expected Results

- **50-70% reduction** in image file sizes
- **2-3 second improvement** in page load times
- **Better Core Web Vitals** scores (LCP, CLS)
- **Improved mobile experience** with proper sizing

## Monitoring

1. Set up Cloudflare Analytics for image performance
2. Monitor Core Web Vitals in Search Console
3. Track image bandwidth usage in Cloudflare

## Additional Resources

- [Cloudflare Image Optimization](https://developers.cloudflare.com/images/)
- [Astro Image Guide](https://docs.astro.build/en/guides/images/)
- [Decap CMS Media Libraries](https://decapcms.org/docs/media-library-cloudinary/)