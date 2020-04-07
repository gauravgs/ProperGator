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
    let addimg1 = document.getElementById('addimg1').value;
    let addimg2 = document.getElementById('addimg2').value;
    let type = document.getElementById('campaignType').value;
    let src = document.getElementById('src').value;
    let age = document.getElementById('ageCategory').value;
    let gender = document.getElementById('gender').value;
    let website = document.getElementById('website').value;
    let amazonLink = document.getElementById('amazonLink').value;
    let flipkartLink = document.getElementById('flipkartLink').value;
    let description = document.getElementById('description').value;

    let data1 = {
        name: name,
        thumbnail: thumbnail,
        addimg1: addimg1,
        addimg2: addimg2,
        mediaType: type,
        src: src,
        category: age,
        gender: gender,
        website: website,
        amazon: amazonLink,
        flipkart: flipkartLink,
        description: description
    }
    let data2 = {
        title: name,
        img1: thumbnail,
        img2: addimg1,
        img3: addimg2,
        website: website,
        amazon: amazonLink,
        flipkart: flipkartLink,
        info: description
    }

    if (name != '' && thumbnail != '' && addimg1 != '' && addimg2 != '' && type != '' && src != '' && age != '' && gender != '' && website != '' && amazonLink != '' && flipkartLink != '' && description != '') {
        var key = database.ref().child("Ad").push(data1).key;
        database.ref().child("Ad").child(key).child("uid").set(key);
        database.ref().child("App").child(key).set(data2);
        alert("Campaign Created!");
        clearForm();
    } else {
        alert("Please fill all the fields");
    }

}

function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('thumbnail').value = '';
    document.getElementById('addimg1').value = '';
    document.getElementById('addimg2').value = '';
    document.getElementById('campaignType').value = '';
    document.getElementById('src').value = '';
    document.getElementById('ageCategory').value = '';
    document.getElementById('gender').value = '';
    document.getElementById('website').value = '';
    document.getElementById('amazonLink').value = '';
    document.getElementById('flipkartLink').value = '';
    document.getElementById('description').value = '';
}