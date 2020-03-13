let userName = document.getElementById('user-name');
let userMail = document.getElementById('user-mail');

userMail.textContent = localStorage.getItem('user-mail');
userName.textContent = localStorage.getItem('user-name');

$('#createCampaign').click(function () {
    window.location.href = '#';
});

$('#viewCampaign').click(function () {
    window.location.href = './underConstruction.html';
});

$('#viewAllCampaign').click(function () {
    window.location.href = './underConstruction.html';
});

function createCampign() {
    let name = document.getElementById('name').value;
    let vurl = document.getElementById('vurl').value;
    let category = document.getElementById('category').value;
    let gender = document.getElementById('gender').value;
    if (name !== '' && category !== '' && vurl !== '' && gender !== '') {
        $.getJSON('https://propoback.herokuapp.com/addNewAd?src=' + vurl + '&category=' + category + '&name=' + name + '&gender=' + gender, function (f) { console.log("A") });
        alert("Campaign Created!");
    } else {
        alert("Please fill all details");
    }
    document.getElementById('name').value = '';
    document.getElementById('vurl').value = '';
    document.getElementById('category').value = '';
    document.getElementById('gender').value = '';
}; 