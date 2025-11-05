# Cloudflare Polish Setup Guide

## What We Changed

### Problem Identified
- Astro was outputting WebP images (4MB+ files)
- **Cloudflare Polish doesn't optimize WebP files from origin servers**
- Result: No optimization was happening, slow load times

### Solution Implemented

#### 1. Converted Source Images
- `img_2486.webp` (4.7MB) → `img_2486.jpg` (2.1MB) - 55% reduction
- `img_2472.webp` (3.2MB) → `img_2472.jpg` (870KB) - 73% reduction
- `municipal-hero-final.webp` (710KB) → `municipal-hero-final.jpg` (800KB)

#### 2. Configured Astro for Cloudflare Polish
- **Output Format**: JPG (not WebP) - allows Polish to do WebP/AVIF conversion
- **Quality**: 90 (high quality) - let Cloudflare handle compression
- **Responsive Sizes**: Astro generates multiple sizes (srcset)
- **Format Preservation**: Images stay as JPG through the build

#### 3. Optimized Caching
- Added `/_assets/*` and `/_media/*` cache headers
- Set 1-year cache with `immutable` directive
- Allows Cloudflare edge to cache optimized images

## Cloudflare Dashboard Configuration

### Step 1: Enable Polish
1. Log into Cloudflare Dashboard
2. Select your domain: **lakecountyoutdoor.com**
3. Go to **Speed** → **Optimization** → **Image Optimization**
4. Enable **Polish**: Set to **Lossy**
5. Enable **WebP**: Check this box

**Recommended Settings:**
- Polish: **Lossy** (best compression with minimal quality loss)
- WebP: **Enabled** (converts JPG → WebP for supported browsers)

### Step 2: Verify Cache Settings
1. Go to **Caching** → **Configuration**
2. Browser Cache TTL: **Respect Existing Headers** (our _headers file handles this)
3. Ensure caching level is set to **Standard** or **Aggressive**

### Step 3: (Optional) Page Rule for Assets
Create a page rule for better performance:
1. Go to **Rules** → **Page Rules**
2. Create rule for: `lakecountyoutdoor.com/_assets/*`
3. Settings:
   - Cache Level: **Cache Everything**
   - Edge Cache TTL: **1 month**
   - Browser Cache TTL: **1 year**

## How It Works Now

### Build Time (Astro)
1. Takes JPG source images
2. Generates responsive sizes (800w, 1200w, 1920w, etc.)
3. Outputs as high-quality JPG (quality=90)
4. Creates srcset for responsive loading

### Delivery Time (Cloudflare Polish)
1. User requests page
2. Cloudflare checks browser capabilities
3. Converts JPG → WebP (if supported) or AVIF (if supported)
4. Applies lossy compression
5. Caches optimized version at edge
6. Serves from edge on subsequent requests

### Expected Results
- **Initial Load**: 60-75% faster (especially mobile)
- **File Sizes**:
  - Desktop: ~40-50% smaller (JPG → WebP compression)
  - Mobile: ~60-70% smaller (smaller srcset + WebP)
- **No Double Compression**: Single optimization pass
- **Browser Compatibility**: WebP for modern browsers, JPG fallback for old browsers

## Verification

### After Deploying

1. **Check Response Headers**:
```bash
curl -I https://lakecountyoutdoor.com/_assets/[image-name].jpg
```
Look for:
- `cf-polished: origSize=XXX, status=success`
- `cache-control: public, max-age=31536000, immutable`

2. **Browser DevTools**:
- Open Network tab
- Filter by Images
- Check if WebP is being served (look at Type column)
- Verify file sizes are smaller

3. **Polish Status Header**:
- `cf-polished: origSize=1234, status=success` = Working!
- `cf-polished: input=webp` = Not optimizing (shouldn't see this now)

## Image Strategy (Hybrid Approach)

We use a **hybrid optimization strategy** that leverages both Astro Image and Cloudflare Polish:

### Critical Images (Astro Image + Polish)
**Use for:** Hero images, site logo, above-the-fold content
**Location:** `src/assets/images/`
**Method:** Astro `<Image>` component with static imports

**Example:**
```astro
import heroImage from '../../assets/images/hero/hero.jpg';

<Image
  src={heroImage}
  alt="Hero"
  widths={[800, 1200, 1920]}
  sizes="100vw"
  quality={90}
  format="jpg"
  loading="eager"
  fetchpriority="high"
/>
```

**Why:** Double optimization (Astro at build + Polish at edge) = Maximum performance for critical content

---

### CMS-Managed Images (Polish Only)
**Use for:** Service images, gallery, blog content, about section
**Location:** `public/images/`
**Method:** Plain `<img>` tags with paths from TinaCMS

**Example:**
```astro
<img
  src={service.data.image}
  alt={service.data.title}
  loading="lazy"
  decoding="async"
/>
```

**Why:** TinaCMS requires public folder. Polish handles all optimization automatically.

---

## Maintenance

### Adding New Images

**For CMS Content:**
1. Upload high-quality JPG (quality 85-90) via TinaCMS
2. Store in `public/images/` subdirectories
3. **DO NOT create WebP versions** - Polish does this automatically
4. Use simple `<img>` tag with the JPG path

**For Critical/Static Images:**
1. Place JPG in `src/assets/images/`
2. Import and use Astro `<Image>` component
3. Set `format="jpg"` and `quality={90}`
4. Polish will still convert to WebP at edge

### What NOT to Do

❌ **Don't serve WebP from origin** - Polish can't optimize WebP files
❌ **Don't create manual responsive variants** (-400w.webp, etc.) - Polish handles this
❌ **Don't use `<picture>` with WebP sources** - Let Polish do the conversion
❌ **Don't use Astro Image for CMS paths** - Won't work with public folder

### If You Need to Revert
If Polish causes issues, you can disable it per-image:
- Add `cf-polish=off` parameter to URL
- Or disable Polish in Cloudflare dashboard

## Performance Tips

1. **Keep source images under 1MB** - faster builds and uploads
2. **Use lazy loading** for below-fold images
3. **Monitor Cloudflare Analytics** - check bandwidth savings and Polish usage
4. **Purge cache after changes** - Cloudflare dashboard → Caching → Purge Everything
5. **Check Polish headers** - `cf-polished: status=success` means it's working

## Verification

After deployment, verify Polish is working:

```bash
# Check response headers
curl -I https://lakecountyoutdoor.com/images/gallery/img-7114-1920w.jpg

# Look for these headers:
# cf-polished: origSize=443520, status=success
# content-type: image/webp  (in modern browsers)
```

## Notes

- Polish only works on cached assets (first request may be slower)
- Polish has daily quota on free plans - monitor usage in Cloudflare dashboard
- WebP files are served automatically to browsers that support them
- Older browsers receive optimized JPG fallback
