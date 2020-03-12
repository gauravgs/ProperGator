const video = document.getElementById("video");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
  faceapi.nets.ageGenderNet.loadFromUri("/models")
]).then(startVideo);

startVideo();

function startVideo() {
  /*
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
  */

  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false
    })
    .then(cameraStream => {
      video.srcObject = cameraStream;
    });
}
var k = 0;
var max = 0;
var total = 0;
var age = 10;
var exp;
var ongoing = true;

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    k = 0;

    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    resizedDetections.forEach(detection => {
      k++;
      const box = detection.detection.box;
      const drawBox = new faceapi.draw.DrawBox(box, {
        label: Math.round(detection.age) + " year old " + detection.gender
      });
      age = Math.round(detection.age);
      // console.log(detection.expressions);
      exp = detection.expressions;
      var myvid;
      console.log(age);
      // $("#myvid").html(`<h1>${age}</h1>`);
      window.localStorage.setItem("hello", age);
      
      document.getElementById("age").innerHTML = age;
      if (age < 15) {
        // myvid = document.getElementById("vid");
        // myvid.src = "http://localhost:3001/video?age=1";
        // $("#myvid").attr("src", "http://localhost:3001/video?age=1");
      } else if (age < 27) {
        // myvid = document.getElementById("vid");
        // myvid.src = "http://localhost:3001/video?age=2";
        // $("#myvid").attr("src", "http://localhost:3001/video?age=2");
      } else if (age < 50) {
        // myvid = document.getElementById("vid");
        // myvid.src = "http://localhost:3001/video?age=3";
        // $("#myvid").attr("src", "http://localhost:3001/video?age=3");
      } else {
        // myvid = document.getElementById("vid");
        // myvid.src = "http://localhost:3001/video?age=4";
        // $("#myvid").attr("src", "http://localhost:3001/video?age=4");
      }

      drawBox.draw(canvas);
    });
    // console.log("TOTAL ==>>\t" + k);

    // ========================================================================================================

    //TODO
    // ongoing = checkOngoing();

    // ========================================================================================================

    //slowed down initial ====>>>>> 100
    updateStats(ongoing);
    // updateAD(age);

    // initAll();
  }, 400);
});

var nextAD = ["default"];
var happy = 0;
var sad = 0;
var angry = 0;
var surp = 0;
var fear = 0;
var disg = 0;

// k-> no. of faces detected
// total -> total faces identified
// max -> max ppl spotted together

function initAll() {
  happy = 0;
  sad = 0;
  angry = 0;
  surp = 0;
  fear = 0;
  disg = 0;
}

function updateStats(ongoing) {
  if (ongoing) {
    if (max < k) {
      max = k;
    }
    total += k;

    // console.log(exp.happy);

    //check expressions
    if (exp.happy > 0.5) {
      happy++;
    }
    if (exp.sad > 0.5) {
      sad++;
    }
    if (exp.angry > 0.5) {
      angry++;
    }
    if (exp.disgusted > 0.5) {
      disg++;
    }
    if (exp.fearful > 0.5) {
      fear++;
    }

    // console.log(happy + " " + sad);
  } else {
    playNext = nextAD.pop();
    nextAD = ["default", nextAD.pop()];
    pushStats();
    initAll();
  }
}

function updateAD(age) {
  if (age < 16) {
    yng++;
    nextAD.push("youngAD");
  } else if (age < 30) {
    mid++;
    nextAD.push("midAD");
  } else if (age < 50) {
    old++;
    nextAD.push("oldAD");
  } else {
    superold++;
    nextAD.push("SuperOldAD");
  }
}

var analytics;

function pushStats() {
  happy /= total;
  sad /= total;
  angry /= total;
  fear /= total;
  disg /= total;

  if (old > popAge) popAge = old;
  if (yng > popAge) popAge = yng;
  if (mid > popAge) popAge = mid;
  if (superold > popAge) popAge = superold;

  analytics = {
    exp: {
      happy: happy,
      sad: sad,
      angry: angry,
      fear: fear,
      disg: disg
    },
    age: popAge
  };
}
