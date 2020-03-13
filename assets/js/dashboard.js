let userName = document.getElementById('user-name');
let userMail = document.getElementById('user-mail');

userMail.textContent = localStorage.getItem('user-mail');
userName.textContent = localStorage.getItem('user-name');

$(document).ready(function () {

    $.getJSON('https://propoback.herokuapp.com/getAd', function (data) {
        console.log(data);
        var arr = []
        Object.keys(data).forEach(function (key) {
            arr.push(data[key])
        });
        arr.map(function (d) {
            $("#quick-card").append(`
            <div class="col-sm-4">
                <div class="card border-primary mb-3"">
                    <div class="card-body">
                        <h5 class="card-header mb-2"><b>${d.name}</b></h5>
                        <iframe width="280" height="240" src= ${d.src} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        <p class="card-text"><b>Video URL: </b>${d.src}</p>
                        <p class="card-text"><b>Category: </b>${d.category}</p>
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