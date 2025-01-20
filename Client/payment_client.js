const crypto = require('crypto');
const axios = require('axios'); // To send HTTP requests

// Replace this with your actual private key
const privateKey = `
-----BEGIN RSA PRIVATE KEY-----
MIIBPAIBAAJBANH1eXM9VIrl7PQG5m47l4Hgdx4iPOjbQWV/67/4kS2o1oKgXuYX
qo34fTJszsRCVP+virQOA0xx6p51ucoOBgkCAwEAAQJAOG0dZ8Aq0W17ohWcpjFz
xV7bBIk1D2ulhq67YAtgkQFbJP9CzZngKSeD7CKZZEByPfRq+G5HQLeCVlUlf+Tb
AQIhAPuW0kKH769I94MudNhYtYH+3+RO5Q0Xv/fMQsntWy2pAiEA1aPPCz92qVKG
m5LwZZktS316+Me3YKTGmgBxAK2dkWECIQDUb7O27eWbUrd8kzuierU4wSf4Ng3+
kjFMYbN7oeo9kQIhAMM2Rz3T462chvspLRjo+oZ8Rh2FAH8CkaauuJMSEWSBAiEA
md2CQw1BuwPNt3MOuRdmz7NgdxkJGcmjx/8bRMSOl1Y=
-----END RSA PRIVATE KEY-----`;

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
