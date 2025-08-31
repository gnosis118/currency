#!/usr/bin/env python3
"""
Currency Alert Monitor Service
Continuously monitors price alerts and sends email notifications
"""

import asyncio
import logging
import signal
import sys
import os
from datetime import datetime

# Add the backend directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from alert_monitor import alert_monitor

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('alert_monitor.log'),
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

class AlertMonitorService:
    def __init__(self):
        self.running = False
        self.monitor_task = None
        
    async def start(self):
        """Start the alert monitoring service"""
        logger.info("Starting Currency Alert Monitor Service...")
        
        # Check configuration
        if not self._check_configuration():
            logger.error("Configuration check failed. Exiting.")
            return False
        
        self.running = True
        
        try:
            # Start the monitoring loop
            self.monitor_task = asyncio.create_task(alert_monitor.start_monitoring())
            
            # Set up signal handlers for graceful shutdown
            signal.signal(signal.SIGINT, self._signal_handler)
            signal.signal(signal.SIGTERM, self._signal_handler)
            
            logger.info("Alert monitor service started successfully")
            
            # Wait for the monitoring task to complete
            await self.monitor_task
            
        except asyncio.CancelledError:
            logger.info("Alert monitor service was cancelled")
        except Exception as e:
            logger.error(f"Error in alert monitor service: {str(e)}")
            return False
        
        return True
    
    def _check_configuration(self) -> bool:
        """Check if all required configuration is present"""
        required_env_vars = [
            'DATABASE_URL',
            'SENDGRID_API_KEY'
        ]
        
        missing_vars = []
        for var in required_env_vars:
            if not os.getenv(var):
                missing_vars.append(var)
        
        if missing_vars:
            logger.error(f"Missing required environment variables: {', '.join(missing_vars)}")
            logger.error("Please set the following environment variables:")
            logger.error("- DATABASE_URL: PostgreSQL connection string")
            logger.error("- SENDGRID_API_KEY: SendGrid API key for sending emails")
            return False
        
        # Test database connection
        try:
            alerts = alert_monitor.get_active_alerts()
            logger.info(f"Database connection successful. Found {len(alerts)} active alerts.")
        except Exception as e:
            logger.error(f"Database connection failed: {str(e)}")
            return False
        
        # Test email service
        from email_service import email_service
        if not email_service.sg:
            logger.error("SendGrid email service not configured properly")
            return False
        
        logger.info("Configuration check passed")
        return True
    
    def _signal_handler(self, signum, frame):
        """Handle shutdown signals"""
        logger.info(f"Received signal {signum}. Shutting down gracefully...")
        self.stop()
    
    def stop(self):
        """Stop the alert monitoring service"""
        if self.running:
            self.running = False
            if self.monitor_task and not self.monitor_task.done():
                self.monitor_task.cancel()
            logger.info("Alert monitor service stopped")

async def main():
    """Main entry point"""
    service = AlertMonitorService()
    
    try:
        success = await service.start()
        if not success:
            sys.exit(1)
    except KeyboardInterrupt:
        logger.info("Received keyboard interrupt")
        service.stop()
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    # Print startup banner
    print("=" * 60)
    print("Currency to Currency - Alert Monitor Service")
    print(f"Started at: {datetime.now().isoformat()}")
    print("=" * 60)
    
    # Run the service
    asyncio.run(main())
