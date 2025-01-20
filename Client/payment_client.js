const crypto = require('crypto');
const axios = require('axios'); // To send HTTP requests

// Replace this with your actual private key
const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIBOgIBAAJBAIRrHXnDz48f5ziFdhFfkpyfJDuEU/+P6GaY7RRIdC5c/DC904q8
y10vi7Kn9sbCQzeFa7iYmcCaAPaLqkeOkjECAwEAAQJACZCrOmZ4kcAeNaj+VFbx
AjtEpL/0SVudz/tv9K0fJ1IYReeMVHp4kCJpa1TX9p+UbLX4vdHtADGK8qUuWZtF
OQIhAPuHYoivfHu0wNiSh57Km/DGdC8TyAnDdedPCrakntFvAiEAhsWz25CU8HMr
BQMEzXgCrsoOdFqxeloEBmSMr8gNxl8CIQDo7RzQW0I6BM85P6ib4iC6vezF09nB
QOKki8vuC1CPvQIgRmCRNnP+wr1xVpGn/V/RDtNmzu3ZRgohlfEF4nk2cEMCIFup
NlqOoBe2plECy6LiP5fiEbFfnF0gDy6XCDym+0pt
-----END RSA PRIVATE KEY-----`;

const publicKey = `-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAIRrHXnDz48f5ziFdhFfkpyfJDuEU/+P
6GaY7RRIdC5c/DC904q8y10vi7Kn9sbCQzeFa7iYmcCaAPaLqkeOkjECAwEAAQ==
-----END PUBLIC KEY-----`

// Data to be sent to the server
const data = {
  userId: 123,
  amount: 1000,
  currency: 'USD',
};

// Create a signature
function signData(data, privateKey) {
  const sign = crypto.createSign('SHA256');
  sign.update(JSON.stringify(data)); // Use the stringified version of the data
  sign.end();

  // Sign the data using the private key
  const signature = sign.sign(privateKey, 'hex');
  return signature;
}

// Send the signed data to the server
async function sendDataToServer(data, privateKey) {
  const signature = signData(data, privateKey);
  const verify = crypto.createVerify('SHA256');
  verify.update(JSON.stringify(data));
  verify.end();
  const result = verify.verify(publicKey, signature, 'hex')
  console.log(result);
  try {
    // Prepare the payload
    const payload = {
      "id": 1,
      "encData": data,
      "signature": signature
    }

    // Send the data to the server
    const response = await axios.post('http://localhost:3000/payment/process', payload);

    console.log('Server Response:', response.data);
  } catch (error) {
    console.error('Error sending data to the server:', error.message);
  }
}

// Execute the function
sendDataToServer("49fdffef8e1ddae7ecbd9f2f974ca978:160eb65f9afe0849f06b1b5de930fa10011483f2d41e", privateKey);
