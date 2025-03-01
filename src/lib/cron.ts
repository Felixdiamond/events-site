/**
 * This file contains utility functions for working with Vercel Cron jobs.
 * 
 * To set up a Vercel Cron job, you need to:
 * 1. Add the cron configuration to your vercel.json file
 * 2. Create an API endpoint that will be called by the cron job
 * 3. Secure the endpoint with a secret key
 * 
 * Example vercel.json configuration:
 * {
 *   "crons": [
 *     {
 *       "path": "/api/send-reminders",
 *       "schedule": "0 8 * * *"
 *     }
 *   ]
 * }
 * 
 * This will run the /api/send-reminders endpoint every day at 8:00 AM UTC.
 */

/**
 * Generate a secure random string to use as a cron secret key
 */
export function generateCronSecretKey(length: number = 32): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
}

/**
 * Manually trigger a cron job
 */
export async function triggerCronJob(endpoint: string, secretKey: string): Promise<Response> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${secretKey}`,
    },
  });
  
  return response;
}

/**
 * Common cron schedules
 */
export const CronSchedules = {
  EVERY_MINUTE: '* * * * *',
  EVERY_HOUR: '0 * * * *',
  EVERY_DAY_AT_MIDNIGHT: '0 0 * * *',
  EVERY_DAY_AT_8AM: '0 8 * * *',
  EVERY_SUNDAY_AT_MIDNIGHT: '0 0 * * 0',
  EVERY_FIRST_OF_MONTH: '0 0 1 * *',
}; 