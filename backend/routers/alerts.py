from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
import asyncio
import logging
import uuid

from ..alert_monitor import alert_monitor
from ..email_service import email_service
from ..settings import get_settings
from ..db import get_db
from ..models import RateAlert
from sqlalchemy.orm import Session

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

class CreateAlertRequest(BaseModel):
    from_currency: str
    to_currency: str
    target_rate: float
    condition: str
    email: EmailStr

class UpdateAlertRequest(BaseModel):
    target_rate: Optional[float] = None
    condition: Optional[str] = None
    is_active: Optional[bool] = None

class AlertResponse(BaseModel):
    id: str
    user_id: str
    from_currency: str
    to_currency: str
    target_rate: str
    condition: str
    email: str
    is_active: bool
    last_triggered_at: Optional[datetime]
    last_triggered_rate: Optional[str]
    trigger_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

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

# CRUD endpoints for alerts
@router.get("/", response_model=List[AlertResponse])
async def get_alerts(
    user_id: str,
    db: Session = Depends(get_db)
):
    """Get all alerts for a user"""
    try:
        alerts = db.query(RateAlert).filter(RateAlert.user_id == user_id).all()
        return alerts
    except Exception as e:
        logger.error(f"Error fetching alerts: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch alerts")

@router.post("/", response_model=AlertResponse)
async def create_alert(
    request: CreateAlertRequest,
    user_id: str,
    db: Session = Depends(get_db)
):
    """Create a new alert"""
    try:
        alert = RateAlert(
            id=str(uuid.uuid4()),
            user_id=user_id,
            from_currency=request.from_currency.upper(),
            to_currency=request.to_currency.upper(),
            target_rate=str(request.target_rate),
            condition=request.condition,
            email=request.email
        )
        
        db.add(alert)
        db.commit()
        db.refresh(alert)
        
        return alert
    except Exception as e:
        logger.error(f"Error creating alert: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create alert")

@router.put("/{alert_id}", response_model=AlertResponse)
async def update_alert(
    alert_id: str,
    request: UpdateAlertRequest,
    user_id: str,
    db: Session = Depends(get_db)
):
    """Update an existing alert"""
    try:
        alert = db.query(RateAlert).filter(
            RateAlert.id == alert_id,
            RateAlert.user_id == user_id
        ).first()
        
        if not alert:
            raise HTTPException(status_code=404, detail="Alert not found")
        
        if request.target_rate is not None:
            alert.target_rate = str(request.target_rate)
        if request.condition is not None:
            alert.condition = request.condition
        if request.is_active is not None:
            alert.is_active = request.is_active
        
        alert.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(alert)
        
        return alert
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating alert: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update alert")

@router.delete("/{alert_id}")
async def delete_alert(
    alert_id: str,
    user_id: str,
    db: Session = Depends(get_db)
):
    """Delete an alert"""
    try:
        alert = db.query(RateAlert).filter(
            RateAlert.id == alert_id,
            RateAlert.user_id == user_id
        ).first()
        
        if not alert:
            raise HTTPException(status_code=404, detail="Alert not found")
        
        db.delete(alert)
        db.commit()
        
        return {"message": "Alert deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting alert: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete alert")

@router.patch("/{alert_id}/toggle")
async def toggle_alert(
    alert_id: str,
    user_id: str,
    db: Session = Depends(get_db)
):
    """Toggle alert active status"""
    try:
        alert = db.query(RateAlert).filter(
            RateAlert.id == alert_id,
            RateAlert.user_id == user_id
        ).first()
        
        if not alert:
            raise HTTPException(status_code=404, detail="Alert not found")
        
        alert.is_active = not alert.is_active
        alert.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(alert)
        
        return AlertResponse.from_orm(alert)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error toggling alert: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to toggle alert")
