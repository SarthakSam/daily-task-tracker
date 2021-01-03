class Store {
    constructor() {
        this.weeklyData = this.loadWeekData();
    }

    addWeekData( weekData ) {
        this.weeklyData.push(weekData);
        this.saveWeekData();
    }

    loadWeekData() {
        return localStorage.getItem('weeklyData')? JSON.parse(localStorage.weeklyData) : []
    }

    saveWeekData(weeklyData) {
        localStorage.setItem('weeklyData', JSON.stringify(weeklyData) );
    }
}


const tasks = [
    "Meditation",
    "Brush at Night",
    "Pooja",
    "Exercise",
    "brush with charcoal",
    "eye drops",
    "Novel",
    "Bhagvat Gita",
    "Day Rev",
    "Exercise2",
]

let week = [];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const tableBody = document.querySelector("table tbody")
const reloadBtn = document.querySelector(".reload-table-btn");
const addTaskBtn = document.querySelector(".add-task-btn");

function loadTable() {
    tableBody.innerHTML = "";
    let todaysday = (new Date()).getDay();
    todaysday = (todaysday - 1) % 7;
    tasks.forEach( task => {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        const p = document.createElement("p");
        p.innerText = task;
        td.appendChild(p);
        tr.appendChild(td);
        for(let i = 0;i < 7;i++) {
            const td = document.createElement("td");
            const p = document.createElement("p");
            p.innerText =  week[i][task];
            if(i >= todaysday)
                p.setAttribute("contenteditable", true)
            else
                td.classList.add("disabled");
            td.appendChild(p);
            tr.appendChild(td);
        }
        tableBody.appendChild(tr);
    })
}

function loadTableHead() {
    const tableHead = document.querySelector("table thead");
    tableHead.innerHTML = ""
    const tr1 = document.createElement("tr");
    const th1 = document.createElement("th");
    const p1 = document.createElement("p");
    const tr2 = document.createElement("tr");
    const th2 = document.createElement("th");
    const p2 = document.createElement("p");

    p1.innerText =  "TASK";
    th1.appendChild(p1);
    tr1.appendChild(th1);

    p2.innerText =  "";
    th2.appendChild(p2);
    tr2.appendChild(th2);

    week.forEach( dayObj => {
        const th1 = document.createElement("th");
        const p1 = document.createElement("p");
        const th2 = document.createElement("th");
        const p2 = document.createElement("p");

        p1.innerText = days[dayObj.day];
        th1.appendChild(p1);
        tr1.appendChild(th1);

        p2.innerText = dayObj.date;
        th2.appendChild(p2);
        tr2.appendChild(th2);
    });
    tableHead.appendChild(tr1);
    tableHead.appendChild(tr2);
}

function createTaskObj() {
    let obj = {};
    tasks.forEach( task => {
        obj[task] = "";
    })
    return obj;
}

function createWeek() {
    week = [];
    let date = getNearestMonday();
    for(let i = 0;i < 7;i++) {
        let dayObj = createTaskObj();
        let dateAndDay = getDateAndDay(date, i);
        dayObj.date = dateAndDay[0];
        dayObj.day = dateAndDay[1];
        week.push(dayObj);
    }
}

// function load() {
//     createWeek();
//     loadTableHead();
//     loadTable();    
// }

function getDateAndDay(date, i) {
    let temp = new Date(date);
    temp.setDate(date.getDate() + i);
    return [`${temp.getDate()}/${temp.getMonth() + 1}/${temp.getFullYear()}`, temp.getDay()];
}

function getNearestMonday() {
    let date = new Date();
    let day = date.getDay();
    date.setDate(date.getDate() - day + 1);
    return date;
}

tableBody.addEventListener('keyup', (event) => {
    // console.log(event.target.parentNode.cellIndex, event.target.parentNode.parentNode.rowIndex);
    // console.log(event);
    const day = +event.target.parentNode.cellIndex - 1;
    const task = tasks[+event.target.parentNode.parentNode.rowIndex - 2];
    week[day][task] = event.target.innerText;
    store.saveWeekData(week);
})

reloadBtn.onclick = initApp;

document.onload = initApp();

var store;

function initApp() {
    store = new Store();
    createWeek();
    loadTableHead();
    loadTable();
}