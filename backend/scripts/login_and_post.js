const http = require('http');

function post(path, data, token) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'POST',
      headers,
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
    console.log('Logging in...');
    const login = await post('/api/auth/login', { email: 'apiuser@example.com', password: 'password123' });
    console.log('Login status:', login.statusCode);
    console.log('Login body:', login.body);
    const parsed = JSON.parse(login.body || '{}');
    const token = parsed.token;
    if (!token) {
      console.error('No token; cannot proceed');
      process.exit(1);
    }

    console.log('Creating post with token...');
    const postResp = await post('/api/posts', { content: 'Persistence test post', imageUrl: '' }, token);
    console.log('Post create status:', postResp.statusCode);
    console.log('Post create body:', postResp.body);

    console.log('Fetching posts...');
    const posts = await new Promise((resolve, reject) => {
      http.get('https://feed-post-app-z0y4.onrender.com/api/posts', (res) => {
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
