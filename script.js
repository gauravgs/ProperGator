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

      drawBox.draw(canvas);
    });
    console.log("TOTAL ==>>\t" + k);

    //slowed down initial ====>>>>> 100
    updateStats(true);
    // getPrediction(age);

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
    initAll();
  }
}

function getPrediction(age) {
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

// const video = document.getElementById("video");

// Promise.all([
//   faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
//   faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
//   faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
//   faceapi.nets.faceExpressionNet.loadFromUri("/models")
// ]).then(startVideo);

// function startVideo() {
//   navigator.getUserMedia(
//     { video: {} },
//     stream => (video.srcObject = stream),
//     err => console.error(err)
//   );
// }
// startVideo();

// video.addEventListener("play", () => {
//   const canvas = faceapi.createCanvasFromMedia(video);
//   document.body.append(canvas);
//   const displaySize = { width: video.width, height: video.height };
//   faceapi.matchDimensions(canvas, displaySize);
//   setInterval(async () => {
//     // const detectionsWithAgeAndGender = await faceapi
//     //   .detectAllFaces(input)
//     //   .withFaceLandmarks()
//     //   .withAgeAndGender();
//     const detections = await faceapi
//       .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
//       .withFaceLandmarks()
//       .withFaceExpressions();
//     const resizedDetections = faceapi.resizeResults(detections, displaySize);
//     canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
//     faceapi.draw.drawDetections(canvas, resizedDetections);
//     faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

//     faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
//   }, 100);
// });
