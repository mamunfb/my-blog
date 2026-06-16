# Heartbeat Cron Job Setup - Quick Reference

## Prerequisites

✅ Blog is deployed and published (click Publish button in Management UI)
✅ At least one blog post is published
✅ Newsletter subscribers exist (or will be added later)

## Step 1: Deploy Your Blog

Before creating the cron job, you must deploy:

1. Open your blog in the Management UI
2. Click the **Publish** button (top right)
3. Wait for deployment to complete (2-5 minutes)
4. Verify the site is accessible at your domain

## Step 2: Create the Heartbeat Cron Job

Open your terminal and run:

```bash
manus-heartbeat create \
  --name newsletter-email-notification \
  --cron "0 0 9 * * *" \
  --path /api/scheduled/newsletter-email \
  --description "Send newsletter emails to subscribers on new posts"
```

### Cron Expression Explained: `0 0 9 * * *`

| Field | Value | Meaning |
|-------|-------|---------|
| Seconds | 0 | Always 0 |
| Minutes | 0 | 0 minutes (top of hour) |
| Hours | 9 | 9 AM UTC |
| Day of Month | * | Every day |
| Month | * | Every month |
| Day of Week | * | Every day of week |

**Result:** Runs every day at 9:00 AM UTC

### Alternative Times

- **6 AM UTC** (2 PM IST): `0 0 6 * * *`
- **12 PM UTC** (5:30 PM IST): `0 0 12 * * *`
- **6 PM UTC** (11:30 PM IST): `0 0 18 * * *`
- **Twice daily** (9 AM & 6 PM UTC): Create two jobs with different times

## Step 3: Verify Job Creation

List all scheduled jobs:

```bash
manus-heartbeat list
```

You should see:
- Job name: `newsletter-email-notification`
- Status: `enabled`
- Next run time
- Cron expression: `0 0 9 * * *`

## Step 4: Check Execution Logs

After the first scheduled run (or manually trigger):

```bash
# View recent executions
manus-heartbeat logs --task-uid <task_uid>

# View with full response body
manus-heartbeat logs --task-uid <task_uid> --with-body

# View only failed executions
manus-heartbeat logs --task-uid <task_uid> --status failed
```

## Step 5: Manual Testing (Optional)

To test immediately without waiting for scheduled time:

```bash
# Trigger the job now
manus-heartbeat logs --task-uid <task_uid> --run-now
```

Check the logs to verify:
- ✅ Job executed successfully
- ✅ Emails were sent to subscribers
- ✅ Owner notification received

## Troubleshooting

### Job Not Running

**Check 1:** Is the job enabled?
```bash
manus-heartbeat list
# Look for status: enabled
```

**Check 2:** Is the blog deployed?
- Verify site is accessible at your domain
- Check Management UI > Dashboard

**Check 3:** Are there subscribers?
```bash
# From your blog admin panel
# Go to Analytics tab to check subscriber count
```

### Emails Not Received

**Check 1:** View job logs
```bash
manus-heartbeat logs --task-uid <task_uid> --with-body
```

**Check 2:** Check subscriber email addresses
- Verify emails are valid
- Check for typos

**Check 3:** Check spam folder
- Emails might be in spam
- Add blog domain to email whitelist

### Job Execution Failed

**View error details:**
```bash
manus-heartbeat logs --task-uid <task_uid> --with-body --status failed
```

**Common errors:**
- `ECONNREFUSED` - Blog not deployed or not accessible
- `404` - Endpoint not found (verify deployment)
- `500` - Server error (check blog logs)

## Managing the Job

### Pause Emails

```bash
manus-heartbeat update --task-uid <task_uid> --enable=false
```

### Resume Emails

```bash
manus-heartbeat update --task-uid <task_uid> --enable=true
```

### Change Schedule

```bash
# Change to 6 AM UTC
manus-heartbeat update --task-uid <task_uid> --cron "0 0 6 * * *"
```

### Delete Job

```bash
manus-heartbeat delete --task-uid <task_uid>
```

## Email Content

The system automatically generates personalized emails:

1. **Subject:** "New Post: [Post Title]"
2. **Greeting:** "Hi [Subscriber Name],"
3. **Content:** LLM-generated summary of the post
4. **CTA Button:** "Read Full Post"
5. **Unsubscribe Link:** Included for compliance

## Monitoring Dashboard

To view all scheduled jobs and their status:

```bash
manus-heartbeat list --format=table
```

Shows:
- Job name
- Status (enabled/disabled)
- Cron expression
- Last run time
- Next run time
- Execution count

## Best Practices

1. **Test Before Production**
   - Manually trigger the job first
   - Verify emails are formatted correctly
   - Check that links work

2. **Monitor Regularly**
   - Check logs weekly
   - Monitor email delivery rates
   - Track subscriber engagement

3. **Adjust Timing**
   - Choose a time when subscribers are most active
   - Consider time zones
   - Avoid early morning or late night

4. **Maintain Subscriber List**
   - Remove inactive subscribers
   - Honor unsubscribe requests
   - Keep email list clean

5. **Respect Frequency**
   - Don't send too often (daily is reasonable)
   - Consider subscriber preferences
   - Avoid email fatigue

## Next Steps

1. ✅ Deploy your blog
2. ✅ Create the Heartbeat cron job
3. ✅ Verify job is running
4. ✅ Monitor first execution
5. ✅ Adjust as needed

---

**Need help?** Check EMAIL_AUTOMATION_GUIDE.md for detailed troubleshooting and advanced configuration.
