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
var popAge = 0;

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
    // console.log("TOTAL ==>>\t" + k);

    // ========================================================================================================

    //TODO
    // ongoing = checkOngoing();

    // ========================================================================================================

    //slowed down initial ====>>>>> 100
    ongoing = true;
    updateStats(ongoing);
    // updateAD(age);

    // initAll();
  }, 1000);
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

  // nextAD = [
  //   ""
  // ];
}
var flag = 0;

function updateStats(ongoing) {
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
  updateAD(age);
}

var old = 0,
  yng = 0,
  mid = 0,
  superold = 0;

function nextVid() {
  playNext = nextAD.pop();
  // nextAD = [
  //   "https://res.cloudinary.com/dztcftsli/video/upload/v1583983167/Cadbury_Dairy_Milk_-_Aliens_-_Canada_40_secs_o2ewgp.mp4",
  //   nextAD.pop()
  // ];
  playVideo(playNext);
  pushStats();
  initAll();
  console.log(playNext);
}

function updateAD(age) {
  if (age < 16) {
    yng++;
    console.log("yng");
    document.getElementById("age").innerHTML = "Children";
    nextAD.push(
      "https://res.cloudinary.com/dztcftsli/video/upload/v1583983167/Cadbury_Dairy_Milk_-_Aliens_-_Canada_40_secs_o2ewgp.mp4"
    );
  } else if (age < 30) {
    mid++;
    console.log("mid");
    document.getElementById("age").innerHTML = "Young";
    nextAD.push(
      "https://res.cloudinary.com/dztcftsli/video/upload/v1583983652/Inspiration_-_2016_Harley-Davidson_Motorcycles_twr67d.mp4"
    );
  } else if (age < 50) {
    document.getElementById("age").innerHTML = "Mid";
    old++;
    console.log("old");
    nextAD.push(
      "https://res.cloudinary.com/dztcftsli/video/upload/v1583984276/pay_r6smoi.mp4"
    );
  } else {
    console.log("super");
    document.getElementById("age").innerHTML = "Old";
    superold++;
    nextAD.push(
      "https://res.cloudinary.com/dztcftsli/video/upload/v1583984281/travel_osq8yi.mp4"
    );
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
$(document).ready(function() {
  playVideo(
    "https://res.cloudinary.com/dztcftsli/video/upload/v1583983167/Cadbury_Dairy_Milk_-_Aliens_-_Canada_40_secs_o2ewgp.mp4"
  );
});
var currPlayer = videojs("my_video_1");
function playVideo(url) {
  //console.log("in vid", url);

  var currPlayer = videojs("my_video_1");
  $("#overlays-wrap").appendTo($("#my_video_1"));
  var player = currPlayer;

  //console.log("Start");
  //console.log(player);
  player.pause();
  player.src(url);
  player.load();

  player.play();

  player.on("ended", function() {
    // Play the endPlayer
    //console.dir("Done");
    // player.pause();
    // var oldPlayer = document.getElementById("my_video_1");
    // videojs(oldPlayer).dispose();

    // player.src(url);
    // player.load();
    // player.play();
    var sss = setTimeout(function() {
      nextVid();
      clearTimeout(sss);
    }, 2000);

    // var oldPlayer = document.getElementById("my_video_1");
    // videojs(oldPlayer).dispose();
  });
}
