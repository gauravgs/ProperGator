$(document).ready(function() {
  playVideo("https://i.imgur.com/5vGIQQH.mp4");
});
function playVideo(url) {
  //console.log("in vid", url);

  var currPlayer = videojs("my_video_1");
  $("#overlays-wrap").appendTo($("#my_video_1"));
  var player = currPlayer;

  //console.log("Start");
  //console.log(player);

  player.src(url);
  player.load();
  player.play();

  currPlayer.on("ended", function() {
    // Play the endPlayer
    //console.dir("Done");
    player.pause();
    player.src(url);
    player.load();
    player.play();
    // var oldPlayer = document.getElementById("my_video_1");
    // videojs(oldPlayer).dispose();
  });
}
