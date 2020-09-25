const dataSection = document.querySelector('.data');
const refreshButton = document.querySelector('.refreshData');
const standingsSection = document.querySelector('.standings');
const statsSection = document.querySelector('.statistics')
const fixturesSection = document.querySelector('.fixtures');
const navBtns = document.querySelectorAll('nav .tabs');


let standingsData = JSON.parse(localStorage.getItem('standings')) || getStandings();
let fixturesData = JSON.parse(localStorage.getItem('fixtures')) || getFixtures();
let statsData = JSON.parse(localStorage.getItem('stats')) || getStats();
console.log({standingsData, fixturesData, statsData});

async function getStandings() {
    const response = await fetch("https://api-football-v1.p.rapidapi.com/v2/leagueTable/2790", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            "x-rapidapi-key": "9b629c4000msh5f1e9f22f14de23p12cb4cjsn5860dd1d131a"
        }
    });
    const data = await response.json();
    localStorage.setItem('standings', JSON.stringify(data.api.standings[0]));
}

async function getFixtures() {
    const response = await fetch("https://api-football-v1.p.rapidapi.com/v2/fixtures/league/2790/2020-09-20", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            "x-rapidapi-key": "9b629c4000msh5f1e9f22f14de23p12cb4cjsn5860dd1d131a"
        }
    });
    const data = await response.json();
    localStorage.setItem('fixtures', JSON.stringify(data.api.fixtures));
}

async function getStats() {
    const response = await fetch("https://api-football-v1.p.rapidapi.com/v2/topscorers/2790", {
	    "method": "GET",
	    "headers": {
		    "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
		    "x-rapidapi-key": "9b629c4000msh5f1e9f22f14de23p12cb4cjsn5860dd1d131a"
	    }
    });
    const data = await response.json();
    localStorage.setItem('stats', JSON.stringify(data.api.topscorers));
}

function standingPop(standingsData) {
    console.log(standingsData);
    let num = 0;
    let labels = `
    <div class="headings">
        <span>#</span>
        <span>Team</span>
        <span>Played</span>
        <span>Won</span>
        <span>Lost</span>
        <span>Drawn</span>
        <span>Points</span>
    </div>
    `;

    let html = standingsData.map(team => {
        num++;
        return `
            <div className="standing">
                <span class="num">${num}</span>
                <span class="name">${team.teamName}</span>
                <span class="played">${team.all.matchsPlayed}</span>
                <span class="won">${team.all.win}</span>
                <span class="lost">${team.all.lose}</span>
                <span class="draw">${team.all.draw}</span>
                <span class="points">${team.points}</span>
            </div>
        `;
    }).join('');

    return standingsSection.innerHTML = [labels, html].join('');
}

function fixturesPop(fixturesData) {
    let html = fixturesData.map(fix => {
        return `
            <div className="match">
                <span className="home">${fix.homeTeam.team_name}</span>
                <span className="score">${fix.score.fulltime}</span>
                <span className="away">${fix.awayTeam.team_name}</span>
                <div className="additional__info">
                    <p className="referee">Referee: ${fix.referee}</p>
                    <p className="venue">Venue: ${fix.venue}</p>
                    <p className="eventDate">${moment(fix.event_date).format('MMMM Do YYYY, h:mm:ss a')}</p>
                </div>
            </div>
        
        `;
    }).join('');
    fixturesSection.innerHTML = html;
}

function statsPop(statsData) {
    let labels = `
        <div className="headings">
            <span>Player</span>
            <span>Goals</span>
            <span>Mins played</span>
        </div>
    `;
    let html = statsData.map(scorer => {
        return `
            <div className="scorer">
                <span>${scorer.player_name}</span>
                <span className="goals">${scorer.goals.total}</span>
                <span className="minsPlayed">${scorer.games.minutes_played}</span>
            </div>
        `;
    }).join('');
    statsSection.innerHTML = [labels, html].join('');
}

const showElem = (elem) => {
    elem.classList.add('is_visible');
}

const hideElem = (elem) => {
    elem.classList.remove('is_visible');
}

function animateTabs(e) {
    let curElement;
    if (e.target.classList.contains("fixturesBtn")) {
        [standingsSection, statsSection].forEach(elem => hideElem(elem));
        showElem(fixturesSection);
    } else if (e.target.classList.contains("standingsBtn")) {
        [fixturesSection, statsSection].forEach(elem => hideElem(elem));
        showElem(standingsSection);
    } else if (e.target.classList.contains('statsBtn')) {
        [standingsSection, fixturesSection].forEach(elem => hideElem(elem));
        showElem(statsSection);
    }
}


fixturesPop(fixturesData);
standingPop(standingsData);
statsPop(statsData);
navBtns.forEach(btn => btn.addEventListener('click', e => animateTabs(e)))
