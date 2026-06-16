# Email Automation Guide - Newsletter Notifications

## Overview

This guide explains how to set up automated email notifications that send to newsletter subscribers whenever a new blog post is published.

## Architecture

The system uses **Heartbeat Cron** (HTTP-based scheduled jobs) to trigger email notifications. When a new post is published, the cron job:

1. Fetches the latest published post
2. Retrieves all active newsletter subscribers
3. Generates personalized email content using LLM
4. Sends emails to all subscribers
5. Logs the results

## Components

### 1. Newsletter Email Handler (`server/newsletterEmailHandler.ts`)

The main handler that processes email notifications:

- **Endpoint**: `/api/scheduled/newsletter-email`
- **Authentication**: Cron-only (verified via `sdk.authenticateRequest`)
- **Function**: Sends emails to all active subscribers for the latest published post

Key features:
- LLM-generated email content for personalization
- Manus built-in notification API for email delivery
- Error handling and retry logic
- Owner notifications on completion

### 2. Newsletter Router (`server/newsletterRouter.ts`)

Provides tRPC procedures for newsletter management:

- `subscribe` - Add new subscriber
- `unsubscribe` - Remove subscriber
- `getSubscribers` - Admin query for all subscribers
- `getStats` - Admin query for subscription statistics

### 3. Database Schema

Newsletter subscribers table:
```sql
CREATE TABLE newsletter_subscribers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(320) UNIQUE NOT NULL,
  name TEXT,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP NULL,
  is_active INT DEFAULT 1,
  language VARCHAR(10) DEFAULT 'en',
  preferences VARCHAR(50) DEFAULT 'all'
);
```

## Setup Instructions

### Step 1: Deploy the Site

Before creating any scheduled jobs, you must deploy the site to production:

1. Save a checkpoint of your current work
2. Click the **Publish** button in the Management UI
3. Wait for deployment to complete
4. Verify the site is accessible at your custom domain

### Step 2: Create the Heartbeat Cron Job

Once deployed, create the scheduled job using the CLI:

```bash
manus-heartbeat create \
  --name newsletter-email-notification \
  --cron "0 0 9 * * *" \
  --path /api/scheduled/newsletter-email \
  --description "Send newsletter emails to subscribers on new posts"
```

**Cron Expression Breakdown**: `0 0 9 * * *`
- `0` - Seconds (always 0)
- `0` - Minutes (0)
- `9` - Hours (9 AM UTC)
- `*` - Day of month (every day)
- `*` - Month (every month)
- `*` - Day of week (every day)

**Adjust the time as needed:**
- `0 0 6 * * *` - 6 AM UTC (2 PM IST)
- `0 0 12 * * *` - 12 PM UTC (5:30 PM IST)
- `0 0 18 * * *` - 6 PM UTC (11:30 PM IST)

### Step 3: Verify the Job

List all scheduled jobs:

```bash
manus-heartbeat list
```

Check execution history:

```bash
manus-heartbeat logs --task-uid <task_uid> --with-body
```

## Email Content Generation

The system uses the Manus LLM API to generate personalized email content:

1. **System Prompt**: Instructs the LLM to create professional, engaging email marketing content
2. **User Prompt**: Provides post details (title, excerpt, content preview, URL)
3. **Output**: Clean HTML email with:
   - Warm greeting
   - Post headline
   - Content summary
   - Call-to-action button
   - Unsubscribe link

## Email Delivery

The system uses Manus built-in notification API for email delivery:

- **Endpoint**: `$BUILT_IN_FORGE_API_URL/v1/notification/send-email`
- **Authentication**: Bearer token via `$BUILT_IN_FORGE_API_KEY`
- **Features**:
  - Automatic retry on failure
  - Bounce handling
  - Delivery tracking
  - Rate limiting

## Monitoring and Troubleshooting

### Check Job Status

