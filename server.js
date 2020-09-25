const express = require("express");
const app = express();
const path = require("path");

app.use(express.static("js"));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

const { createGzip } = require("zlib");
const { pipeline } = require("stream");
const { createReadStream, createWriteStream } = require("fs");

const gzip = createGzip();
const source = createReadStream("input.txt");
const destination = createWriteStream("input.txt.gz");

pipeline(source, gzip, destination, (err) => {
  if (err) {
    console.error("An error occured: ", err);
    process.exitCode = 1;
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
