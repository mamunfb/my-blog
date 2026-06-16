# Custom Domain & Google Search Console - Quick Setup

## Part 1: Connect Your Custom Domain (5 minutes)

### Option A: Purchase Domain Through Manus

1. Open your blog in the Management UI
2. Go to **Settings > Domains**
3. Click **Purchase New Domain**
4. Search for your desired domain (e.g., `myblog.com`)
5. Check availability and pricing
6. Complete purchase
7. Domain is automatically assigned to your blog ✅

### Option B: Connect Existing Domain

1. Open your blog in the Management UI
2. Go to **Settings > Domains**
3. Click **Connect Existing Domain**
4. Enter your domain name
5. Follow DNS configuration:
   - **Option 1:** Add CNAME record
     - Name: `www` (or your subdomain)
     - Value: `manus.space`
   - **Option 2:** Add A record
     - Name: `@` (root domain)
     - Value: `[IP provided by Manus]`
6. Wait for DNS propagation (5-48 hours)
7. Status will show "Connected" when ready ✅

### Verify Domain is Working

- [ ] Visit your domain in browser
- [ ] See green lock icon (HTTPS)
- [ ] Site loads correctly
- [ ] All pages accessible

## Part 2: Google Search Console Setup (10 minutes)

### Step 1: Create Google Search Console Account

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Sign in with your Google account
3. Click **Start now**

### Step 2: Add Your Property

1. Click **+ Add property** (top left)
2. Choose **URL prefix**
3. Enter your domain:
   - With custom domain: `https://yourblog.com`
   - With Manus domain: `https://yourblog.manus.space`
4. Click **Continue**

### Step 3: Verify Domain Ownership

**Recommended: HTML Meta Tag Method**

1. Google provides a verification code
2. Copy the meta tag
3. In your blog's code (`client/index.html`):
   ```html
   <head>
     <meta name="google-site-verification" content="YOUR_CODE_HERE" />
   </head>
   ```
4. Save and deploy your blog
5. Return to Google Search Console
6. Click **Verify**

**Alternative: HTML File Upload**

1. Download verification file from Google
2. Upload to your blog's public folder
3. Return to Google Search Console
4. Click **Verify**

### Step 4: Submit Your Sitemap

1. In Google Search Console, go to **Sitemaps** (left sidebar)
2. Enter your sitemap URL:
   - `https://yourblog.com/sitemap.xml`
   - Or `https://yourblog.manus.space/sitemap.xml`
3. Click **Submit**
4. Status shows "Success" when processed ✅

**Wait 24-48 hours for Google to index your sitemap**

### Step 5: Monitor Your Site

#### Coverage Report
- **Path:** Coverage (left sidebar)
- **Shows:** Which pages are indexed
- **Action:** Fix any errors or warnings

#### Performance Report
- **Path:** Performance (left sidebar)
- **Shows:** 
  - Click-through rate (CTR)
  - Impressions
  - Average position
  - Device breakdown

#### URL Inspection
- **Path:** URL Inspection (top search bar)
- **Use:** Check if specific pages are indexed
- **Action:** Request indexing for new posts

## Part 3: SEO Optimization Checklist

### On-Page SEO

- [ ] Post titles include keywords (under 60 chars)
- [ ] Meta descriptions are compelling (150-160 chars)
- [ ] Content includes internal links
- [ ] Images have descriptive alt text
- [ ] Headings use proper hierarchy (H1, H2, H3)

### Technical SEO

- [ ] Sitemap is submitted to Google
- [ ] Robots.txt is accessible
- [ ] SSL certificate is active (HTTPS)
- [ ] Site loads quickly
- [ ] Mobile-friendly design

### Content SEO

- [ ] Posts are unique and valuable
- [ ] Keywords used naturally
- [ ] Content is well-structured
- [ ] Regular publishing schedule
- [ ] Engagement with readers

## Part 4: Monitoring & Maintenance

### Weekly Tasks

- [ ] Check Google Search Console for errors
- [ ] Review new search queries
- [ ] Monitor CTR and impressions
- [ ] Check indexing status

### Monthly Tasks

- [ ] Analyze top-performing keywords
- [ ] Review ranking improvements
- [ ] Optimize underperforming content
- [ ] Check for broken links

### Quarterly Tasks

- [ ] Audit all posts for SEO
- [ ] Update old content
- [ ] Improve internal linking
- [ ] Check Core Web Vitals

## Common Issues & Solutions

### Domain Not Connecting

**Issue:** Domain shows "Pending" or "Failed"
- **Solution:** Check DNS records are correct
- **Solution:** Wait 24-48 hours for propagation
- **Solution:** Contact domain registrar for help

### Sitemap Not Submitting

**Issue:** "Invalid URL" error
- **Solution:** Verify sitemap URL is correct
- **Solution:** Check sitemap is accessible
- **Solution:** Try submitting again

### Pages Not Indexed

**Issue:** Coverage shows "Excluded"
- **Solution:** Check robots.txt isn't blocking
- **Solution:** Verify page is linked from homepage
- **Solution:** Request indexing manually

### Low Search Traffic

**Issue:** Few clicks from search results
- **Solution:** Improve meta descriptions
- **Solution:** Target less competitive keywords
- **Solution:** Create more content
- **Solution:** Build backlinks

## Quick Reference

| Task | Time | Difficulty |
|------|------|-----------|
| Connect domain | 5 min | Easy |
| Verify in GSC | 10 min | Easy |
| Submit sitemap | 2 min | Easy |
| Monitor performance | Ongoing | Easy |

## Next Steps

1. ✅ Connect your custom domain
2. ✅ Verify in Google Search Console
3. ✅ Submit your sitemap
4. ✅ Monitor performance
5. ✅ Optimize content based on data

## Resources

- [Google Search Console Help](https://support.google.com/webmasters)
- [SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [PageSpeed Insights](https://pagespeed.web.dev/)

---

**Estimated Time to Complete:** 20 minutes
**Difficulty Level:** Beginner-friendly
**Impact:** Critical for SEO and discoverability
