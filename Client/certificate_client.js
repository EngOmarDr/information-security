const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const keyPath = path.join(__dirname, 'localhost.key');
const certPath = path.join(__dirname, 'localhost.crt');

// Generate a self-signed certificate for localhost


const generateCertificate = () => {
  execSync(`openssl req -newkey rsa:2048 -nodes -keyout ${keyPath} -x509 -days 365 -out ${certPath} -subj "/CN=localhost"`);
  console.log('Self-signed certificate generated successfully!');
};

generateCertificate();
