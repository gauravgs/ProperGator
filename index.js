// $(document).ready(function() {
//   playVideo(
//     "https://res.cloudinary.com/dztcftsli/video/upload/v1583983652/Inspiration_-_2016_Harley-Davidson_Motorcycles_twr67d.mp4"
//   );
// });
// function playVideo(url) {
//   //console.log("in vid", url);

//   var currPlayer = videojs("my_video_1");
//   $("#overlays-wrap").appendTo($("#my_video_1"));
//   var player = currPlayer;

//   //console.log("Start");
//   //console.log(player);

//   player.src(url);
//   player.load();
//   player.play();

//   currPlayer.on("ended", function() {
//     // Play the endPlayer
//     //console.dir("Done");
//     player.pause();
//     player.src(url);
//     player.load();
//     player.play();
//     // var oldPlayer = document.getElementById("my_video_1");
//     // videojs(oldPlayer).dispose();
//   });
// }
