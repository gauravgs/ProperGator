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

function createCampaign() {
    let name = document.getElementById('name').value;
    let thumbnail = document.getElementById('thumbnail').value;
    let type = document.getElementById('campaignType').value;
    let src = document.getElementById('src').value;
    let age = document.getElementById('ageCategory').value;
    let gender = document.getElementById('gender').value;
    let website = document.getElementById('website').value;
    let productLink = document.getElementById('productLink').value;

    if (name != '' && thumbnail != '' && type != '' && src != '' && age != '' && gender != '') {
        $.getJSON('https://propoback.herokuapp.com/addNewAd?' +
            'name=' + name +
            '&thumbnail=' + thumbnail +
            '&mediaType=' + type +
            '&src=' + src +
            '&category=' + age +
            '&gender=' + gender +
            '&website=' + website +
            '&productLink=' + productLink,
            function (f) {
                console.log(f);
            }
        );
    } else {
        alert("Please fill the form completly")
    }

    document.getElementById('name').value = '';
    document.getElementById('campaignType').value = '';
    document.getElementById('src').value = '';
    document.getElementById('ageCategory').value = '';
    document.getElementById('gender').value = '';
    document.getElementById('website').value = '';
    document.getElementById('productLink').value = '';
}