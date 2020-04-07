let userName = document.getElementById("user-name");
let userMail = document.getElementById("user-mail");

userMail.textContent = localStorage.getItem("user-mail");
userName.textContent = localStorage.getItem("user-name");

auth.onAuthStateChanged(user => {
    if (user) {
        //User is signed in
    } else {
        window.location.href = "./login.html";
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
});

function campaignBoard(uid) {
    localStorage.setItem('campaignBoardUID', uid);
    window.location.href = './campaignBoard.html';
}

function loadUI(data) {
    $("#campaignHeader").text(data.name);

    createGraph();
}

function createGraph() {

    let x = ["20 Jan", "24 Jan", "28 Jan", "1 Feb", "5 Feb", "9 Feb", "13 Feb", "17 Feb", "21 Feb", "25 Feb", "29 Feb", "1 Mar", "8 Mar", "12 Mar", "14 Mar"];
    let y = [278, 916, 6000, 14300, 27400, 39800, 59800, 72400, 75500, 77700, 79300, 80300, 80700, 80900, 81000];

    let ctx = document.getElementById('analyticsChart').getContext("2d");

    myChart = new Chart(ctx, {
        type: 'bar',

        data: {
            labels: x,
            datasets: [{
                borderColor: "#f17e5d",
                backgroundColor: "#f17e5d",
                pointRadius: 2,
                pointHoverRadius: 4,
                borderWidth: 3,
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
                        maxTicksLimit: 6,
                    },
                    gridLines: {
                        drawBorder: false,
                        zeroLineColor: "#ccc",
                        color: 'rgba(0,0,0,0.1)'
                    }

                }],
                xAxes: [{
                    gridLines: {
                        drawBorder: false,
                        color: 'rgba(0,0,0,0.1)'
                    },
                    ticks: {
                        padding: 20,
                        fontColor: "#9f9f9f",
                        maxTicksLimit: 7
                    }
                }]
            },
        }
    });
}