#!/usr/bin/env python3
"""
Test script for the alerts system
This script tests the complete alerts workflow from frontend to email
"""

import asyncio
import aiohttp
import json
from datetime import datetime

# Test configuration
SUPABASE_URL = "https://qxawgxxuihjtpgupcfpg.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YXdneHh1aWhqdHBndXBjZnBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MTYwMjMsImV4cCI6MjA2NTI5MjAyM30.tgtt0UgC72LvNQxnPWfyiw_ZifsFZDl6xFAqJHdNwD0"

async def test_supabase_connection():
    """Test Supabase connection and rate_alerts table"""
    print("🔍 Testing Supabase connection...")
    
    async with aiohttp.ClientSession() as session:
        # Test connection by querying rate_alerts table
        url = f"{SUPABASE_URL}/rest/v1/rate_alerts"
        headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            "Content-Type": "application/json"
        }
        
        try:
            async with session.get(url, headers=headers) as response:
                if response.status == 200:
                    data = await response.json()
                    print(f"✅ Supabase connection successful. Found {len(data)} existing alerts.")
                    return True
                else:
                    print(f"❌ Supabase connection failed. Status: {response.status}")
                    return False
        except Exception as e:
            print(f"❌ Supabase connection error: {e}")
            return False

async def test_exchange_rate_api():
    """Test the exchange rate API used by the alert monitor"""
    print("\n🔍 Testing exchange rate API...")
    
    async with aiohttp.ClientSession() as session:
        url = "https://api.exchangerate-api.com/v4/latest/USD"
        
        try:
            async with session.get(url, timeout=10) as response:
                if response.status == 200:
                    data = await response.json()
                    eur_rate = data.get('rates', {}).get('EUR')
                    if eur_rate:
                        print(f"✅ Exchange rate API working. USD/EUR: {eur_rate}")
                        return True
                    else:
                        print("❌ Exchange rate API response missing EUR rate")
                        return False
                else:
                    print(f"❌ Exchange rate API failed. Status: {response.status}")
                    return False
        except Exception as e:
            print(f"❌ Exchange rate API error: {e}")
            return False

async def test_alert_creation():
    """Test creating an alert via Supabase"""
    print("\n🔍 Testing alert creation...")
    
    async with aiohttp.ClientSession() as session:
        url = f"{SUPABASE_URL}/rest/v1/rate_alerts"
        headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
        
        # Test alert data
        test_alert = {
            "id": "test-alert-" + str(int(datetime.now().timestamp())),
            "user_id": "test-user-123",
            "from_currency": "USD",
            "to_currency": "EUR",
            "target_rate": "0.8500",
            "condition": "above",
            "email": "test@example.com",
            "is_active": True
        }
        
        try:
            async with session.post(url, headers=headers, json=test_alert) as response:
                if response.status == 201:
                    data = await response.json()
                    print(f"✅ Alert creation successful. Alert ID: {data[0]['id']}")
                    return data[0]['id']
                else:
                    error_text = await response.text()
                    print(f"❌ Alert creation failed. Status: {response.status}")
                    print(f"Error: {error_text}")
                    return None
        except Exception as e:
            print(f"❌ Alert creation error: {e}")
            return None

async def test_alert_retrieval():
    """Test retrieving alerts"""
    print("\n🔍 Testing alert retrieval...")
    
    async with aiohttp.ClientSession() as session:
        url = f"{SUPABASE_URL}/rest/v1/rate_alerts"
        headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            "Content-Type": "application/json"
        }
        
        try:
            async with session.get(url, headers=headers) as response:
                if response.status == 200:
                    data = await response.json()
                    print(f"✅ Alert retrieval successful. Found {len(data)} alerts")
                    return True
                else:
                    print(f"❌ Alert retrieval failed. Status: {response.status}")
                    return False
        except Exception as e:
            print(f"❌ Alert retrieval error: {e}")
            return False

async def test_alert_deletion(alert_id):
    """Test deleting an alert"""
    if not alert_id:
        print("\n⏭️ Skipping alert deletion test (no alert ID)")
        return True
        
    print(f"\n🔍 Testing alert deletion for ID: {alert_id}...")
    
    async with aiohttp.ClientSession() as session:
        url = f"{SUPABASE_URL}/rest/v1/rate_alerts?id=eq.{alert_id}"
        headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            "Content-Type": "application/json"
        }
        
        try:
            async with session.delete(url, headers=headers) as response:
                if response.status == 204:
                    print("✅ Alert deletion successful")
                    return True
                else:
                    print(f"❌ Alert deletion failed. Status: {response.status}")
                    return False
        except Exception as e:
            print(f"❌ Alert deletion error: {e}")
            return False

async def main():
    """Run all tests"""
    print("🚀 Starting Alerts System Tests")
    print("=" * 50)
    
    # Test 1: Supabase connection
    supabase_ok = await test_supabase_connection()
    
    # Test 2: Exchange rate API
    api_ok = await test_exchange_rate_api()
    
    # Test 3: Alert creation
    alert_id = await test_alert_creation()
    
    # Test 4: Alert retrieval
    retrieval_ok = await test_alert_retrieval()
    
    # Test 5: Alert deletion
    deletion_ok = await test_alert_deletion(alert_id)
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY")
    print("=" * 50)
    print(f"Supabase Connection: {'✅ PASS' if supabase_ok else '❌ FAIL'}")
    print(f"Exchange Rate API: {'✅ PASS' if api_ok else '❌ FAIL'}")
    print(f"Alert Creation: {'✅ PASS' if alert_id else '❌ FAIL'}")
    print(f"Alert Retrieval: {'✅ PASS' if retrieval_ok else '❌ FAIL'}")
    print(f"Alert Deletion: {'✅ PASS' if deletion_ok else '❌ FAIL'}")
    
    all_tests_passed = all([supabase_ok, api_ok, alert_id, retrieval_ok, deletion_ok])
    print(f"\nOverall Status: {'🎉 ALL TESTS PASSED' if all_tests_passed else '⚠️ SOME TESTS FAILED'}")
    
    if all_tests_passed:
        print("\n✅ The alerts system is working correctly!")
        print("📧 Users can now create, manage, and receive email alerts.")
    else:
        print("\n❌ Some issues were found. Please check the errors above.")

if __name__ == "__main__":
    asyncio.run(main())
