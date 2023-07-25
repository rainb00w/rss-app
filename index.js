let Parser = require('rss-parser');
let parser = new Parser();

const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');

const bot = new Telegraf('6418043578:AAGzHKDArbYNSagXJT4NtVlI8OCVcwmaHys');

let receivedFeed = [];
let mainFeed = [[], []];

bot.start((ctx) => {
  ctx.replyWithHTML(`<strong>Welcome</strong>`);
  setInterval(async () => {
    data = await parser.parseURL(
      'https://www.upwork.com/ab/feed/topics/rss?securityToken=b19c102ae4e12f8d28ba6c1e3fe58816ad134950ff988993af4a4a5b801ab3f594bb2f4bf3b82ece28039fdd66b39fd9924d35c2f4463c18acdc735b99aabf59&userUid=569918438172733440&orgUid=569918438181122049'
    );

    receivedFeed = [];
    data &&
      data.items.forEach((item) =>
        receivedFeed.push([item.title, item.link, item.contentSnippet])
      );
    console.log('-- Receiving the data');
    // ctx.reply('-- Receiving the data');

    if (mainFeed && receivedFeed[0][0] !== mainFeed[0][0]) {
      console.log('THE ARE DIFFERENT');
      console.log(receivedFeed[0][0]);
      receivedFeed.forEach((item) => {
        // console.log('---item ', item);
        if (!mainFeed.includes(item)) {
          ctx.replyWithHTML(
            `______________ \n ${item[0]} \n ${item[2]} \n ${item[1]} \n _____________`
          );
        }
      });

      console.log('!!!!!! Merging to mainFeed');
      mainFeed = receivedFeed;
    }
  }, 5000);
});

bot.launch();
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
