const video = document.getElementById("video");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
  faceapi.nets.ageGenderNet.loadFromUri("/models"),
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
      audio: false,
    })
    .then((cameraStream) => {
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
var detected = [];
video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    k = 0;
    age = 0;
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
    resizedDetections.forEach((detection) => {
      k++;
      const box = detection.detection.box;
      const drawBox = new faceapi.draw.DrawBox(box, {
        label: Math.round(detection.age) + " year old " + detection.gender,
      });

      age = Math.round(detection.age);
      detected.push(age);
      // console.log(detection);
      exp = detection.expressions;
      var myvid;
      //  console.log(age);
      // $("#myvid").html(`<h1>${age}</h1>`);
      window.localStorage.setItem("hello", age);
      drawBox.draw(canvas);
    });
    // console.log("TOTAL ==>>\t" + k);
    findages();
    // ========================================================================================================

    //TODO
    // ongoing = checkOngoing();

    // ========================================================================================================

    //slowed down initial ====>>>>> 100
    ongoing = true;
    updateStats(ongoing);
    // updateAD(age);

    // initAll();
  }, 2500);
});

//////////// facenet end
function findages() {
  console.log(
    "Children " + yng + " Young " + mid,
    " Mid " + old + " Old " + superold + "at find ages"
  );
  console.log(detected, "detected aages");
  for (var a = 0; a < detected.length; a++) {
    if (0 < detected[a] && detected[a] < 16) {
      yng++;
    } else if (0 < detected[a] && detected[a] < 30) {
      mid++;
    } else if (0 < detected[a] && detected[a] < 50) {
      old++;
    } else {
      superold++;
    }
  }
  detected = [];
}
// loader

var animation = bodymovin.loadAnimation({
  container: document.getElementById("loader"), // Required
  path: "loader.json", // Required
  renderer: "svg", // Required
  loop: true, // Optional
  autoplay: false, // Optional
  name: "Hello World", // Name for future reference. Optional.
});
animation.play();

animation.hide();

////////  display code
list = [];
listcat1 = [];
listcat2 = [];
listcat3 = [];
listcat4 = [];
var nextAD = [];
var happy = 0;
var sad = 0;
var angry = 0;
var surp = 0;
var fear = 0;
var disg = 0;
function loadData() {
  $.getJSON(`https://propogator-2cc09.firebaseio.com/.json`, function (d) {
    // console.log(d);
    data = d;
    dataReady = true;

    if (d.hasOwnProperty("Ad")) {
      var data = d.Ad;
      for (var key of Object.keys(data)) {
        list.push(data[key]);
        if (data[key].category == 1) {
          listcat1.push(data[key]);
        } else if (data[key].category == 2) {
          listcat2.push(data[key]);
        } else if (data[key].category == 3) {
          listcat3.push(data[key]);
        } else if (data[key].category == 4) {
          listcat4.push(data[key]);
        }
      }
    }
    nextAD = [listcat1[0]];
    nextVid();
  });

  console.log("Data Sync");
  // console.log(list);
  // console.log(listcat1);
  // console.log(listcat2);
  // console.log(listcat3);
  // console.log(listcat4);
}
function syncData() {
  $.getJSON(`https://propogator-2cc09.firebaseio.com/.json`, function (d) {
    // console.log(d);
    data = d;
    dataReady = true;

    if (d.hasOwnProperty("Ad")) {
      var data = d.Ad;
      for (var key of Object.keys(data)) {
        list.push(data[key]);
        if (data[key].category == 1) {
          listcat1.push(data[key]);
        } else if (data[key].category == 2) {
          listcat2.push(data[key]);
        } else if (data[key].category == 3) {
          listcat3.push(data[key]);
        } else {
          listcat4.push(data[key]);
        }
      }
    }
  });

  console.log("Data Sync");
  //   console.log(list);
  //   console.log(listcat1);
  //   console.log(listcat2);
  //   console.log(listcat3);
  //   console.log(listcat4);
}

setInterval(function () {
  if (nowAdplaying) {
    list = [];
    listcat1 = [];
    listcat2 = [];
    listcat3 = [];
    listcat4 = [];
    syncData();
  }
}, 600000);
// k-> no. of faces detected
// total -> total faces identified
// max -> max ppl spotted together

