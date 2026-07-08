const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5173;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

let transporter = null;
// Initialize Nodemailer with Ethereal test account
try {
  const nodemailer = require('nodemailer');
  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error('Failed to create a testing account. ' + err.message);
      return;
    }
    transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass
      }
    });
    console.log('Nodemailer test account created.');
    console.log('Test account user: %s', account.user);
  });
} catch (e) {
  console.log('Nodemailer not installed. API routes will fail.');
}

const server = http.createServer((req, res) => {
  // Resolve path
  let parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = parsedUrl.pathname;
  
  // Database helper
  const usersFile = path.join(__dirname, 'users.json');
  const readUsers = () => {
    try {
      if (fs.existsSync(usersFile)) {
        return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
      }
    } catch (e) {
      console.error('Error reading users', e);
    }
    return [];
  };
  const writeUsers = (users) => {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf8');
  };

  // Auth Routes
  if (req.method === 'POST' && (pathname === '/api/signup' || pathname === '/api/login')) {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        let users = readUsers();

        if (pathname === '/api/signup') {
          // Signup logic
          const existingUser = users.find(u => u.email === data.email);
          if (existingUser) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, message: 'Email already exists' }));
          }
          const newUser = {
            id: Date.now().toString(),
            name: data.name,
            email: data.email,
            password: data.password // plain text for demo
          };
          users.push(newUser);
          writeUsers(users);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: true, message: 'Account created', user: { name: newUser.name, email: newUser.email } }));
        }

        if (pathname === '/api/login') {
          // Login logic
          const user = users.find(u => (u.email === data.email || u.name === data.email) && u.password === data.password);
          if (user) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: true, message: 'Login successful', user: { name: user.name, email: user.email } }));
          } else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, message: 'Invalid credentials' }));
          }
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Invalid request payload' }));
      }
    });
    return;
  }

  
  // API Routes
  if (req.method === 'POST' && (pathname === '/api/book' || pathname === '/api/contact')) {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        
        if (!transporter) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: false, message: 'Mailer not initialized (npm install nodemailer)' }));
        }

        let subject = pathname === '/api/book' ? `New Booking: ${data.service}` : 'New Newsletter Subscription';
        let text = pathname === '/api/book' 
          ? `Name: ${data.name}\nEmail: ${data.email}\nService: ${data.service}\nDate: ${data.date}\nDetails: ${data.message}`
          : `New subscriber email: ${data.email}`;

        let info = await transporter.sendMail({
          from: '"Sober Crew Website" <no-reply@sobercrew.vn>',
          to: 'phamkhang1310@gmail.com',
          subject: subject,
          text: text,
        });

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', require('nodemailer').getTestMessageUrl(info));

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Message sent successfully!', previewUrl: require('nodemailer').getTestMessageUrl(info) }));
      } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Failed to send message' }));
      }
    });
    return;
  }

  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  
  // Basic security check: prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.statusCode = 404;
        res.end('Not Found');
      } else {
        res.statusCode = 500;
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
