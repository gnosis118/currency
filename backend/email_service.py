import os
import sendgrid
from sendgrid.helpers.mail import Mail, Email, To, Content
from typing import List, Dict, Any
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.api_key = os.getenv('SENDGRID_API_KEY')
        self.from_email = os.getenv('FROM_EMAIL', 'alerts@currencytocurrency.app')
        self.sg = sendgrid.SendGridAPIClient(api_key=self.api_key) if self.api_key else None
        
        if not self.api_key:
            logger.warning("SendGrid API key not found. Email notifications will be disabled.")
    
    def send_price_alert(self, to_email: str, alert_data: Dict[str, Any]) -> bool:
        """Send a price alert email to the user"""
        if not self.sg:
            logger.error("SendGrid not configured. Cannot send email.")
            return False
        
        try:
            # Create email content
            subject = f"🚨 Price Alert: {alert_data['from_currency']}/{alert_data['to_currency']} Target Reached!"
            
            html_content = self._create_alert_html(alert_data)
            text_content = self._create_alert_text(alert_data)
            
            # Create the email
            from_email = Email(self.from_email, "Currency to Currency Alerts")
            to_email_obj = To(to_email)
            
            mail = Mail(
                from_email=from_email,
                to_emails=to_email_obj,
                subject=subject,
                html_content=html_content,
                plain_text_content=text_content
            )
            
            # Send the email
            response = self.sg.send(mail)
            
            if response.status_code in [200, 201, 202]:
                logger.info(f"Price alert email sent successfully to {to_email}")
                return True
            else:
                logger.error(f"Failed to send email. Status code: {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"Error sending price alert email: {str(e)}")
            return False
    
    def send_welcome_email(self, to_email: str, user_name: str = None) -> bool:
        """Send a welcome email to new users"""
        if not self.sg:
            return False
        
        try:
            subject = "Welcome to Currency to Currency - Your Rate Alerts Are Ready!"
            
            html_content = self._create_welcome_html(user_name or to_email.split('@')[0])
            text_content = self._create_welcome_text(user_name or to_email.split('@')[0])
            
            from_email = Email(self.from_email, "Currency to Currency")
            to_email_obj = To(to_email)
            
            mail = Mail(
                from_email=from_email,
                to_emails=to_email_obj,
                subject=subject,
                html_content=html_content,
                plain_text_content=text_content
            )
            
            response = self.sg.send(mail)
            return response.status_code in [200, 201, 202]
            
        except Exception as e:
            logger.error(f"Error sending welcome email: {str(e)}")
            return False
    
    def send_daily_summary(self, to_email: str, alerts_summary: List[Dict[str, Any]]) -> bool:
        """Send daily summary of active alerts"""
        if not self.sg or not alerts_summary:
            return False
        
        try:
            subject = f"📊 Daily Currency Alert Summary - {datetime.now().strftime('%B %d, %Y')}"
            
            html_content = self._create_summary_html(alerts_summary)
            text_content = self._create_summary_text(alerts_summary)
            
            from_email = Email(self.from_email, "Currency to Currency")
            to_email_obj = To(to_email)
            
            mail = Mail(
                from_email=from_email,
                to_emails=to_email_obj,
                subject=subject,
                html_content=html_content,
                plain_text_content=text_content
            )
            
            response = self.sg.send(mail)
            return response.status_code in [200, 201, 202]
            
        except Exception as e:
            logger.error(f"Error sending daily summary: {str(e)}")
            return False
    
    def _create_alert_html(self, alert_data: Dict[str, Any]) -> str:
        """Create HTML content for price alert email"""
        current_rate = alert_data.get('current_rate', 0)
        target_rate = alert_data.get('target_rate', 0)
        condition = alert_data.get('condition', 'above')
        from_currency = alert_data.get('from_currency', '')
        to_currency = alert_data.get('to_currency', '')
        
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Price Alert Triggered</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
                .content {{ background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }}
                .alert-box {{ background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }}
                .rate-display {{ font-size: 24px; font-weight: bold; color: #2563eb; text-align: center; margin: 20px 0; }}
                .button {{ display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }}
                .footer {{ text-align: center; color: #666; font-size: 12px; margin-top: 30px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🚨 Price Alert Triggered!</h1>
                    <p>Your {from_currency}/{to_currency} alert has been activated</p>
                </div>
                <div class="content">
                    <div class="alert-box">
                        <h2>Alert Details</h2>
                        <p><strong>Currency Pair:</strong> {from_currency} to {to_currency}</p>
                        <p><strong>Condition:</strong> Rate goes {condition} {target_rate:.6f}</p>
                        <div class="rate-display">
                            Current Rate: {current_rate:.6f}
                        </div>
                        <p><strong>Triggered:</strong> {datetime.now().strftime('%B %d, %Y at %I:%M %p UTC')}</p>
                    </div>
                    
                    <p>Your price alert has been triggered! The {from_currency}/{to_currency} exchange rate has reached your target.</p>
                    
                    <div style="text-align: center;">
                        <a href="https://currencytocurrency.app/convert/{from_currency.lower()}-to-{to_currency.lower()}" class="button">
                            View Live Rates
                        </a>
                    </div>
                    
                    <p><strong>What's next?</strong></p>
                    <ul>
                        <li>Check the current market conditions</li>
                        <li>Consider your trading strategy</li>
                        <li>Set up additional alerts if needed</li>
                    </ul>
                </div>
                <div class="footer">
                    <p>This alert was sent from Currency to Currency. <a href="https://currencytocurrency.app/alerts">Manage your alerts</a></p>
                    <p>© 2025 Currency to Currency. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
    
    def _create_alert_text(self, alert_data: Dict[str, Any]) -> str:
        """Create plain text content for price alert email"""
        current_rate = alert_data.get('current_rate', 0)
        target_rate = alert_data.get('target_rate', 0)
        condition = alert_data.get('condition', 'above')
        from_currency = alert_data.get('from_currency', '')
        to_currency = alert_data.get('to_currency', '')
        
        return f"""
🚨 PRICE ALERT TRIGGERED!

Your {from_currency}/{to_currency} alert has been activated.

Alert Details:
- Currency Pair: {from_currency} to {to_currency}
- Condition: Rate goes {condition} {target_rate:.6f}
- Current Rate: {current_rate:.6f}
- Triggered: {datetime.now().strftime('%B %d, %Y at %I:%M %p UTC')}

Your price alert has been triggered! The {from_currency}/{to_currency} exchange rate has reached your target.

View live rates: https://currencytocurrency.app/convert/{from_currency.lower()}-to-{to_currency.lower()}

What's next?
- Check the current market conditions
- Consider your trading strategy  
- Set up additional alerts if needed

Manage your alerts: https://currencytocurrency.app/alerts

© 2025 Currency to Currency. All rights reserved.
        """
    
    def _create_welcome_html(self, user_name: str) -> str:
        """Create HTML content for welcome email"""
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Currency to Currency</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
                .content {{ background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }}
                .feature-box {{ background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }}
                .button {{ display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }}
                .footer {{ text-align: center; color: #666; font-size: 12px; margin-top: 30px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to Currency to Currency!</h1>
                    <p>Hi {user_name}, your account is ready</p>
                </div>
                <div class="content">
                    <p>Thank you for joining Currency to Currency! You now have access to professional-grade currency monitoring tools.</p>
                    
                    <div class="feature-box">
                        <h3>🚨 Price Alerts</h3>
                        <p>Set up custom alerts for any currency pair and get notified when rates hit your targets.</p>
                    </div>
                    
                    <div class="feature-box">
                        <h3>📊 Live Charts</h3>
                        <p>Access real-time charts with multiple timeframes and technical indicators.</p>
                    </div>
                    
                    <div class="feature-box">
                        <h3>💱 Real-time Rates</h3>
                        <p>Get accurate, up-to-date exchange rates for 150+ currencies and cryptocurrencies.</p>
                    </div>
                    
                    <div style="text-align: center;">
                        <a href="https://currencytocurrency.app/alerts" class="button">
                            Set Up Your First Alert
                        </a>
                    </div>
                </div>
                <div class="footer">
                    <p>Need help? Visit our <a href="https://currencytocurrency.app/faq">FAQ</a> or contact support.</p>
                    <p>© 2025 Currency to Currency. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
    
    def _create_welcome_text(self, user_name: str) -> str:
        """Create plain text content for welcome email"""
        return f"""
Welcome to Currency to Currency!

Hi {user_name}, your account is ready.

Thank you for joining Currency to Currency! You now have access to professional-grade currency monitoring tools.

Features available to you:

🚨 PRICE ALERTS
Set up custom alerts for any currency pair and get notified when rates hit your targets.

📊 LIVE CHARTS  
Access real-time charts with multiple timeframes and technical indicators.

💱 REAL-TIME RATES
Get accurate, up-to-date exchange rates for 150+ currencies and cryptocurrencies.

Get started: https://currencytocurrency.app/alerts

Need help? Visit our FAQ: https://currencytocurrency.app/faq

© 2025 Currency to Currency. All rights reserved.
        """
    
    def _create_summary_html(self, alerts_summary: List[Dict[str, Any]]) -> str:
        """Create HTML content for daily summary email"""
        alerts_html = ""
        for alert in alerts_summary:
            status = "🟢 Active" if alert.get('is_active') else "🔴 Paused"
            alerts_html += f"""
            <tr>
                <td>{alert.get('from_currency')}/{alert.get('to_currency')}</td>
                <td>{alert.get('condition')} {alert.get('target_rate', 0):.6f}</td>
                <td>{alert.get('current_rate', 0):.6f}</td>
                <td>{status}</td>
            </tr>
            """
        
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Daily Alert Summary</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
                .content {{ background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }}
                table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
                th, td {{ padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }}
                th {{ background: #f1f3f4; }}
                .button {{ display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }}
                .footer {{ text-align: center; color: #666; font-size: 12px; margin-top: 30px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📊 Daily Alert Summary</h1>
                    <p>{datetime.now().strftime('%B %d, %Y')}</p>
                </div>
                <div class="content">
                    <p>Here's your daily summary of active currency alerts:</p>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Currency Pair</th>
                                <th>Target</th>
                                <th>Current Rate</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alerts_html}
                        </tbody>
                    </table>
                    
                    <div style="text-align: center;">
                        <a href="https://currencytocurrency.app/alerts" class="button">
                            Manage Alerts
                        </a>
                    </div>
                </div>
                <div class="footer">
                    <p><a href="https://currencytocurrency.app/alerts">Manage your alerts</a> | <a href="#">Unsubscribe</a></p>
                    <p>© 2025 Currency to Currency. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
    
    def _create_summary_text(self, alerts_summary: List[Dict[str, Any]]) -> str:
        """Create plain text content for daily summary email"""
        alerts_text = ""
        for alert in alerts_summary:
            status = "Active" if alert.get('is_active') else "Paused"
            alerts_text += f"- {alert.get('from_currency')}/{alert.get('to_currency')}: {alert.get('condition')} {alert.get('target_rate', 0):.6f} (Current: {alert.get('current_rate', 0):.6f}) - {status}\n"
        
        return f"""
📊 DAILY ALERT SUMMARY
{datetime.now().strftime('%B %d, %Y')}

Here's your daily summary of active currency alerts:

{alerts_text}

Manage your alerts: https://currencytocurrency.app/alerts

© 2025 Currency to Currency. All rights reserved.
        """

# Global email service instance
email_service = EmailService()