function initAll() {
  console.log("in initALl");
  happy = 0;
  sad = 0;
  angry = 0;
  surp = 0;
  fear = 0;
  disg = 0;
  yng = 0;
  mid = 0;
  old = 0;
  superold = 0;
  nextAD = [];
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

async function nextVid() {
  updateNextAD(age);
  console.log(listcat1);
  console.log(listcat2);
  console.log(listcat3);
  console.log(listcat4);
  animation.show();
  console.log("in next vid");
  console.log(nextAD);
  var toshowad = nextAD.pop();
  pushStats();
  initAll();
  console.log("showingthis");
  console.log(toshowad);
  // blur to loader
  var blur = ` <img
        src="./blur.jpg"
        style="
          z-index: 99;
          position: absolute;
          top: 0%;
          left: 0%;
          width: 100%;
          height: 100%;
        "
        alt=""
      />
    </div>
    <div id="overlays-wrap">
      <p
        class="vo-question"
        id="age"
        style="
          position: fixed;
          bottom: 60px;
          right: 20px;
          opacity: 0.5;
          z-index: 99;
        "
      >
        AGE
      </p>

      <img
        src="./logowhite.png"
        alt=""
        style="
          position: fixed;
          bottom: 5px;
          right: 7px;
          opacity: 0.5;
          z-index: 99;
        "
      />
     
     </div>`;
  $("#ad").html(blur);
  await sleep(4000);
  animation.hide();
  if (toshowad.mediaType == "image") {
    var imgcode = ` <img
        src="${toshowad.src}"
        style="
          z-index: 99;
          position: absolute;
          top: 0%;
          left: 0%;
          width: 100%;
          height: 100%;
        "
        alt=""
      />
    </div>
    <div id="overlays-wrap">
      <p
        class="vo-question"
        id="age"
        style="
          position: fixed;
          bottom: 60px;
          right: 20px;
          opacity: 0.5;
          z-index: 99;
        "
      >
        AGE
      </p>

      <img
        src="./logowhite.png"
        alt=""
        style="
          position: fixed;
          bottom: 5px;
          right: 7px;
          opacity: 0.5;
          z-index: 99;
        "
      />
      <h6 style="position:fixed;
            bottom:110px;
            left:27px;
            opacity:0.5;
            z-index:99;"> Scan Me</h6>
    <img
      id="barcode"
      src="https://api.qrserver.com/v1/create-qr-code/?data=${toshowad.uid}&amp;size=100x100"
      alt=""
      title="1111jjjjjjjjj"
      width="100"
      height="100"
      style="position:fixed;
            bottom:10px;
            left:10px;
            opacity:0.7;
            z-index:99;"
    />
     </div>`;
    $("#ad").html(imgcode);
    var sss = setTimeout(function () {
      nextVid();
      clearTimeout(sss);
    }, 20000);
  } else {
    var str = ` <video
        id="my_video_1"
        class="video-js vjs-default-skin  video vjs-16-9"
        controls
        preload="auto"
        width="640"
        height="360"
        data-setup="{ }"
        style="z-index: 1; position:absolute; top: 0%; left: 0%;"
        
      ></video><div id="overlays-wrap">
      <p
        class="vo-question"
        id="age"
        style="position:fixed;
            bottom:60px;
            right:20px;
            opacity:0.5;
            z-index:99;"
      >
        AGE
      </p>
 <h6 style="position:fixed;
            bottom:110px;
            left:27px;
            opacity:0.5;
            z-index:99;"> Scan Me</h6>
    <img
      <img
        src="./logowhite.png"
        alt=""
        style="position:fixed;
            bottom:5px;
            right:7px;
            opacity:0.5;
            z-index:99;"
      />
   
     <img
      id="barcode"
      src="https://api.qrserver.com/v1/create-qr-code/?data=${toshowad.uid}&amp;size=100x100"
      alt=""
      title="1111jjjjjjjjj"
      width="100"
      height="100"
      style="position:fixed;
            bottom:10px;
            left:10px;
            opacity:0.7;
            z-index:99;"
    />
     </div>
    
    `;
    $("#ad").html(str);

    playVideo(toshowad.src);
    console.log(toshowad.src);
  }
}

function updateAD(age) {
  if (age > 0) {
    if (age < 16) {
      console.log("children");

      var ageid = document.getElementById("age");
      if (ageid) {
        ageid.innerHTML = "Children";
      }
    } else if (age < 30) {
      console.log("Young");
      var ageid = document.getElementById("age");
      if (ageid) {
        ageid.innerHTML = "Young";
      }
    } else if (age < 50) {
      var ageid = document.getElementById("age");
      if (ageid) {
        ageid.innerHTML = "Mid";
      }

      console.log("Mid");
    } else {
      console.log("Old");
      var ageid = document.getElementById("age");
      if (ageid) {
        ageid.innerHTML = "Old";
      }
    }
  } else {
    console.log("no age");
    var ageid = document.getElementById("age");
    if (ageid) {
      ageid.innerHTML = "---";
    }
  }
}
function updateNextAD(age) {
  console.log(
    "yng " + yng + " mid " + mid,
    " old " + old + " super old " + superold
  );
  if (yng >= mid && yng > old && yng > superold) {
    console.log(" Playing for children");

    var adnode = listcat1.pop();
    listcat1.unshift(adnode);
    nextAD.push(adnode);
  } else if (mid > yng && mid >= old && mid > superold) {
    console.log(" Playing for Young");

    var adnode = listcat2.pop();
    listcat2.unshift(adnode);
    nextAD.push(adnode);
  } else if (old > yng && old > mid && old >= superold) {
    console.log(" Playing for  Mid");
    var adnode = listcat3.pop();
    listcat3.unshift(adnode);
    nextAD.push(adnode);
  } else {
    console.log(" Playing for  Old");

    var adnode = listcat4.pop();
    listcat4.unshift(adnode);
    nextAD.push(adnode);
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
      disg: disg,
    },
    age: popAge,
  };
}
$(document).ready(function () {
  loadData();
});

var nowAdplaying = false;
function playVideo(url) {
  console.log("in vid", url);
  nowAdplaying = true;
  var currPlayer = videojs("my_video_1");
  $("#overlays-wrap").appendTo($("#my_video_1"));
  var player = currPlayer;
  // $("#ad").fadeIn();
  //console.log("Start");
  //console.log(player);
  player.pause();
  player.src(url);
  player.load();

  player.play();

  player.on("ended", function () {
    // Play the endPlayer
    //console.dir("Done");
    nowAdplaying = false;
    player.pause();
    // $("#ad").fadeOut();
    var oldPlayer = document.getElementById("my_video_1");
    videojs(oldPlayer).dispose();

    // player.src(url);
    // player.load();
    // player.play();
    $("#overlays-wrap").appendTo($("#ad"));

    nextVid();

    // var oldPlayer = document.getElementById("my_video_1");
    // videojs(oldPlayer).dispose();
  });
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
