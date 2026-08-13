import fetch from 'node-fetch';

const test = async () => {
  try {
    const res = await fetch('http://localhost:5008/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'anjali@gmail.com', password: 'test123', role: 'admin' }),
    });
    const data = await res.text();
    console.log('status', res.status);
    console.log('body', data);
  } catch (err) {
    console.error(err);
  }
};

await test();
