# Currency Alert System Setup Guide

This guide will help you set up the price alert system with SendGrid email notifications.

## Prerequisites

1. **SendGrid Account**: Sign up at [sendgrid.com](https://sendgrid.com)
2. **PostgreSQL Database**: For storing alerts (Supabase recommended)
3. **Python 3.8+**: For running the alert monitor service

## Step 1: SendGrid Configuration

1. **Create SendGrid Account**
   - Sign up at https://sendgrid.com
   - Verify your email address
   - Complete the account setup

2. **Create API Key**
   - Go to Settings > API Keys
   - Click "Create API Key"
   - Choose "Restricted Access"
   - Give it a name like "Currency Alerts"
   - Grant the following permissions:
     - Mail Send: Full Access
     - Template Engine: Read Access (optional)
   - Copy the API key (you won't see it again!)

3. **Verify Sender Identity**
   - Go to Settings > Sender Authentication
   - Set up either:
     - Single Sender Verification (easier, for testing)
     - Domain Authentication (recommended for production)
   - Use an email like `alerts@yourdomain.com`

## Step 2: Environment Variables

Create a `.env` file in your backend directory with:

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/currency_alerts

# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key_here
FROM_EMAIL=alerts@yourdomain.com

# Optional: Alert Configuration
ALERT_CHECK_INTERVAL=300  # 5 minutes
ALERT_COOLDOWN_HOURS=1    # Minimum time between notifications
```

## Step 3: Database Setup

1. **Run Migrations**
   ```bash
   # If using Supabase, apply the migration file
   # The migration creates the rate_alerts table with all necessary columns
   ```

2. **Verify Table Structure**
   The `rate_alerts` table should have these columns:
   - `id` (UUID, primary key)
   - `user_id` (UUID, foreign key to auth.users)
   - `from_currency` (TEXT)
   - `to_currency` (TEXT)
   - `target_rate` (DECIMAL)
   - `condition` (TEXT: 'above' or 'below')
   - `email` (TEXT)
   - `is_active` (BOOLEAN)
   - `last_triggered_at` (TIMESTAMP)
   - `last_triggered_rate` (DECIMAL)
   - `trigger_count` (INTEGER)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

## Step 4: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

## Step 5: Test the System

1. **Test Email Service**
   ```bash
   # Start your FastAPI server
   uvicorn main:app --reload

   # Test sending an email (replace with your email)
   curl -X POST "http://localhost:8000/alerts/test-email" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "your-email@example.com",
       "from_currency": "USD",
       "to_currency": "EUR",
       "target_rate": 0.85,
       "condition": "above"
     }'
   ```

2. **Check Alert System Status**
   ```bash
   curl http://localhost:8000/alerts/status
   ```

## Step 6: Start Alert Monitoring

### Option A: Background Service (Recommended for Production)

```bash
cd backend
python start_alert_monitor.py
```

### Option B: Via API (For Testing)

```bash
# Trigger monitoring via API
curl -X POST "http://localhost:8000/alerts/start-monitoring"
```

## Step 7: Create Your First Alert

1. **Via Frontend**
   - Go to `/alerts` page
   - Sign in with your account
   - Create a new alert

2. **Via API**
   ```bash
   # This would be done through your Supabase client in the frontend
   # The alert will be automatically picked up by the monitor
   ```

## Monitoring and Logs

1. **Check Logs**
   ```bash
   tail -f backend/alert_monitor.log
   ```

2. **Monitor System Status**
   ```bash
   curl http://localhost:8000/alerts/status
   ```

3. **View Active Alerts**
   ```bash
   curl http://localhost:8000/alerts/active
   ```

## Deployment Considerations

### Production Deployment

1. **Use Process Manager**
   ```bash
   # Using PM2
   pm2 start backend/start_alert_monitor.py --name "currency-alerts"
   
   # Using systemd (create service file)
   sudo systemctl enable currency-alerts
   sudo systemctl start currency-alerts
   ```

2. **Environment Variables**
   - Set production environment variables
   - Use secrets management for API keys
   - Configure proper logging

3. **Monitoring**
   - Set up health checks
   - Monitor email delivery rates
   - Track alert trigger rates

### Scaling Considerations

- **Multiple Instances**: Use Redis for coordination if running multiple monitor instances
- **Rate Limiting**: Respect exchange rate API limits
- **Email Limits**: Monitor SendGrid usage and limits
- **Database Performance**: Index the `is_active` and `created_at` columns

## Troubleshooting

### Common Issues

1. **Emails Not Sending**
   - Check SendGrid API key
   - Verify sender authentication
   - Check SendGrid activity logs

2. **Alerts Not Triggering**
   - Verify database connection
   - Check exchange rate API availability
   - Review alert monitor logs

3. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check database permissions
   - Ensure migrations are applied

### Debug Commands

```bash
# Test database connection
python -c "from alert_monitor import alert_monitor; print(len(alert_monitor.get_active_alerts()))"

# Test email service
python -c "from email_service import email_service; print(email_service.sg is not None)"

# Check environment variables
python -c "import os; print('SENDGRID_API_KEY' in os.environ)"
```

## Support

If you encounter issues:

1. Check the logs in `backend/alert_monitor.log`
2. Verify all environment variables are set
3. Test individual components (database, email, API)
4. Check SendGrid dashboard for email delivery status

## Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive configuration
- Regularly rotate API keys
- Monitor for unusual email sending patterns
- Implement rate limiting on alert creation endpoints
