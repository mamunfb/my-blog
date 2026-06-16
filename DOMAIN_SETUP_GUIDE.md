# Domain Setup and SEO Configuration Guide

## Overview

This guide walks you through setting up a custom domain for your blog and configuring Google Search Console for optimal SEO performance.

## Part 1: Custom Domain Setup

### Step 1: Access Domain Settings

1. Open your blog website in the Management UI
2. Click on **Settings** in the left sidebar
3. Navigate to **Domains** tab

### Step 2: Choose Your Domain Option

You have three options:

#### Option A: Use Manus Auto-Generated Domain (Free)
- Your blog is already live at: `<your-project>.manus.space`
- No additional setup required
- Good for testing and development

#### Option B: Purchase a New Domain Through Manus
1. Click **Purchase New Domain**
2. Search for your desired domain name
3. Check availability and pricing
4. Complete the purchase process
5. Domain is automatically assigned to your blog

#### Option C: Connect Your Existing Domain
1. Click **Connect Existing Domain**
2. Enter your domain name
3. Follow the DNS configuration instructions:
   - Add CNAME record pointing to Manus servers
   - Or add A record with provided IP address
4. Wait for DNS propagation (5-48 hours)

### Step 3: Verify Domain Configuration

Once your domain is set up:

1. Wait for DNS propagation (check status in Settings > Domains)
2. Visit your domain in a browser
3. Verify the site loads correctly
4. Check that SSL certificate is active (green lock icon)

### Step 4: Update Environment Variables

After domain setup, update your blog's environment variables:

1. Go to **Settings > Secrets**
2. Update `VITE_APP_URL` to your custom domain:
   ```
   https://yourblog.com
   ```
3. Save changes
4. Restart the development server

## Part 2: Google Search Console Setup

### Step 1: Create Google Search Console Account

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Sign in with your Google account
3. Click **Start now**

### Step 2: Add Your Property

1. Click the **+ Add property** button
2. Choose **URL prefix** (recommended)
3. Enter your blog's URL:
   - If using Manus domain: `https://<your-project>.manus.space`
   - If using custom domain: `https://yourblog.com`
4. Click **Continue**

### Step 3: Verify Domain Ownership

Google offers several verification methods:

#### Method 1: HTML File Upload (Recommended)
1. Download the HTML verification file from Google
2. In your blog's Management UI:
   - Go to **Settings > General**
   - Find the **Favicon/Verification Files** section
   - Upload the HTML file
3. Return to Google Search Console
4. Click **Verify**

#### Method 2: HTML Meta Tag
1. Copy the meta tag from Google Search Console
2. In your blog's code (`client/index.html`):
   ```html
   <head>
     <!-- Add this line -->
     <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
   </head>
   ```
3. Deploy your changes
4. Return to Google Search Console and click **Verify**

#### Method 3: DNS Record
1. Copy the DNS record from Google
2. Add it to your domain's DNS settings (through your domain registrar)
3. Wait for propagation
4. Return to Google Search Console and click **Verify**

### Step 4: Submit Sitemap

1. In Google Search Console, go to **Sitemaps** (left sidebar)
2. Enter your sitemap URL:
   - `https://yourblog.com/sitemap.xml`
   - Or `https://<your-project>.manus.space/sitemap.xml`
3. Click **Submit**
4. Wait for Google to process (24-48 hours)

### Step 5: Monitor Performance

#### Coverage Report
1. Go to **Coverage** in the left sidebar
2. Check for any errors or warnings
3. Fix any issues with indexing

#### Performance Report
1. Go to **Performance** to see:
   - Click-through rate (CTR)
   - Impressions
   - Average position in search results
   - Device breakdown

#### URL Inspection
1. Use **URL Inspection** to check if specific pages are indexed
2. Request indexing for new posts

## Part 3: SEO Configuration

### Automatic SEO Features

Your blog already includes:

1. **Dynamic Meta Tags**
   - Title, description, keywords
   - Open Graph tags (Facebook, LinkedIn)
   - Twitter Card tags

2. **Structured Data (JSON-LD)**
   - Article schema for blog posts
   - Website schema for homepage
   - Breadcrumb navigation

3. **XML Sitemap**
   - Automatically generated from published posts
   - Updated daily
   - Includes all 100+ language variants

4. **Robots.txt**
   - Configures crawler behavior
   - Blocks spam bots
   - Sets crawl delay

5. **Hreflang Tags**
   - Indicates language variants
   - Helps Google understand multilingual content
   - Prevents duplicate content issues

### Manual SEO Optimization

#### 1. Post Titles and Descriptions
- Keep titles under 60 characters
- Include target keywords naturally
- Write compelling meta descriptions (150-160 chars)

