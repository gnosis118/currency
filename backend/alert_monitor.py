import asyncio
import aiohttp
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from email_service import email_service

logger = logging.getLogger(__name__)

class AlertMonitor:
    def __init__(self):
        self.database_url = os.getenv('DATABASE_URL', 'postgresql://postgres:password@localhost:5432/currency_alerts')
        self.engine = create_engine(self.database_url)
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        self.exchange_api_url = "https://api.exchangerate-api.com/v4/latest"
        self.check_interval = 300  # 5 minutes
        self.last_notification_times = {}  # Track to prevent spam
        
    async def start_monitoring(self):
        """Start the continuous monitoring loop"""
        logger.info("Starting price alert monitoring...")
        
        while True:
            try:
                await self.check_all_alerts()
                await asyncio.sleep(self.check_interval)
            except Exception as e:
                logger.error(f"Error in monitoring loop: {str(e)}")
                await asyncio.sleep(60)  # Wait 1 minute before retrying
    
    async def check_all_alerts(self):
        """Check all active alerts and send notifications if triggered"""
        try:
            # Get all active alerts from database
            alerts = self.get_active_alerts()
            
            if not alerts:
                logger.debug("No active alerts to check")
                return
            
            logger.info(f"Checking {len(alerts)} active alerts...")
            
            # Group alerts by currency pair to minimize API calls
            currency_pairs = {}
            for alert in alerts:
                pair_key = f"{alert['from_currency']}-{alert['to_currency']}"
                if pair_key not in currency_pairs:
                    currency_pairs[pair_key] = []
                currency_pairs[pair_key].append(alert)
            
            # Check each currency pair
            async with aiohttp.ClientSession() as session:
                for pair_key, pair_alerts in currency_pairs.items():
                    await self.check_currency_pair_alerts(session, pair_key, pair_alerts)
                    
        except Exception as e:
            logger.error(f"Error checking alerts: {str(e)}")
    
    async def check_currency_pair_alerts(self, session: aiohttp.ClientSession, pair_key: str, alerts: List[Dict]):
        """Check alerts for a specific currency pair"""
        try:
            from_currency, to_currency = pair_key.split('-')
            
            # Fetch current exchange rate
            current_rate = await self.get_exchange_rate(session, from_currency, to_currency)
            
            if current_rate is None:
                logger.warning(f"Could not fetch rate for {pair_key}")
                return
            
            logger.debug(f"Current rate for {pair_key}: {current_rate}")
            
            # Check each alert for this pair
            for alert in alerts:
                await self.check_individual_alert(alert, current_rate)
                
        except Exception as e:
            logger.error(f"Error checking alerts for {pair_key}: {str(e)}")
    
    async def check_individual_alert(self, alert: Dict, current_rate: float):
        """Check if an individual alert should be triggered"""
        try:
            alert_id = alert['id']
            target_rate = float(alert['target_rate'])
            condition = alert['condition']
            email = alert['email']
            
            # Check if alert condition is met
            should_trigger = False
            
            if condition == 'above' and current_rate >= target_rate:
                should_trigger = True
            elif condition == 'below' and current_rate <= target_rate:
                should_trigger = True
            
            if should_trigger:
                # Check if we've already sent a notification recently (prevent spam)
                last_notification = self.last_notification_times.get(alert_id)
                if last_notification and datetime.now() - last_notification < timedelta(hours=1):
                    logger.debug(f"Skipping notification for alert {alert_id} - too recent")
                    return
                
                # Send notification
                await self.send_alert_notification(alert, current_rate)
                
                # Update last notification time
                self.last_notification_times[alert_id] = datetime.now()
                
                # Update alert in database (mark as triggered, increment counter)
                self.update_alert_triggered(alert_id, current_rate)
                
                logger.info(f"Alert {alert_id} triggered and notification sent to {email}")
            
        except Exception as e:
            logger.error(f"Error checking individual alert {alert.get('id')}: {str(e)}")
    
    async def send_alert_notification(self, alert: Dict, current_rate: float):
        """Send email notification for triggered alert"""
        try:
            alert_data = {
                'from_currency': alert['from_currency'],
                'to_currency': alert['to_currency'],
                'target_rate': float(alert['target_rate']),
                'current_rate': current_rate,
                'condition': alert['condition'],
                'alert_id': alert['id']
            }
            
            success = email_service.send_price_alert(alert['email'], alert_data)
            
            if success:
                logger.info(f"Email notification sent successfully for alert {alert['id']}")
            else:
                logger.error(f"Failed to send email notification for alert {alert['id']}")
                
        except Exception as e:
            logger.error(f"Error sending notification for alert {alert.get('id')}: {str(e)}")
    
    async def get_exchange_rate(self, session: aiohttp.ClientSession, from_currency: str, to_currency: str) -> Optional[float]:
        """Fetch current exchange rate from API"""
        try:
            url = f"{self.exchange_api_url}/{from_currency}"
            
            async with session.get(url, timeout=10) as response:
                if response.status == 200:
                    data = await response.json()
                    rates = data.get('rates', {})
                    return rates.get(to_currency)
                else:
                    logger.warning(f"API request failed with status {response.status}")
                    return None
                    
        except asyncio.TimeoutError:
            logger.warning(f"Timeout fetching rate for {from_currency}/{to_currency}")
            return None
        except Exception as e:
            logger.error(f"Error fetching exchange rate: {str(e)}")
            return None
    
    def get_active_alerts(self) -> List[Dict]:
        """Get all active alerts from the database"""
        try:
            with self.SessionLocal() as db:
                query = text("""
                    SELECT id, user_id, from_currency, to_currency, target_rate, 
                           condition, email, is_active, created_at, updated_at
                    FROM rate_alerts 
                    WHERE is_active = true
                    ORDER BY created_at DESC
                """)
                
                result = db.execute(query)
                alerts = []
                
                for row in result:
                    alerts.append({
                        'id': str(row.id),
                        'user_id': str(row.user_id),
                        'from_currency': row.from_currency,
                        'to_currency': row.to_currency,
                        'target_rate': row.target_rate,
                        'condition': row.condition,
                        'email': row.email,
                        'is_active': row.is_active,
                        'created_at': row.created_at,
                        'updated_at': row.updated_at
                    })
                
                return alerts
                
        except Exception as e:
            logger.error(f"Error fetching active alerts: {str(e)}")
            return []
    
    def update_alert_triggered(self, alert_id: str, current_rate: float):
        """Update alert in database when triggered"""
        try:
            with self.SessionLocal() as db:
                # Update the alert with last triggered time and current rate
                query = text("""
                    UPDATE rate_alerts 
                    SET updated_at = :now,
                        last_triggered_at = :now,
                        last_triggered_rate = :rate
                    WHERE id = :alert_id
                """)
                
                db.execute(query, {
                    'now': datetime.now(),
                    'rate': current_rate,
                    'alert_id': alert_id
                })
                db.commit()
                
        except Exception as e:
            logger.error(f"Error updating alert {alert_id}: {str(e)}")
    
    async def send_daily_summaries(self):
        """Send daily summary emails to users with active alerts"""
        try:
            # Get users with active alerts
            users_with_alerts = self.get_users_with_active_alerts()
            
            for user_email, alerts in users_with_alerts.items():
                # Fetch current rates for all user's alerts
                alerts_with_rates = []
                
                async with aiohttp.ClientSession() as session:
                    for alert in alerts:
                        current_rate = await self.get_exchange_rate(
                            session, 
                            alert['from_currency'], 
                            alert['to_currency']
                        )
                        
                        alert_with_rate = alert.copy()
                        alert_with_rate['current_rate'] = current_rate or 0
                        alerts_with_rates.append(alert_with_rate)
                
                # Send summary email
                success = email_service.send_daily_summary(user_email, alerts_with_rates)
                
                if success:
                    logger.info(f"Daily summary sent to {user_email}")
                else:
                    logger.error(f"Failed to send daily summary to {user_email}")
                    
        except Exception as e:
            logger.error(f"Error sending daily summaries: {str(e)}")
    
    def get_users_with_active_alerts(self) -> Dict[str, List[Dict]]:
        """Get users grouped by email with their active alerts"""
        try:
            with self.SessionLocal() as db:
                query = text("""
                    SELECT email, from_currency, to_currency, target_rate, 
                           condition, is_active, created_at
                    FROM rate_alerts 
                    WHERE is_active = true
                    ORDER BY email, created_at DESC
                """)
                
                result = db.execute(query)
                users_alerts = {}
                
                for row in result:
                    email = row.email
                    if email not in users_alerts:
                        users_alerts[email] = []
                    
                    users_alerts[email].append({
                        'from_currency': row.from_currency,
                        'to_currency': row.to_currency,
                        'target_rate': row.target_rate,
                        'condition': row.condition,
                        'is_active': row.is_active,
                        'created_at': row.created_at
                    })
                
                return users_alerts
                
        except Exception as e:
            logger.error(f"Error fetching users with alerts: {str(e)}")
            return {}

# Global monitor instance
alert_monitor = AlertMonitor()

async def main():
    """Main function to run the alert monitor"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    logger.info("Starting Currency Alert Monitor...")
    
    # Start monitoring
    await alert_monitor.start_monitoring()

if __name__ == "__main__":
    asyncio.run(main())
