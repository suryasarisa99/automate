const telegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const Token = process.env.TEL_TOKEN;
const To = process.env.TEL_TO;
const bot = new telegramBot(Token, { polling: true });

module.exports = async function TelPost(posts) {
  for (const post of posts) {
    if (post.image) {
      bot.sendPhoto(To, post.image, { caption: post.caption });
    } else if (post.images) {
      const mediaGroup = post.images.map((imagePath, index) => {
        return {
          type: "photo",
          media: imagePath,
          caption: index === 0 ? post.caption : undefined,
        };
      });
      bot.sendMediaGroup(To, mediaGroup);
    }
  }
};