#### 2. Content Structure
- Use proper heading hierarchy (H1, H2, H3)
- Include internal links to related posts
- Use descriptive alt text for images

#### 3. Keywords
- Research keywords for each post
- Include in title, description, and first 100 words
- Use naturally throughout content

#### 4. Images
- Use descriptive filenames
- Add alt text
- Optimize file size (use WebP/AVIF formats)
- Include images in featured image field

#### 5. Links
- Add internal links to related posts
- Include external links to authoritative sources
- Use descriptive anchor text

### Language-Specific SEO

Your blog supports 100+ languages with automatic SEO:

1. **Language Detection**
   - Automatic country detection
   - User language preference stored
   - Hreflang tags for all languages

2. **Language-Specific Keywords**
   - Each language has optimized keywords
   - Locale-specific meta tags
   - Regional content optimization

3. **Multilingual Sitemap**
   - All language variants included
   - Proper locale codes (en_US, es_ES, etc.)
   - Helps Google understand language structure

## Part 4: Monitoring and Maintenance

### Weekly Tasks

1. Check Google Search Console for new errors
2. Review performance metrics
3. Check indexing status of new posts
4. Monitor for crawl errors

### Monthly Tasks

1. Analyze top-performing keywords
2. Review click-through rates
3. Check for ranking improvements
4. Optimize underperforming content

### Quarterly Tasks

1. Audit all posts for SEO compliance
2. Update old content with new keywords
3. Review and improve internal linking
4. Check for broken links

## Part 5: Troubleshooting

### Site Not Appearing in Search Results

1. **Check indexing status**
   - Go to Google Search Console > Coverage
   - Look for errors or warnings

2. **Submit for indexing**
   - Use URL Inspection tool
   - Click "Request indexing"

3. **Check robots.txt**
   - Visit `yourblog.com/robots.txt`
   - Verify it's not blocking your content

4. **Verify sitemap**
   - Visit `yourblog.com/sitemap.xml`
   - Check that posts are included

### Low Search Traffic

1. **Analyze keywords**
   - Use Google Search Console Performance report
   - Check average position
   - Target lower-competition keywords

2. **Improve content**
   - Make content more comprehensive
   - Add more internal links
   - Improve readability

3. **Build backlinks**
   - Share on social media
   - Guest post on other blogs
   - Submit to directories

### Duplicate Content Issues

1. **Check hreflang tags**
   - Verify language alternates are correct
   - Ensure canonical URLs are set

2. **Use Google Search Console**
   - Check for duplicate content warnings
   - Set preferred domain (www vs non-www)

3. **Review language variants**
   - Ensure each language version has unique content
   - Use proper language codes

## Part 6: Advanced SEO Features

### Rich Snippets

Your blog automatically generates:

1. **Article Rich Snippets**
   - Shows publication date
   - Displays author information
   - Includes featured image

2. **Breadcrumb Rich Snippets**
   - Shows page hierarchy
   - Improves SERP appearance
   - Enhances user navigation

### Core Web Vitals

Monitor your site's performance:

1. Go to Google Search Console > Core Web Vitals
2. Check:
   - Largest Contentful Paint (LCP)
   - First Input Delay (FID)
   - Cumulative Layout Shift (CLS)

3. Optimize for better scores:
   - Compress images
   - Minimize JavaScript
   - Use caching

### Mobile Optimization

Your blog is mobile-responsive:

1. Test on mobile devices
2. Use Google Mobile-Friendly Test
3. Check mobile usability in Search Console

## Part 7: Email Notifications

Once configured, you'll receive Google Search Console notifications for:

1. Critical issues (indexing problems, security issues)
2. New sitemaps submitted
3. Significant traffic changes
4. Mobile usability issues

## Checklist

- [ ] Domain set up and verified
- [ ] SSL certificate active (green lock)
- [ ] Google Search Console property created
- [ ] Domain ownership verified
- [ ] Sitemap submitted
- [ ] Robots.txt accessible
- [ ] First post published
- [ ] Sitemap indexed by Google
- [ ] Performance metrics visible
- [ ] Email notifications enabled

## Next Steps

1. Set up your custom domain
2. Verify domain ownership in Google Search Console
3. Submit your sitemap
4. Publish your first blog post
5. Monitor performance in Google Search Console
6. Optimize content based on search data

## Resources

- [Google Search Console Help](https://support.google.com/webmasters)
- [SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Structured Data Testing Tool](https://schema.org/docs/schemas.html)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [PageSpeed Insights](https://pagespeed.web.dev/)

## Support

For domain setup issues:
- Contact your domain registrar for DNS help
- Check Manus documentation for domain configuration

For Google Search Console help:
- Visit [Google Search Central](https://developers.google.com/search)
- Check [Search Console Help Center](https://support.google.com/webmasters)