```bash
# List all jobs
manus-heartbeat list

# View recent execution logs
manus-heartbeat logs --task-uid <task_uid>

# View failed executions
manus-heartbeat logs --task-uid <task_uid> --status failed

# View specific execution
manus-heartbeat logs --task-uid <task_uid> --run-uid <run_uid> --with-body
```

### Common Issues

**Issue**: No emails sent
- **Solution**: Check that subscribers exist (`trpc.newsletter.getStats`)
- **Solution**: Verify a post was published recently
- **Solution**: Check job logs for errors

**Issue**: Job not running
- **Solution**: Verify job is enabled: `manus-heartbeat list`
- **Solution**: Check if site is deployed and accessible
- **Solution**: Verify the cron expression is correct

**Issue**: Emails not received
- **Solution**: Check subscriber email is correct
- **Solution**: Verify email isn't in spam folder
- **Solution**: Check job logs for delivery errors

### Manual Testing

To test email sending without waiting for the scheduled job:

```bash
# Run the job immediately
manus-heartbeat logs --task-uid <task_uid> --run-now
```

## Customization

### Change Email Frequency

Edit the cron expression:

```bash
manus-heartbeat update \
  --task-uid <task_uid> \
  --cron "0 0 6 * * *"  # New time: 6 AM UTC
```

### Pause/Resume Emails

Pause sending:
```bash
manus-heartbeat update --task-uid <task_uid> --enable=false
```

Resume sending:
```bash
manus-heartbeat update --task-uid <task_uid> --enable=true
```

### Delete the Job

```bash
manus-heartbeat delete --task-uid <task_uid>
```

## Advanced Configuration

### Environment Variables

The email handler uses these environment variables:

- `BUILT_IN_FORGE_API_URL` - Manus API base URL (auto-set)
- `BUILT_IN_FORGE_API_KEY` - Manus API key (auto-set)
- `VITE_APP_URL` - Your blog's public URL (used in email links)
- `OWNER_EMAIL` - Reply-to email address (optional)

### Subscriber Preferences

The system supports language and preference tracking:

```typescript
// Subscribe with preferences
await trpc.newsletter.subscribe.mutate({
  email: "user@example.com",
  name: "John Doe",
  language: "en",
  preferences: "all"  // or "weekly", "monthly", etc.
});
```

### Email Templates

To customize email templates, modify the `generateEmailContent` function in `server/newsletterEmailHandler.ts`:

1. Update the system prompt for different email style
2. Modify the fallback HTML template
3. Add custom styling or branding

## Integration with Admin Panel

The Admin Panel includes newsletter management:

1. **Newsletter Tab**: View subscriber count and statistics
2. **Subscribe Form**: Footer newsletter subscription form
3. **Unsubscribe Link**: Included in all emails

## Best Practices

1. **Test Before Production**: Run the job manually first to verify emails are sent correctly
2. **Monitor Delivery**: Check logs regularly for failed deliveries
3. **Respect Subscriber Preferences**: Honor language and frequency preferences
4. **Include Unsubscribe**: Always include unsubscribe links (automatically included)
5. **Avoid Spam**: Don't send too frequently (daily is reasonable)
6. **Use Descriptive Subject Lines**: Help emails get past spam filters

## Troubleshooting Checklist

- [ ] Site is deployed and accessible
- [ ] Newsletter subscribers exist in database
- [ ] Blog posts are published (not in draft)
- [ ] Heartbeat job is created and enabled
- [ ] Job execution logs show success (check `manus-heartbeat logs`)
- [ ] Subscriber emails are valid
- [ ] Check spam folder for emails
- [ ] Verify `BUILT_IN_FORGE_API_KEY` is set correctly

## Support

For issues or questions:

1. Check job logs: `manus-heartbeat logs --task-uid <task_uid> --with-body`
2. Verify subscriber data: `trpc.newsletter.getStats`
3. Test email sending manually
4. Review error messages in logs

## Next Steps

1. Deploy your site
2. Create the Heartbeat cron job
3. Publish your first blog post
4. Monitor the next scheduled run
5. Verify subscribers receive emails
6. Adjust timing or content as needed
