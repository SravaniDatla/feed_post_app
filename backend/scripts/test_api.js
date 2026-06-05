const http = require('http');

function post(path, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, body }));
    });

    req.on('error', (e) => reject(e));
    req.write(payload);
    req.end();
  });
}

(async () => {
  try {
    console.log('Creating user...');
    const signup = await post('/api/auth/signup', { name: 'APIUser', email: 'apiuser@example.com', password: 'password123' });
    console.log('Signup status:', signup.statusCode);
    console.log('Signup body:', signup.body);
    const parsed = JSON.parse(signup.body || '{}');
    const token = parsed.token;
    if (!token) {
      console.error('No token received; aborting test');
      process.exit(1);
    }

    console.log('Creating post...');
    const options = { content: 'Test post from script', imageUrl: '' };
    const postResp = await new Promise((resolve, reject) => {
      const payload = JSON.stringify(options);
      const req = http.request({ hostname: 'localhost', port: 5000, path: '/api/posts', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload), Authorization: `Bearer ${token}` } }, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ statusCode: res.statusCode, body }));
      });
      req.on('error', reject);
      req.write(payload);
      req.end();
    });
    console.log('Post create status:', postResp.statusCode);
    console.log('Post create body:', postResp.body);

    console.log('Fetching posts...');
    const posts = await new Promise((resolve, reject) => {
      http.get('http://localhost:5000/api/posts', (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ statusCode: res.statusCode, body }));
      }).on('error', reject);
    });
    console.log('Get posts status:', posts.statusCode);
    console.log('Get posts body:', posts.body);
  } catch (err) {
    console.error('Error during test:', err.message || err);
    process.exit(1);
  }
})();
