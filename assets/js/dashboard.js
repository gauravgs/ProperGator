let userName = document.getElementById("user-name");
let userMail = document.getElementById("user-mail");

userMail.textContent = localStorage.getItem("user-mail");
userName.textContent = localStorage.getItem("user-name");

$(document).ready(function () {
  $.getJSON("https://propoback.herokuapp.com/getAd", function (data) {
    var arr = [];
    Object.keys(data).forEach(function (key) {
      arr.push(data[key]);
    });
    var ageGroup = "";
    arr.map(function (d) {
      if (d.category == 1) {
        ageGroup = "below 16 years";
      } else if (d.category == 2) {
        ageGroup = "16 to 30 years";
      } else if (d.category == 3) {
        ageGroup = "30 to 50 years";
      } else {
        ageGroup = "above 50 years";
      }
      $("#quick-card").append(`
        <div class="col-sm-4">
          <div class="card border-primary mb-3"">
            <div class="card-body">
              <h5 class="card-header mb-2"><a href="javascript: campaignBoard('${d.uid}')"><b style="color: black">${d.name}</b></a></h5>
              <center>
                <img width="280" height="200" src= ${d.thumbnail}></img>
              </center>
              <br><br>
              <p class="card-text"><b>Campaign Source: </b><a href="${d.src}" target="_blank">Click here</a></p>
              <p class="card-text"><b>Age Group: </b>${ageGroup}</p>
              <p class="card-text"><b>Gender: </b>${d.gender}</p>
            </div>
          </div>
        </div>
      `);
      $("#main-menu-navigation").append(`
        <li class="nav-item">
          <a href="javascript: campaignBoard('${d.uid}')"><i class="feather icon-circle"></i>
            <span class="menu-title" data-i18n="Datatable">${d.name}</span>
          </a>
        </li>
      `)
    });
  });
});

function campaignBoard(uid) {
  localStorage.setItem('campaignBoardUID', uid);
  window.location.href = "./campaignBoard.html";
}

auth.onAuthStateChanged((user) => {
  if (user) {
    //User is signed in
  } else {
    window.location.href = "./index.html";
  }
});

$("#createCampaign").click(function () {
  window.location.href = "./createCampaign.html";
});

$("#viewCampaign").click(function () {
  window.location.href = "./underConstruction.html";
});
