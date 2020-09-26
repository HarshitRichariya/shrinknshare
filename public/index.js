let filesDone = 0;
let filesToDo = 0;
let progressBar = document.querySelector("#progress-bar");

let dropArea = document.querySelector("#drop-area");
eventNames = ["dragenter", "dragover", "dragleave", "drop"];

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function highlight(e) {
  dropArea.classList.add("highlight");
}

function unhighlight(e) {
  dropArea.classList.remove("highlight");
}

eventNames.forEach((eventName) => {
  dropArea.addEventListener(eventName, preventDefaults, false);
});

eventNames.slice(0, 2).forEach((eventName) => {
  dropArea.addEventListener(eventName, highlight, false);
});

eventNames.slice(3).forEach((eventName) => {
  dropArea.addEventListener(eventName, unhighlight, false);
});

dropArea.addEventListener("drop", handleDrop, false);

function handleDrop(e) {
  let dt = e.dataTransfer;
  let files = dt.files;

  handleFiles(files);
}

function handleFiles(files) {
  files = [...files];
  initializeProgress(files.length);
  files.forEach(uploadFile);
  files.forEach(previewFile);
}

function uploadFile(file) {
  let url = "YOUR URL HERE";
  let formData = new FormData();

  formData.append("file", file);

  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then(progressDone)
    .catch((err) => {
      console.log(err);
    });
}

function previewFile(file) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = function () {
    let img = document.createElement("img");
    img.src = reader.result;
    document.querySelector("#gallery").appendChild(img);
  };
}

function initializeProgress(numfiles) {
  progressBar.value = 0;
  filesDone = 0;
  filesToDo = numfiles;
}

function progressDone() {
  filesDone++;
  progressBar.value = (filesDone / filesToDo) * 100;
}
