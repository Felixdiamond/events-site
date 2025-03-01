#!/usr/bin/env node

/**
 * This script is for testing the reminders functionality locally
 * It makes a request to the local API endpoint
 */

const http = require('http');
const https = require('https');
require('dotenv').config({ path: '.env.local' });

const isLocalhost = process.env.NEXT_PUBLIC_APP_URL.includes('localhost');
const client = isLocalhost ? http : https;
const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/send-reminders`;
const secretKey = process.env.CRON_SECRET_KEY || '';

console.log(`Testing reminders API at: ${url}`);

const options = {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${secretKey}`
  }
};

const req = client.request(url, options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const jsonData = JSON.parse(data);
      console.log('Response:');
      console.log(JSON.stringify(jsonData, null, 2));
      
      if (res.statusCode === 200) {
        console.log('\nTest completed successfully!');
      } else {
        console.error('\nTest failed with error.');
      }
    } catch (error) {
      console.error('Error parsing response:', error);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Error making request:', error);
});

req.end(); 