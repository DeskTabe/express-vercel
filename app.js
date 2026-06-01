const express = require('express');
const {google} = require('googleapis');

const app = express();
const port = 3300;

const auth = new google.auth.GoogleAuth({
  keyFile:'google.json',
  scopes:['https://www.googleapis.com/auth/spreadsheets']
})


var allowCrossDomain = function(req,res,next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();  
}
app.use(allowCrossDomain);


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