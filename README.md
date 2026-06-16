# Professional Multilingual Blog Platform

A feature-rich, SEO-optimized blog website with 100+ language support, advanced admin panel, newsletter system, and automated translation capabilities.

## 🌍 Features

### Multilingual Support
- **100+ Languages**: Full support for all major world languages
- **Automatic Country Detection**: IP-based language detection
- **RTL Support**: Arabic, Hebrew, Urdu, Persian, and other RTL languages
- **Language Switching**: Persistent language preferences with localStorage
- **Auto-Translation**: LLM-powered post translation to any language

### Content Management
- **Admin Panel**: Full-featured dashboard for managing posts, analytics, and settings
- **Post Creation**: Rich HTML editor with featured image upload
- **Draft Auto-Save**: Automatic draft saving every 30 seconds
- **Post Status**: Draft, published, and archived states
- **Featured Posts**: Highlight important posts on homepage

### SEO Optimization
- **Dynamic XML Sitemap**: Automatically generated from published posts
- **Robots.txt**: Configurable crawler directives
- **Meta Tags**: Title, description, keywords, Open Graph, Twitter Cards
- **Hreflang Tags**: Language alternate links for all 100+ languages
- **JSON-LD Structured Data**: Article and website schemas
- **Breadcrumb Navigation**: Improved site hierarchy understanding
- **Image Optimization**: Lazy loading, WebP/AVIF formats, responsive images

### Engagement Features
- **Comment System**: Comments with 5-star ratings and approval workflow
- **Social Sharing**: 7 platforms (Facebook, Twitter, LinkedIn, WhatsApp, Telegram, Email, Reddit)
- **Share Metrics**: Track shares and clicks per platform
- **Newsletter Subscription**: Email-based subscriber management
- **Automated Notifications**: Email subscribers on new post publication

### Analytics & Tracking
- **Language Analytics**: Track user engagement by language
- **View Counts**: Monitor post popularity
- **Time Spent**: Measure reader engagement
- **Social Metrics**: Track sharing activity per platform
- **Admin Dashboard**: Comprehensive analytics visualization

### Technical Infrastructure
- **React 19**: Modern frontend framework
- **Tailwind CSS 4**: Utility-first styling
- **Express 4**: Lightweight backend server
- **tRPC 11**: End-to-end type-safe APIs
- **Drizzle ORM**: Type-safe database queries
- **MySQL/TiDB**: Reliable database backend
- **Manus OAuth**: Secure authentication
- **LLM Integration**: AI-powered content generation

## 🚀 Quick Start

### 1. First Blog Post

1. Log in to your blog admin panel
2. Navigate to **Admin Panel** → **Create Post** tab
3. Fill in the post details:
   - **Title**: Your post title
   - **Slug**: URL-friendly version (auto-generated)
   - **Excerpt**: Short summary
   - **Content**: Full post content (HTML supported)
   - **Featured Image**: Upload a cover image
   - **Featured**: Toggle to highlight on homepage
4. Click **Create Post**

### 2. Domain Setup

See [DOMAIN_SETUP_GUIDE.md](./DOMAIN_SETUP_GUIDE.md) for:
- Setting up a custom domain
- Configuring Google Search Console
- SEO optimization tips
- Monitoring search performance

### 3. Newsletter Automation

See [EMAIL_AUTOMATION_GUIDE.md](./EMAIL_AUTOMATION_GUIDE.md) for:
- Setting up email notifications
- Configuring Heartbeat cron jobs
- Monitoring email delivery
- Troubleshooting tips

## 📚 Documentation

### Setup Guides
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Initial setup and configuration
- [DOMAIN_SETUP_GUIDE.md](./DOMAIN_SETUP_GUIDE.md) - Custom domain and SEO setup
- [EMAIL_AUTOMATION_GUIDE.md](./EMAIL_AUTOMATION_GUIDE.md) - Newsletter email automation

### Key Files
- `client/src/pages/AdminPanel.tsx` - Admin dashboard
- `client/src/pages/Home.tsx` - Homepage with featured posts
- `client/src/pages/BlogPost.tsx` - Individual post page
- `server/routers.ts` - tRPC API procedures
- `server/db.ts` - Database query helpers
- `drizzle/schema.ts` - Database schema

