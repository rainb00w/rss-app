const express = require('express');
const app = express();

const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Port - ${port}`));

let Parser = require('rss-parser');
let parser = new Parser();
const axios = require('axios');

const token = '6418043578:AAGzHKDArbYNSagXJT4NtVlI8OCVcwmaHys';
const CHAT_ID = '-1001943237045';
const CHAT_ID_DOU = '-1001964648343';

const URL_API = `https://api.telegram.org/bot${token}/sendMessage`;
let mainFeed = [[], []];
let mainFeedDOU = [[], []];

app.get('/', function (req, res) {
  function clg() {
    console.log('get request!');
  }

  clg();

  res.send('Hello World');
});

async function feedRequest() {
  data = await parser.parseURL(
    'https://www.upwork.com/ab/feed/topics/rss?securityToken=b19c102ae4e12f8d28ba6c1e3fe58816ad134950ff988993af4a4a5b801ab3f594bb2f4bf3b82ece28039fdd66b39fd9924d35c2f4463c18acdc735b99aabf59&userUid=569918438172733440&orgUid=569918438181122049'
  );
  console.log(' data received');

  newFeed = [];
  data &&
    data.items.forEach((item) =>
      newFeed.push([item.title, item.link, item.contentSnippet])
    );

  const receivedFeed = newFeed.slice(0, 5);

  const flattenedMainFeed = mainFeed.flat();

  if (receivedFeed[0][0] !== mainFeed[0][0]) {
    console.log('--------- here');
    async function feedIteration(array) {
      for (const item of array) {
        let messageBody = `${item[0]} \n ${item[2]} \n ${item[1]}`;

        if (!flattenedMainFeed.includes(item[0])) {
          axios.post(URL_API, {
            chat_id: CHAT_ID,
            parse_mode: 'html',
            disable_web_page_preview: true,
            text: messageBody,
          });
        }
      }
    }

    feedIteration(receivedFeed);
  }
  mainFeed = receivedFeed;

  setTimeout(feedRequest(), 9000);
}

feedRequest();
