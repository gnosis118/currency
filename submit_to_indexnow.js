const https = require('https');

// Your API key and key location
const API_KEY = '261d5b1c71af45288448ad47831e44dd';
const KEY_LOCATION = 'https://currencytocurrency.app/261d5b1c71af45288448ad47831e44dd.txt';
const HOST = 'currencytocurrency.app';

// URLs to submit (your new blog posts and sitemap)
const urlList = [
  'https://currencytocurrency.app/blog/currency-conversion-tax-traps-irs-rules-international-freelancers-miss',
  'https://currencytocurrency.app/blog/how-real-time-currency-rates-work-fluctuations-explained-fast',
  'https://currencytocurrency.app/sitemap.xml'
];

// Prepare the request data
const postData = JSON.stringify({
  host: HOST,
  key: API_KEY,
  keyLocation: KEY_LOCATION,
  urlList: urlList
});

// Request options
const options = {
  hostname: 'api.indexnow.org',
  port: 443,
  path: '/IndexNow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(postData)
  }
};

// Make the request
const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    if (res.statusCode === 200) {
      console.log('✅ URLs successfully submitted to IndexNow!');
    } else {
      console.log('❌ Error submitting URLs to IndexNow');
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();

console.log('Submitting URLs to IndexNow...');
console.log('URLs being submitted:');
urlList.forEach(url => console.log(`- ${url}`));
