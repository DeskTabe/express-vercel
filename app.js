const express = require('express');
const {google} = require('googleapis');
const fs = require('fs');
const path = require('path')
// Load variables from .env into process.env
require('dotenv').config();

const app = express();
const port = 3300;

const filePath = path.join(process.cwd() + "/tmp", "google-api-credentials.json");

var allowCrossDomain = function(req,res,next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();  
}
app.use(allowCrossDomain);

const credentials = {
  type: 'service_account',
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: 'googleapis.com'
};

fs.writeFileSync(
  filePath,
  JSON.stringify(credentials, null, 2)
);

const auth = new google.auth.GoogleAuth({
  keyFile:'google-api-credentials.json',
  scopes:['https://www.googleapis.com/auth/spreadsheets']
})


async function  writeToSheet(values) {
  const sheets = google.sheets({version:'v4',auth});
  const spreadsheetId = '1_ujcbPir6JzQwqthT6oa3QVn_be-dJ9DfOlClt5zGQU';
  const range = 'Лист1!A:D';
  const valueInputOption = 'USER_ENTERED'
  
  const resource = {values}

  try{
    const res = await sheets.spreadsheets.values.append({
      spreadsheetId,range,valueInputOption,resource
    })
    return res;
  } catch(error){
    console.error('error',error)
  }
}

// Parse URL-encoded bodies (HTML forms)
app.use(express.urlencoded({ extended: true }));

app.post('/', async (req, res) => {
  const entries = Object.values(req.body)
  await writeToSheet([entries])
  console.log(req.body); // Parsed request body
  res.send("received!");
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});