# 🚨 Alert System Fix Guide

## 📊 **CURRENT STATUS**
- ✅ SendGrid API Key: **WORKING** (New key is valid)
- ❌ Sender Identity: **NOT VERIFIED** (Critical issue)
- ❌ Database: **CONNECTION FAILED** (Password issue)
- ✅ Exchange Rate API: **WORKING**
- ✅ Alert Logic: **WORKING**
- ✅ Email Templates: **WORKING**

## 🔧 **IMMEDIATE FIXES NEEDED**

### **Fix 1: Verify SendGrid Sender Identity (CRITICAL)**

**Problem**: `alerts@currencytocurrency.app` is not verified in SendGrid

**Steps to Fix:**
1. **Go to SendGrid Dashboard**: https://app.sendgrid.com
2. **Navigate to**: Settings → Sender Authentication → Single Sender Verification
3. **Add New Sender**: 
   - **From Email**: `alerts@currencytocurrency.app`
   - **From Name**: `Currency Alerts`
   - **Reply To**: `alerts@currencytocurrency.app`
   - **Company**: `Currency to Currency`
   - **Address**: Your business address
4. **Verify Email**: Check your email and click verification link
5. **Test**: Once verified, emails will work

**Alternative (Quick Fix)**:
- Use your personal verified email temporarily
- Update `.env` file: `FROM_EMAIL=your-verified-email@domain.com`

### **Fix 2: Fix Database Connection (CRITICAL)**

**Problem**: Supabase password authentication failed

**Steps to Fix:**
1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select Your Project**: `qxawgxxuihjtpgupcfpg` or `vreqlkcjhjquvfiuuryv`
3. **Go to**: Settings → Database
4. **Reset Database Password**:
   - Click "Reset database password"
   - Set new password (save it securely!)
   - Update `backend/.env` with new password

**Current Connection String**:
```
DATABASE_URL=postgresql://postgres:NEW_PASSWORD_HERE@db.vreqlkcjhjquvfiuuryv.supabase.co:5432/postgres
```

### **Fix 3: Create Database Tables**

Once database connection works, create the alerts table:

```sql
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    from_currency VARCHAR(3) NOT NULL,
    to_currency VARCHAR(3) NOT NULL,
    target_rate DECIMAL(10, 6) NOT NULL,
    condition VARCHAR(10) NOT NULL CHECK (condition IN ('above', 'below')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_triggered TIMESTAMP,
    trigger_count INTEGER DEFAULT 0
);

CREATE INDEX idx_alerts_active ON alerts(is_active);
CREATE INDEX idx_alerts_currency_pair ON alerts(from_currency, to_currency);
```

## 🧪 **TESTING STEPS**

### **Step 1: Test SendGrid After Verification**
```bash
python test_sendgrid_simple.py
```
**Expected**: ✅ Both API validation and email sending should work

### **Step 2: Test Database After Password Reset**
```bash
python test_alert_system.py
```
**Expected**: ✅ All 6 tests should pass

### **Step 3: Test Full Alert System**
```bash
# Start backend server
cd backend
python -m uvicorn main:app --reload --port 8000

# In another terminal, test alert creation
curl -X POST "http://localhost:8000/alerts/" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "from_currency": "USD",
    "to_currency": "EUR", 
    "target_rate": 0.85,
    "condition": "below"
  }'
```

## 🚀 **ONCE FIXED - HOW TO USE ALERTS**

### **Frontend Integration**
The alerts page at `/alerts` should work properly and allow users to:
1. ✅ Create new currency alerts
2. ✅ View existing alerts  
3. ✅ Delete alerts
4. ✅ Receive email notifications

### **Backend Monitoring**
Start the alert monitoring service:
```bash
cd backend
python alert_monitor.py
```

This will:
- ✅ Check exchange rates every 5 minutes
- ✅ Send emails when alerts trigger
- ✅ Prevent spam with cooldown periods
- ✅ Log all activity

## 📧 **EMAIL TEMPLATE PREVIEW**

Once working, users will receive emails like:

```
Subject: Currency Alert: USD/EUR Rate Alert

🚨 Currency Alert Triggered!

Your currency alert has been triggered:

• Currency Pair: USD/EUR
• Target Rate: 0.8500
• Current Rate: 0.8480
• Condition: below

The current rate is now below your target rate.

Visit currencytocurrency.app to manage your alerts.

Best regards,
Currency to Currency Team
```

## 🔍 **TROUBLESHOOTING**

### **If SendGrid Still Fails:**
- Check sender identity verification status
- Ensure domain authentication (optional but recommended)
- Verify API key has `mail.send` permission

### **If Database Still Fails:**
- Try connecting with a database client (pgAdmin, DBeaver)
- Check if IP is whitelisted in Supabase
- Verify project URL and credentials

### **If Alerts Don't Trigger:**
- Check alert_monitor.py is running
- Verify exchange rate API is working
- Check database for alert records
- Review logs for errors

## 📈 **EXPECTED PERFORMANCE**

Once fixed, the alert system will:
- ⚡ **Response Time**: < 2 seconds for alert creation
- 📧 **Email Delivery**: < 30 seconds via SendGrid
- 🔄 **Monitoring Frequency**: Every 5 minutes
- 📊 **Reliability**: 99.9% uptime (depends on external APIs)

## 🎯 **PRIORITY ORDER**

1. **URGENT**: Fix SendGrid sender verification (blocks all emails)
2. **URGENT**: Fix database password (blocks all data storage)
3. **MEDIUM**: Create database tables (needed for production)
4. **LOW**: Start monitoring service (for automated alerts)

**Estimated Fix Time**: 15-30 minutes total

---

**Once these fixes are complete, your alert system will be fully operational and ready for users!**
