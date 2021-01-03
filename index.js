class Store {
    constructor() {
        this.weeklyData = this.loadWeekData();
    }

    addWeekData( weekData ) {
        this.weeklyData.push(weekData);
        this.saveWeekData();
    }

    loadWeekData() {
        console.log(localStorage.getItem('weeklyData'))
        return localStorage.getItem('weeklyData')? JSON.parse(localStorage.weeklyData) : []
    }

    contentChanged(day, task, val) {
        this.currWeek = this.weeklyData.splice(-1)[0];
        this.currWeek.data[day][task] = val;
        this.weeklyData.push(this.currWeek)
        this.saveWeekData();
    }

    saveWeekData() {
        localStorage.setItem('weeklyData', JSON.stringify(this.weeklyData) );
    }
}

class Week {
    constructor(tasks) {
        this.data = [];
        let date = this.getNearestMonday();
        for(let i = 0;i < 7;i++) {
            let dayObj = this.createTaskObj(tasks);
            let dateAndDay = this.getDateAndDay(date, i);
            dayObj.date = dateAndDay[0];
            dayObj.day = dateAndDay[1];
            this.data.push(dayObj);
        }   
    }

    getNearestMonday() {
        let date = new Date();
        let day = date.getDay();
        if(day == 0)
            day = 7;
        date.setDate(date.getDate() - day + 1);
        return date;
    }    

    createTaskObj(tasks) {
        let obj = {};
        tasks.forEach( task => {
            obj[task] = "";
        })
        return obj;
    }

    getDateAndDay(date, i) {
        let temp = new Date(date);
        temp.setDate(date.getDate() + i);
        return [`${temp.getDate()}/${temp.getMonth() + 1}/${temp.getFullYear()}`, temp.getDay()];
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

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const tableBody = document.querySelector("table tbody")
const reloadBtn = document.querySelector(".reload-table-btn");
const addTaskBtn = document.querySelector(".add-task-btn");

function loadTable(week) {
    tableBody.innerHTML = "";
    let todaysday = (new Date()).getDay();
    todaysday = (todaysday + 7 - 1) % 7;
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
            p.innerText =  week.data[i][task]? week.data[i][task]: "";
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

function loadTableHead(week) {
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

    week.data.forEach( dayObj => {
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

tableBody.addEventListener('keyup', (event) => {
    // console.log(event.target.parentNode.cellIndex, event.target.parentNode.parentNode.rowIndex);
    // console.log(event);
    const day = +event.target.parentNode.cellIndex - 1;
    const task = tasks[+event.target.parentNode.parentNode.rowIndex - 2];
    store.contentChanged(day, task, event.target.innerText);
})

reloadBtn.onclick = () => {
    initApp();
    alert("app reloaded")
}

addTaskBtn.onclick = () => {
}

document.onload = initApp();

var store;

function initApp() {
    store = new Store();
    let currWeek = loadData();
    renderScreen(currWeek);
}

function renderScreen(currWeek) {
    loadTableHead(currWeek);
    loadTable(currWeek);
}

function loadData() {
    if( store.weeklyData.length == 0 || isNewWeek())
        addNewWeek();
    return store.weeklyData.slice(-1)[0];    
}

function addNewWeek() {
    const week = new Week(tasks);
    store.addWeekData(week);
}

function isNewWeek() {
    const todaysDate = new Date();
    const weekObj = store.weeklyData.slice(-1)[0];
    const weekStartDate = new Date(weekObj.data[0].date);
    let daysDiff = Math.floor( todaysDate.getTime() - weekStartDate.getTime() )/(1000*60*60*24);
    return daysDiff > 6 && todaysDate.getDay() == 1;
}