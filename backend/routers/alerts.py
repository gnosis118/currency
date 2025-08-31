from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
import asyncio
import logging

from ..alert_monitor import alert_monitor
from ..email_service import email_service
from ..settings import get_settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/alerts", tags=["alerts"])

class AlertCheckRequest(BaseModel):
    force: bool = False

class AlertTestRequest(BaseModel):
    email: EmailStr
    from_currency: str
    to_currency: str
    target_rate: float
    condition: str

class WelcomeEmailRequest(BaseModel):
    email: EmailStr
    user_name: Optional[str] = None

@router.post("/check")
async def trigger_alert_check(
    request: AlertCheckRequest,
    background_tasks: BackgroundTasks
):
    """Manually trigger an alert check (for testing/admin purposes)"""
    try:
        if request.force:
            # Clear the notification cooldown for testing
            alert_monitor.last_notification_times.clear()
        
        # Run alert check in background
        background_tasks.add_task(alert_monitor.check_all_alerts)
        
        return {
            "message": "Alert check triggered successfully",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error triggering alert check: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to trigger alert check")

@router.post("/test-email")
async def send_test_alert_email(request: AlertTestRequest):
    """Send a test alert email (for testing purposes)"""
    try:
        # Create test alert data
        alert_data = {
            'from_currency': request.from_currency.upper(),
            'to_currency': request.to_currency.upper(),
            'target_rate': request.target_rate,
            'current_rate': request.target_rate + (0.001 if request.condition == 'above' else -0.001),
            'condition': request.condition,
            'alert_id': 'test-alert'
        }
        
        # Send test email
        success = email_service.send_price_alert(request.email, alert_data)
        
        if success:
            return {
                "message": "Test alert email sent successfully",
                "email": request.email,
                "timestamp": datetime.now().isoformat()
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to send test email")
            
    except Exception as e:
        logger.error(f"Error sending test email: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/welcome-email")
async def send_welcome_email(request: WelcomeEmailRequest):
    """Send a welcome email to a new user"""
    try:
        success = email_service.send_welcome_email(
            request.email, 
            request.user_name
        )
        
        if success:
            return {
                "message": "Welcome email sent successfully",
                "email": request.email,
                "timestamp": datetime.now().isoformat()
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to send welcome email")
            
    except Exception as e:
        logger.error(f"Error sending welcome email: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/daily-summaries")
async def send_daily_summaries(background_tasks: BackgroundTasks):
    """Trigger daily summary emails for all users"""
    try:
        background_tasks.add_task(alert_monitor.send_daily_summaries)
        
        return {
            "message": "Daily summary emails triggered",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error triggering daily summaries: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to trigger daily summaries")

@router.get("/status")
async def get_alert_system_status():
    """Get the status of the alert monitoring system"""
    try:
        # Get count of active alerts
        active_alerts = alert_monitor.get_active_alerts()
        
        # Check if email service is configured
        email_configured = email_service.sg is not None
        
        return {
            "status": "operational" if email_configured else "email_not_configured",
            "active_alerts_count": len(active_alerts),
            "email_service_configured": email_configured,
            "last_check_time": datetime.now().isoformat(),
            "check_interval_seconds": alert_monitor.check_interval
        }
    except Exception as e:
        logger.error(f"Error getting alert system status: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get system status")

@router.get("/active")
async def get_active_alerts():
    """Get all currently active alerts (admin endpoint)"""
    try:
        alerts = alert_monitor.get_active_alerts()
        
        # Remove sensitive information like email addresses for security
        sanitized_alerts = []
        for alert in alerts:
            sanitized_alert = alert.copy()
            # Mask email for privacy
            email = sanitized_alert.get('email', '')
            if '@' in email:
                username, domain = email.split('@', 1)
                sanitized_alert['email'] = f"{username[:2]}***@{domain}"
            sanitized_alerts.append(sanitized_alert)
        
        return {
            "active_alerts": sanitized_alerts,
            "count": len(alerts),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error getting active alerts: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get active alerts")

@router.post("/start-monitoring")
async def start_alert_monitoring(background_tasks: BackgroundTasks):
    """Start the continuous alert monitoring (for deployment)"""
    try:
        # Start monitoring in background
        background_tasks.add_task(alert_monitor.start_monitoring)
        
        return {
            "message": "Alert monitoring started",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error starting alert monitoring: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to start monitoring")

# Health check endpoint
@router.get("/health")
async def health_check():
    """Health check for the alerts service"""
    return {
        "status": "healthy",
        "service": "alerts",
        "timestamp": datetime.now().isoformat()
    }