## 🎨 Admin Panel Features

### Create Post Tab
- Rich HTML editor for content
- Featured image upload
- Slug auto-generation
- Featured post toggle
- Draft auto-save

### Analytics Tab
- Total views by language
- Language distribution pie chart
- Top languages bar chart
- Engagement statistics
- Key insights and recommendations

### Settings Tab
- Blog title and description
- Email configuration
- Notification preferences

## 🌐 Language Support

Supported languages include:

**European**: English, Spanish, French, German, Italian, Portuguese, Dutch, Swedish, Norwegian, Danish, Finnish, Polish, Czech, Romanian, Greek, Hungarian, Turkish, Russian, Ukrainian, Bulgarian, Croatian, Serbian, Slovak, Slovenian, Lithuanian, Latvian, Estonian, Icelandic, Irish, Welsh

**Asian**: Chinese (Simplified & Traditional), Japanese, Korean, Hindi, Bengali, Tamil, Telugu, Kannada, Malayalam, Marathi, Gujarati, Punjabi, Urdu, Thai, Vietnamese, Indonesian, Malay, Tagalog, Khmer, Lao, Burmese, Sinhala

**Middle Eastern & African**: Arabic, Hebrew, Persian, Turkish, Swahili, Amharic, Yoruba, Igbo, Hausa, Zulu, Xhosa

**Americas**: Portuguese (Brazilian), Spanish (Mexican), French (Canadian), English (American)

**Central Asian**: Kazakh, Uzbek, Turkmen, Kyrgyz

**Caucasus**: Georgian, Armenian, Azerbaijani

**Baltic**: Lithuanian, Latvian, Estonian

## 📊 Database Schema

### Main Tables
- `users` - User accounts and authentication
- `posts` - Blog posts
- `categories` - Post categories
- `tags` - Post tags
- `comments` - Post comments
- `commentRatings` - Comment ratings (1-5 stars)
- `newsletter_subscribers` - Newsletter subscriptions
- `languageAnalytics` - Language usage tracking
- `socialSharingMetrics` - Social share tracking
- `postDrafts` - Auto-saved drafts

## 🔒 Security Features

- **OAuth Authentication**: Manus OAuth for secure login
- **Role-Based Access**: Admin and user roles
- **Admin-Only Operations**: Protected procedures for sensitive actions
- **HTTPS**: SSL/TLS encryption
- **CSRF Protection**: Built-in security headers

## 📈 Performance Optimization

- **Image Optimization**: Lazy loading, WebP/AVIF formats
- **Responsive Design**: Mobile-first approach
- **Code Splitting**: Efficient bundle loading
- **Caching**: Browser and server-side caching
- **CDN**: Manus-provided CDN for static assets

## 🛠️ Development

### Project Structure
```
client/
  src/
    pages/          - Page components
    components/     - Reusable UI components
    lib/           - Utility functions
    contexts/      - React contexts
    hooks/         - Custom hooks
server/
  routers.ts       - tRPC procedures
  db.ts            - Database queries
  *Router.ts       - Feature-specific routers
drizzle/
  schema.ts        - Database schema
  migrations/      - Database migrations
```

### Running Locally
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

### Database Migrations
```bash
# Generate migration from schema changes
pnpm drizzle-kit generate

# Apply migrations
# (Use webdev_execute_sql in Manus UI)
```

## 🚀 Deployment

1. Save a checkpoint in the Management UI
2. Click the **Publish** button
3. Wait for deployment to complete
4. Visit your site at the provided URL

## 📞 Support

For issues or questions:

1. Check the relevant documentation guide
2. Review error messages in browser console
3. Check server logs in `.manus-logs/`
4. Contact support through Manus dashboard

## 📝 License

This project is built with Manus and follows Manus terms of service.

## 🎯 Next Steps

1. **Publish Your First Post**: Use the Admin Panel to create and publish content
2. **Set Up Custom Domain**: Follow DOMAIN_SETUP_GUIDE.md
3. **Configure Google Search Console**: Submit your sitemap for indexing
4. **Set Up Email Automation**: Follow EMAIL_AUTOMATION_GUIDE.md
5. **Monitor Analytics**: Track engagement in the Admin Panel

---

**Built with Manus** - The all-in-one platform for building and deploying web applications.
