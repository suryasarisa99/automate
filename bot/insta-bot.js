const puppeteer = require("puppeteer-extra");
const post_selector =
  "div.x9f619.xvbhtw8.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.x1q0g3np.xqjyukv.x1qjc9v5.x1oa3qoh.x1qughib > div.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.xdt5ytf.xqjyukv.x1qjc9v5.x1oa3qoh.x1nhvcw1.x1dr59a3.xixxii4.x13vifvy.xeq5yr9.x1n327nk > div > div > div > div > div.x1iyjqo2.xh8yej3 > div:nth-child(7) > div > span > div > a";
const next =
  "body > div.x1n2onr6.xzkaem6 > div.x9f619.x1n2onr6.x1ja2u2z > div > div.x1uvtmcs.x4k7w5x.x1h91t0o.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1n2onr6.x1qrby5j.x1jfb8zj > div > div > div > div > div > div > div > div._ap97 > div > div > div > div._ac7b._ac7d > div > div";
const caption_selector =
  "body > div.x1n2onr6.xzkaem6 > div.x9f619.x1n2onr6.x1ja2u2z > div > div.x1uvtmcs.x4k7w5x.x1h91t0o.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1n2onr6.x1qrby5j.x1jfb8zj > div > div > div > div > div > div > div > div.x15wfb8v.x3aagtl.x6ql1ns.x78zum5.xdl72j9.x1iyjqo2.xs83m0k.x13vbajr.x1ue5u6n > div.xhk4uv.x26u7qi.xy80clv.x9f619.x78zum5.x1n2onr6.x1f4304s > div > div > div > div._ac2p > div:nth-child(2) > div > div.x6s0dn4.x78zum5.x1n2onr6.xh8yej3 > div.xw2csxc.x1odjw0f.x1n2onr6.x1hnll1o.xpqswwc.xl565be.x5dp1im.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x1w2wdq1.xen30ot.x1swvt13.x1pi30zi.xh8yej3.x5n08af.notranslate";

module.exports = async function InstaPost(posts) {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: "./user_data",
  });

  const page = await browser.newPage();
  await page.goto("https://instagram.com");

  for (const post of posts) {
    console.log(post);
    await sendPost(page, post);
  }

  await browser.close();
  console.log("Task Completed");
};

async function sendPost(page, post) {
  await page.waitForSelector(post_selector);
  await page.waitForTimeout(500);
  await page.click(post_selector);
  console.log("post clicked");
  const fileInput = await page.waitForSelector("input[type=file]");

  if (post.images) await fileInput.uploadFile(...post.images);
  else if (post.image) {
    await fileInput.uploadFile(post.image);
    console.log("post image uploaded");
  }

  for (let i = 0; i < 3; i++) {
    if (i == 2) {
      await page.waitForSelector(caption_selector);
      await page.type(caption_selector, post.caption);
      await page.waitForTimeout(500);
    }
    await page.waitForSelector(next);
    await page.click(next);
    await page.waitForTimeout(800);
  }
  await page.keyboard.press("Escape");
}
