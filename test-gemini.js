const https = require('https');

const apiKey = 'AIzaSyA1XvNEOqfJev66OOoD4vNQ-iZVuSiceVU';
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

const data = JSON.stringify({
    contents: [{
        parts: [{ text: 'Hello' }]
    }]
});

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log('Testing API Key with URL:', url);

const req = https.request(url, options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Response Body:', body);
    });
});

req.on('error', (error) => {
    console.error('Request Error:', error);
});

req.write(data);
req.end();
