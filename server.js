const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const path = require("path");

let compressedFile = "";

// Static files and file upload function call
app.use(fileUpload());
app.use(express.static("public"));

// Call to root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

// Post request for uploading and compressing files
app.post("/upload", (req, res) => {
  console.log(req.files);
  // checking if file exists
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  let userFiles = req.files.userFiles;
  let fileName = userFiles.name;
  compressedFile = fileName;

  // uploading files to files folder in root directory
  userFiles.mv("./files/" + fileName, (err) => {
    if (err) return res.status(500).send(err);

    res.redirect("/");
  });

  const { createGzip } = require("zlib");
  const { pipeline } = require("stream");
  const { createReadStream, createWriteStream } = require("fs");

  const gzip = createGzip();
  const source = createReadStream(path.join(__dirname + "/files/" + fileName));
  const destination = createWriteStream(
    path.join(__dirname + "/files/" + fileName + ".gz")
  );

  pipeline(source, gzip, destination, (err) => {
    if (err) {
      console.error("An error occured: ", err);
      process.exitCode = 1;
    }
  });
});

// Download route for compressed file
app.get("/download", (req, res) => {
  res.download("./files/" + compressedFile + ".gz", (err) => {
    if (err) {
      res.send("Cannot download file");
    } else {
      res.redirect("/");
    }
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
