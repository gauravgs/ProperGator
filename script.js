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

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    // faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    resizedDetections.forEach(detection => {
      const box = detection.detection.box;
      const drawBox = new faceapi.draw.DrawBox(box, {
        label: Math.round(detection.age) + " year old " + detection.gender
      });
      var age = Math.round(detection.age);
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
  }, 100);
});

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
