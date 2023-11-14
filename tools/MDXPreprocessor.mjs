import fs from "fs";
import { parse, stringify } from "yaml";

const routesDirectory = "./app/routes";
const mdxHeaderPattern = /---\r?\n(.*?)\r?\n---/s;
const postNamePattern = /posts\.(.*)\.mdx/;

const mdxFiles = fs
  .readdirSync(routesDirectory)
  .filter((file) => file.match(/posts.*.mdx/));

function formatDate(date) {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function estimateReadTime(text) {
  const chineseCharsPerMinute = 350;
  const englishCharsPerMinute = 225;

  const chineseChars = text.match(/[\u4e00-\u9fa5]/g)?.length || 0;
  const englishChars = text.match(/[a-zA-Z]/g)?.length || 0;

  const chineseReadTime = Math.ceil(chineseChars / chineseCharsPerMinute);
  const englishReadTime = Math.ceil(englishChars / englishCharsPerMinute);

  return chineseReadTime + englishReadTime;
}

const posts = mdxFiles.map((file) => {
  const mdxFile = fs.readFileSync(`${routesDirectory}/${file}`, "utf8");
  const mdxHeader = mdxFile.match(mdxHeaderPattern)[1];
  const mdxHeaderObject = parse(mdxHeader);
  const postName = file.match(postNamePattern)[1];
  let needRewrite = false;

  if (!mdxHeaderObject.date) {
    mdxHeaderObject.date = formatDate(Date.now());
    needRewrite = true;
  }

  if (!mdxHeaderObject.title) {
    const title = mdxHeaderObject.meta.reduce((acc, cur) => {
      if (!acc && cur.title) {
        return cur.title;
      } else {
        return acc;
      }
    }, undefined);
    mdxHeaderObject.title = title || mdxHeaderObject.title.replace(/"/g, '\\"');
    needRewrite = true;
  }

  if (needRewrite) {
    const newMdxHeader = stringify(mdxHeaderObject);
    const newMdxFile = mdxFile.replace(mdxHeader, newMdxHeader);
    fs.writeFileSync(`${routesDirectory}/${file}`, newMdxFile);
  }

  return {
    title: mdxHeaderObject.title,
    date: mdxHeaderObject.date,
    slug: postName,
    estimatedReadTime: estimateReadTime(mdxFile),
    description: mdxHeaderObject.meta.reduce(
      (acc, cur) => cur.description || acc,
      ""
    ),
  };
});

posts.sort((a, b) => {
  if (a.date === b.date) {
    return a.title > b.title ? 1 : -1;
  }

  return a.date > b.date ? -1 : 1;
});

fs.writeFileSync("./tools/posts.json", JSON.stringify(posts, null, 2));
