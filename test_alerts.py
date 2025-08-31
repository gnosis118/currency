#!/usr/bin/env python3
"""
Test script for the currency alert system
Run this to verify that your alert system is working correctly
"""

import os
import sys
import asyncio
import requests
import json
from datetime import datetime

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

def test_api_endpoints():
    """Test the alert API endpoints"""
    base_url = "http://localhost:8000"
    
    print("🧪 Testing Alert API Endpoints...")
    
    # Test health check
    try:
        response = requests.get(f"{base_url}/alerts/health")
        if response.status_code == 200:
            print("✅ Health check passed")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Health check error: {e}")
    
    # Test status endpoint
    try:
        response = requests.get(f"{base_url}/alerts/status")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Status check passed - {data['active_alerts_count']} active alerts")
            print(f"   Email configured: {data['email_service_configured']}")
        else:
            print(f"❌ Status check failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Status check error: {e}")

def test_email_service():
    """Test the email service configuration"""
    print("\n📧 Testing Email Service...")
    
    try:
        from backend.email_service import email_service
        
        if email_service.sg:
            print("✅ SendGrid client initialized")
            print(f"   From email: {email_service.from_email}")
        else:
            print("❌ SendGrid client not initialized")
            print("   Check SENDGRID_API_KEY environment variable")
    except Exception as e:
        print(f"❌ Email service error: {e}")

def test_database_connection():
    """Test database connection"""
    print("\n🗄️  Testing Database Connection...")
    
    try:
        from backend.alert_monitor import alert_monitor
        
        alerts = alert_monitor.get_active_alerts()
        print(f"✅ Database connection successful")
        print(f"   Found {len(alerts)} active alerts")
        
        if alerts:
            print("   Sample alert currencies:")
            for alert in alerts[:3]:  # Show first 3
                print(f"   - {alert['from_currency']}/{alert['to_currency']}")
    except Exception as e:
        print(f"❌ Database connection error: {e}")

async def test_exchange_rate_api():
    """Test exchange rate API"""
    print("\n💱 Testing Exchange Rate API...")
    
    try:
        import aiohttp
        
        async with aiohttp.ClientSession() as session:
            url = "https://api.exchangerate-api.com/v4/latest/USD"
            async with session.get(url, timeout=10) as response:
                if response.status == 200:
                    data = await response.json()
                    eur_rate = data.get('rates', {}).get('EUR', 'N/A')
                    print(f"✅ Exchange rate API working")
                    print(f"   USD/EUR rate: {eur_rate}")
                else:
                    print(f"❌ Exchange rate API failed: {response.status}")
    except Exception as e:
        print(f"❌ Exchange rate API error: {e}")

def test_environment_variables():
    """Test required environment variables"""
    print("\n🔧 Testing Environment Variables...")
    
    required_vars = {
        'DATABASE_URL': 'Database connection string',
        'SENDGRID_API_KEY': 'SendGrid API key for emails'
    }
    
    optional_vars = {
        'FROM_EMAIL': 'Email address for sending alerts',
        'ALERT_CHECK_INTERVAL': 'How often to check alerts (seconds)',
        'ALERT_COOLDOWN_HOURS': 'Cooldown between notifications'
    }
    
    for var, description in required_vars.items():
        value = os.getenv(var)
        if value:
            # Mask sensitive values
            if 'KEY' in var or 'SECRET' in var:
                masked = value[:8] + '...' if len(value) > 8 else '***'
                print(f"✅ {var}: {masked}")
            else:
                print(f"✅ {var}: {value}")
        else:
            print(f"❌ {var}: Not set ({description})")
    
    print("\n   Optional variables:")
    for var, description in optional_vars.items():
        value = os.getenv(var)
        if value:
            print(f"✅ {var}: {value}")
        else:
            print(f"⚠️  {var}: Not set ({description})")

def send_test_email():
    """Send a test email via API"""
    print("\n📨 Sending Test Email...")
    
    email = input("Enter your email address for testing: ").strip()
    if not email or '@' not in email:
        print("❌ Invalid email address")
        return
    
    try:
        response = requests.post("http://localhost:8000/alerts/test-email", 
            json={
                "email": email,
                "from_currency": "USD",
                "to_currency": "EUR", 
                "target_rate": 0.85,
                "condition": "above"
            },
            timeout=30
        )
        
        if response.status_code == 200:
            print(f"✅ Test email sent to {email}")
            print("   Check your inbox (including spam folder)")
        else:
            print(f"❌ Failed to send test email: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Test email error: {e}")

def main():
    """Main test function"""
    print("=" * 60)
    print("Currency Alert System - Test Suite")
    print(f"Started at: {datetime.now().isoformat()}")
    print("=" * 60)
    
    # Test environment variables first
    test_environment_variables()
    
    # Test database connection
    test_database_connection()
    
    # Test email service
    test_email_service()
    
    # Test exchange rate API
    asyncio.run(test_exchange_rate_api())
    
    # Test API endpoints (requires FastAPI server to be running)
    print("\n🌐 Testing API Endpoints (requires server running)...")
    test_api_endpoints()
    
    # Offer to send test email
    print("\n" + "=" * 60)
    choice = input("Would you like to send a test email? (y/n): ").strip().lower()
    if choice in ['y', 'yes']:
        send_test_email()
    
    print("\n" + "=" * 60)
    print("Test suite completed!")
    print("\nNext steps:")
    print("1. Fix any issues shown above")
    print("2. Start the FastAPI server: uvicorn backend.main:app --reload")
    print("3. Start the alert monitor: python backend/start_alert_monitor.py")
    print("4. Test creating alerts through the web interface")
    print("=" * 60)

if __name__ == "__main__":
    main()
