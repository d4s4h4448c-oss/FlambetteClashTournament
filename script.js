let players = [];
let upperBracket = [];
let lowerBracket = [];
let finalMatch = null;

document.getElementById('generateTournament').addEventListener('click', generateTournament);
document.getElementById('captureTournament').addEventListener('click', captureTournament);
document.getElementById('resetTournament').addEventListener('click', resetTournament);
document.getElementById('newTournament').addEventListener('click', () => {
    const playerCount = parseInt(document.getElementById('playerCount').value);
    if (playerCount >= 4 && playerCount <= 32) {
        players = [...Array(playerCount).keys()].map(i => `Joueur ${i + 1}`);
        generateTournament();
    } else {
        alert("Veuillez entrer un nombre de joueurs valide (4-32).");
    }
});

function generateTournament() {
    const upperMatches = document.getElementById('upperMatches');
    upperMatches.innerHTML = '';
    upperBracket = createMatches(players);
    renderMatches(upperBracket, upperMatches);

    const lowerMatches = document.getElementById('lowerMatches');
    lowerMatches.innerHTML = '';
    lowerBracket = []; // reset lower bracket
    document.getElementById('finalMatch').style.display = 'none';
}

function createMatches(players) {
    let matches = [];
    for (let i = 0; i < players.length; i += 2) {
        matches.push([players[i], players[i + 1] || "BYE"]);
    }
    return matches;
}

function renderMatches(matches, container) {
    matches.forEach((match, index) => {
        const matchDiv = document.createElement('div');
        matchDiv.classList.add('match');
        matchDiv.innerHTML = `
            <input type="text" value="${match[0]}" />
            <input type="number" class="input-score" id="score${index}1" placeholder="Score" />
            <input type="text" value="${match[1]}" />
            <input type="number" class="input-score" id="score${index}2" placeholder="Score" />
            <button onclick="validateMatch(${index})">Valider le match</button>
        `;
        container.appendChild(matchDiv);
    });
}

function validateMatch(index) {
    const score1 = parseInt(document.getElementById(`score${index}1`).value) || 0;
    const score2 = parseInt(document.getElementById(`score${index}2`).value) || 0;
    const match = upperBracket[index];

    if (score1 > score2) {
        updateMatch(match[0], match[1], 'upper', index);
    } else if (score2 > score1) {
        updateMatch(match[1], match[0], 'upper', index);
    } else {
        alert("Les scores doivent être différents pour déterminer un gagnant.");
    }
}

function updateMatch(winner, loser, bracket, index) {
    const upperMatches = document.getElementById('upperMatches');
    const lowerMatches = document.getElementById('lowerMatches');
    const matchElement = upperMatches.children[index];

    matchElement.classList.add('winner');
    matchElement.querySelectorAll('input')[0].style.backgroundColor = '#28a745';
    matchElement.querySelectorAll('input')[2].style.backgroundColor = '#dc3545';

    if (bracket === 'upper') {
        // Move winner to next round
        const nextRoundIndex = Math.floor(index / 2);
        if (!upperBracket[nextRoundIndex]) {
            upperBracket[nextRoundIndex] = [winner];
        } else {
            upperBracket[nextRoundIndex].push(winner);
        }
        // Move loser to lower bracket
        lowerBracket.push(loser); // add to lower bracket
        renderLowerBracket();
    }
}

function renderLowerBracket() {
    const lowerMatches = document.getElementById('lowerMatches');
    lowerMatches.innerHTML = '';
    lowerBracket.forEach((player, index) => {
        const matchDiv = document.createElement('div');
        matchDiv.classList.add('match');
        matchDiv.innerHTML = `
            <input type="text" value="${player}" />
            <input type="number" class="input-score" id="lowerScore${index}1" placeholder="Score" />
            <input type="text" value="Perdant ${index + 1}" />
            <input type="number" class="input-score" id="lowerScore${index}2" placeholder="Score" />
            <button onclick="validateLowerMatch(${index})">Valider match lower</button>
        `;
        lowerMatches.appendChild(matchDiv);
    });
}

function validateLowerMatch(index) {
    const score1 = parseInt(document.getElementById(`lowerScore${index}1`).value) || 0;
    const score2 = parseInt(document.getElementById(`lowerScore${index}2`).value) || 0;

    if (score1 > score2) {
        // Logic to handle winner and elimination
        alert(`${document.getElementById(`lowerScore${index}1`).value} gagne !`);
    } else {
        alert(`${document.getElementById(`lowerScore${index}2`).value} gagne !`);
    }
}

function captureTournament() {
    html2canvas(document.querySelector("#bracket")).then(canvas => {
        const link = document.createElement('a');
        link.download = 'tournament_bracket.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}

function resetTournament() {
    players = [];
    upperBracket = [];
    lowerBracket = [];
    const upperMatches = document.getElementById('upperMatches');
    upperMatches.innerHTML = '';
    document.getElementById('lowerMatches').innerHTML = '';
    document.getElementById('finalMatch').style.display = 'none';
}
