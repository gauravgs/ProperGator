let userName = document.getElementById("user-name");
let userMail = document.getElementById("user-mail");

userMail.textContent = localStorage.getItem("user-mail");
userName.textContent = localStorage.getItem("user-name");

auth.onAuthStateChanged(user => {
    if (user) {
        //User is signed in
    } else {
        window.location.href = "./index.html";
    }
});

$(document).ready(function () {
    $.getJSON("https://propoback.herokuapp.com/getAd", function (data) {
        var arr = [];
        Object.keys(data).forEach(function (key) {
            arr.push(data[key]);
        });
        arr.map(function (d) {
            if (d.uid == localStorage.getItem('campaignBoardUID')) {
                $("#main-menu-navigation").append(`
                    <li class="active nav-item">
                        <a href="javascript: campaignBoard('${d.uid}')"><i class="feather icon-circle"></i>
                            <span class="menu-title" data-i18n="Datatable">${d.name}</span>
                        </a>
                    </li>
                `);
                loadUI(d);
            } else {
                $("#main-menu-navigation").append(`
                <li class="nav-item">
                    <a href="javascript: campaignBoard('${d.uid}')"><i class="feather icon-circle"></i>
                        <span class="menu-title" data-i18n="Datatable">${d.name}</span>
                    </a>
                </li>
            `)
            }
        });
    });

    $.getJSON(`https://propogator-2cc09.firebaseio.com/.json`, function (d) {
        console.log(d)
        let uid = localStorage.getItem('campaignBoardUID');
        let data = d.Ad[uid];
        console.log(data);
        if (data.hasOwnProperty("Analytics")) {
            createAnalytics(uid);
        } else {
            let views = { cat1: 0, cat2: 0, cat3: 0, cat4: 0 };
            let gender = { males: 0, females: 0, others: 0 };
            let count = 0;
            createviewsPie(count)
            createViewsBar(views);
            createGenderPie(gender);
        }
    });
});

function createAnalytics(uid) {
    database.ref().child("Ad").child(uid).child("Analytics").on('value', function (d) {
        let data = d.val();
        var arr = [];
        Object.keys(data).forEach(function (key) {
            arr.push(data[key]);
        });
        let cat1 = 0;
        let cat2 = 0;
        let cat3 = 0;
        let cat4 = 0;
        let males = 0;
        let females = 0;
        let others = 0;
        arr.map(function (d) {
            switch (d.gender) {
                case "male": males++;
                    break;
                case "female": females++;
                    break;
                case "other": others++;
            }
            if (d.age < 16) {
                cat1++;
            } else if (d.age >= 16 && d.age < 30) {
                cat2++;
            } else if (d.age >= 30 && d.age < 50) {
                cat3++;
            } else {
                cat4++;
            }
        });
        let views = { cat1: cat1, cat2: cat2, cat3: cat3, cat4: cat4 };
        let gender = { males: males, females: females, others: others };
        let count = arr.length;
        console.log(count);
        createviewsPie(count)
        createViewsBar(views);
        createGenderPie(gender);
    });
}

function campaignBoard(uid) {
    localStorage.setItem('campaignBoardUID', uid);
    window.location.href = './campaignBoard.html';
}

function loadUI(data) {
    $("#campaignHeader").text(data.name);
}

function createviewsPie(count) {
    $('#viewsCount').text(count);
    let ctx = document.getElementById('viewsPie').getContext("2d");

    myChart = new Chart(ctx, {
        type: 'pie',

        data: {
            datasets: [{
                backgroundColor: ["#6D62E5"],
                data: [count]
            }],
            labels: ["Views"]
        },
        options: {
            legend: {
                display: true
            },

            tooltips: {
                enabled: true
            },
        }
    });
}

function createViewsBar(views) {

    let x = ["0-16", "16-30", "30-50", "50-99"];
    let y = [views.cat1, views.cat2, views.cat3, views.cat4];

    let ctx = document.getElementById('viewsBar').getContext("2d");

    myChart = new Chart(ctx, {
        type: 'bar',

        data: {
            labels: x,
            datasets: [{
                borderColor: "#f17e5d",
                backgroundColor: "#f17e5d",
                label: "Views",
                data: y
            }]
        },
        options: {
            legend: {
                display: true
            },

            tooltips: {
                enabled: true
            },

            scales: {
                yAxes: [{
                    ticks: {
                        fontColor: "#9f9f9f",
                        beginAtZero: true,
                        maxTicksLimit: 6
                    },
                    gridLines: {
                        zeroLineColor: "#ccc",
                        color: 'rgba(0,0,0,0.1)'
                    }

                }],
                xAxes: [{
                    gridLines: {
                        drawBorder: false,
                        color: 'rgba(0,0,0,0.1)'
                    }
                }]
            },
        }
    });
}

function createGenderPie(gender) {
    let ctx = document.getElementById('genderPie').getContext("2d");

    myChart = new Chart(ctx, {
        type: 'pie',

        data: {
            datasets: [{
                backgroundColor: ["#429bb8", "#FFB6C1", "#90EE90"],
                data: [gender.males, gender.females, gender.others]
            }],
            labels: ["Males", "Females", "Others"]
        },
        options: {
            legend: {
                display: true
            },

            tooltips: {
                enabled: true
            },
        }
    });
}