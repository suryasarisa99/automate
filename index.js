const fs = require("fs/promises");
const path = require("path");
const InstaPost = require("./bot/insta-bot");
const TelPost = require("./bot/tel-bot");

const imagesDir = path.join(__dirname, "data", "photos");
const captionsDir = path.join(__dirname, "data", "captions");

async function run() {
  const imageFiles = await fs.readdir(imagesDir);
  const captions = await fs.readdir(captionsDir);

  if (imageFiles.length !== captions.length) {
    console.warn(`Images: ${images.length}, Captions: ${captions.length}`);
    return;
  }

  const posts = [];
  for (imgFile of imageFiles) {
    const imgPath = path.join(imagesDir, imgFile);
    const status = await fs.stat(imgPath);
    if (status.isFile()) {
      const captionPath = path.join(
        captionsDir,
        imgFile.replace(".jpg", ".txt")
      );
      const caption = await fs.readFile(captionPath, { encoding: "utf-8" });
      posts.push({ image: imgPath, caption });
    } else {
      const all_imgs = await fs.readdir(imgPath);
      const all_imgs_path = all_imgs.map((img) => path.join(imgPath, img));
      const captionPath = path.join(captionsDir, imgFile + ".txt");
      const caption = await fs.readFile(captionPath, { encoding: "utf-8" });
      posts.push({ images: all_imgs_path, caption });
    }
  }

  console.log(posts);

  // await InstaPost(posts);
  // await TelPost(posts);

  moveFiles("./data/photos", "./data/old/photos");
  moveFiles("./data/captions", "./data/old/captions");
}

run().catch((err) => console.warn(err));

async function moveFiles(srcDir, destDir) {
  const files = await fs.readdir(srcDir);
  await Promise.all(
    files.map((file) => {
      const srcFile = path.join(srcDir, file);
      const destFile = path.join(destDir, file);
      return fs.rename(srcFile, destFile);
    })
  );
}
