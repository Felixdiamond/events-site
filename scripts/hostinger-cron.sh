#!/bin/bash

# Hostinger Cron Script for Sending Reminders
# This script should be executed by Hostinger's cron job system

# Replace with your actual domain
DOMAIN="your-domain.com"

# Log file path (adjust as needed)
LOG_FILE="/home/username/logs/reminders-cron.log"

# Create log directory if it doesn't exist
mkdir -p "$(dirname "$LOG_FILE")"

# Add timestamp to log
echo "===== $(date) =====" >> "$LOG_FILE"
echo "Running reminders cron job..." >> "$LOG_FILE"

# Make the API request
RESPONSE=$(curl -s -X GET "https://$DOMAIN/api/send-reminders")

# Log the response
echo "Response: $RESPONSE" >> "$LOG_FILE"

# Check if the request was successful
if [[ $RESPONSE == *"Processed"* ]]; then
  echo "Reminders sent successfully!" >> "$LOG_FILE"
else
  echo "Error sending reminders!" >> "$LOG_FILE"
fi

echo "===== End of job =====" >> "$LOG_FILE"
echo "" >> "$LOG_FILE" 