const https = require('https');

const apiKey = 'AIzaSyA1XvNEOqfJev66OOoD4vNQ-iZVuSiceVU';
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log('Fetching models from:', url);

const fs = require('fs');

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.models) {
                const names = json.models.map(m => m.name).join('\n');
                fs.writeFileSync('models.txt', names);
                console.log('Models written to models.txt');
            } else {
                fs.writeFileSync('models.txt', JSON.stringify(json, null, 2));
            }
        } catch (e) {
            fs.writeFileSync('models.txt', 'Error: ' + e.message + '\n' + data);
        }
    });
}).on('error', (err) => {
    fs.writeFileSync('models.txt', 'Request Error: ' + err.message);
});
