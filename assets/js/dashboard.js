let userName = document.getElementById('user-name');
let userMail = document.getElementById('user-mail');

userMail.textContent = localStorage.getItem('user-mail');
userName.textContent = localStorage.getItem('user-name');

$(document).ready(function () {

    $.getJSON('https://propoback.herokuapp.com/getAd', function (data) {
        var arr = []
        Object.keys(data).forEach(function (key) {
            arr.push(data[key])
        });
        var ageGroup = "";
        arr.map(function (d) {
            if (d.category == 1) {
                ageGroup = "below 15 years";
            } else if (d.category == 2) {
                ageGroup = "15 to 27 years";
            } else if (d.category == 3) {
                ageGroup = "27 to 50 years"
            } else {
                ageGroup = "above 50 years";
            }
            $("#quick-card").append(`
            <div class="col-sm-4">
                <div class="card border-primary mb-3"">
                    <div class="card-body">
                        <h5 class="card-header mb-2"><b>${d.name}</b></h5>
                        <img width="280" height="200" src= ${d.thumbnail}></img>
                        <br><br>
                        <p class="card-text"><b>Campaign Source: </b><a href="${d.src}" target="_blank">Click here</a></p>
                        <p class="card-text"><b>Age Group: </b>${ageGroup}</p>
                        <p class="card-text"><b>Gender: </b>${d.gender}</p>
                    </div>
                </div>
            </div>`)
        });
    });
});

auth.onAuthStateChanged((user) => {
    if (user) {
        //User is signed in
    } else {
        window.location.href = "./login.html";
    }
});

$('#createCampaign').click(function () {
    window.location.href = './createCampaign.html';
});

$('#viewCampaign').click(function () {
    window.location.href = './underConstruction.html';
});