# Netlify Environment Variables Setup

## 🔑 Required Environment Variables for Netlify Functions

These environment variables must be set in your Netlify dashboard for the exchange rates API to work properly.

### How to Set Environment Variables in Netlify:

1. Go to your Netlify dashboard: https://app.netlify.com
2. Select your site (currencytocurrency.app)
3. Go to **Site settings** → **Environment variables**
4. Click **Add a variable** for each of the following

---

## 📋 Environment Variables to Configure

### **Option 1: Polygon.io (Recommended for Best Quality)**

```
Variable name: POLYGON_API_KEY
Value: [Your Polygon.io API key]
```

**How to get:**
1. Sign up at https://polygon.io
2. Go to Dashboard → API Keys
3. Copy your API key
4. **Free tier**: 5 API calls/minute
5. **Paid tier**: Higher limits, better for production

---

### **Option 2: OpenExchangeRates (Good Alternative)**

```
Variable name: OPENEXCHANGERATES_APP_ID
Value: [Your OpenExchangeRates App ID]
```

**How to get:**
1. Sign up at https://openexchangerates.org
2. Go to App IDs
3. Copy your App ID
4. **Free tier**: 1,000 requests/month
5. **Paid tier**: Unlimited requests

---

### **Option 3: Currencylayer (Backup)**

```
Variable name: CURRENCYLAYER_API_KEY
Value: [Your Currencylayer API key]
```

**How to get:**
1. Sign up at https://currencylayer.com
2. Go to Dashboard
3. Copy your API Access Key
4. **Free tier**: 1,000 requests/month

---

## 🔄 Fallback Strategy

The system uses a **cascading fallback** approach:

1. **First**: Try Polygon.io (if `POLYGON_API_KEY` is set)
2. **Second**: Try OpenExchangeRates (if `OPENEXCHANGERATES_APP_ID` is set)
3. **Third**: Try Currencylayer (if `CURRENCYLAYER_API_KEY` is set)
4. **Final Fallback**: Use free `open.er-api.com` (no API key needed, but less reliable)

---

## ✅ Recommended Setup

For **production**, set at least **TWO** of these:

```bash
# Primary (best quality)
POLYGON_API_KEY=your_polygon_key_here

# Backup (good quality)
OPENEXCHANGERATES_APP_ID=your_openexchange_app_id_here
```

This ensures:
- ✅ High-quality rates from Polygon.io
- ✅ Automatic fallback if Polygon.io fails
- ✅ Better uptime and reliability

---

## 🧪 Testing After Setup

After setting environment variables in Netlify:

1. **Redeploy your site** (environment variables only apply after deployment)
2. **Test the API** by visiting:
   ```
   https://currencytocurrency.app/.netlify/functions/polygon-rates?from=USD&to=EUR&amount=100
   ```
3. **Check the response** - it should show:
   ```json
   {
     "provider": "polygon.io",
     "rate": 0.92,
     "converted": 92.00,
     "cached": false,
     "timestamp": 1234567890
   }
   ```

---

## 🚨 Current Status

**Exchange Rates API Error**: The API is currently failing because no API keys are configured in Netlify.

**To Fix**:
1. Set at least one of the API keys above in Netlify
2. Redeploy the site
3. Test the API endpoint

---

## 📊 API Provider Comparison

| Provider | Free Tier | Update Frequency | Quality | Best For |
|----------|-----------|------------------|---------|----------|
| **Polygon.io** | 5 calls/min | Real-time | ⭐⭐⭐⭐⭐ | Production |
| **OpenExchangeRates** | 1K/month | Hourly | ⭐⭐⭐⭐ | Medium traffic |
| **Currencylayer** | 1K/month | Hourly | ⭐⭐⭐ | Backup |
| **open.er-api.com** | Unlimited | Daily | ⭐⭐ | Development only |

---

## 🔐 Security Notes

- ✅ Environment variables are **secure** in Netlify
- ✅ They are **NOT exposed** to the frontend
- ✅ Only Netlify Functions can access them
- ❌ **Never commit** API keys to Git
- ❌ **Never expose** them in frontend code

---

## 📝 After Setup Checklist

- [ ] Set at least one API key in Netlify environment variables
- [ ] Redeploy the site from Netlify dashboard
- [ ] Test the `/polygon-rates` endpoint
- [ ] Test the `/convert` endpoint
- [ ] Verify currency converter works on the site
- [ ] Check browser console for any errors

---

## 🆘 Troubleshooting

### Error: "Polygon API key not configured"
**Solution**: Set `POLYGON_API_KEY` in Netlify environment variables and redeploy

### Error: "Rate unavailable"
**Solution**: Check that at least one API provider is configured correctly

### Error: "Failed to fetch exchange rates"
**Solution**: 
1. Check API key is valid
2. Check API provider status
3. Check Netlify function logs for details

---

## 📞 Support

If you need help:
1. Check Netlify function logs: Site → Functions → View logs
2. Check browser console for errors
3. Test API endpoints directly in browser
4. Verify environment variables are set correctly

