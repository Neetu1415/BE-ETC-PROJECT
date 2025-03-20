def format_alert_message(facility_name, status):
    """Format a message for alerts."""
    return f"Alert: {facility_name} is {status}."

def log_alert_creation(facility_name, message):
    """Log the creation of an alert (could be to a file or console)."""
    print(f"Creating alert for {facility_name}: {message}")