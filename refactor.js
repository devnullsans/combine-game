const timerP = document.getElementById('timer');
const total = document.getElementById('total');
const dropD = document.querySelectorAll('div.dropD');
const buttonL = document.getElementById('lvlbtn');
const buttonT = document.getElementById('tmrbtn');
const tempMap = ['img/afghanistan.png', 'img/albania.png', 'img/algeria.png', 'img/andora.png', 'img/angola.png', 'img/argentina.png', 'img/armenia.png', 'img/australia.png', 'img/austria.png', 'img/bahrain.png', 'img/bangladesh.png', 'img/barbados.png', 'img/belgium.png', 'img/bostwana.png', 'img/brazil.png', 'img/bulgaria.png', 'img/cameroon.png', 'img/canada.png', 'img/chile.png', 'img/china.png', 'img/colombia.png', 'img/costarica.png', 'img/croatia.png', 'img/cuba.png', 'img/cyprus.png', 'img/czech.png', 'img/denmark.png', 'img/ecuador.png', 'img/egypt.png', 'img/esperanto.png', 'img/estonia.png', 'img/ethiopia.png', 'img/europe.png', 'img/finland.png', 'img/france.png', 'img/georgia.png', 'img/germany.png', 'img/ghana.png', 'img/greece.png', 'img/honduras.png', 'img/hongkong.png', 'img/hungary.png', 'img/iceland.png', 'img/india.png', 'img/indonesia.png', 'img/irak.png', 'img/iran.png', 'img/ireland.png', 'img/israel.png', 'img/italy.png', 'img/ivory.png', 'img/jamaica.png', 'img/japan.png', 'img/kenya.png', 'img/korea.png', 'img/koweit.png', 'img/laos.png', 'img/latvia.png', 'img/lebanon.png', 'img/liechtenstein.png', 'img/lithuania.png', 'img/luxembourg.png', 'img/lybia.png', 'img/malaysia.png', 'img/malta.png', 'img/mexico.png', 'img/morocco.png', 'img/movies.png', 'img/mozambique.png', 'img/music.png', 'img/namibia.png', 'img/nepal.png', 'img/netherlands.png', 'img/newzealand.png', 'img/nicaragua.png', 'img/nigeria.png', 'img/norway.png', 'img/pakistan.png', 'img/panama.png', 'img/paraguay.png', 'img/peru.png', 'img/philippines.png', 'img/poland.png', 'img/portugal.png', 'img/romania.png', 'img/russia.png', 'img/rw.png', 'img/saudi.png', 'img/scotland.png', 'img/senegal.png', 'img/serbia.png', 'img/singapore.png', 'img/slovakia.png', 'img/slovenia.png', 'img/south-africa.png', 'img/spain.png', 'img/sweden.png', 'img/switzerland.png', 'img/syria.png', 'img/taiwan.png', 'img/tanzania.png', 'img/thailand.png', 'img/togo.png', 'img/tunisia.png', 'img/turkey.png', 'img/uganda.png', 'img/uk.png', 'img/ukraine.png', 'img/uruguay.png', 'img/usa.png', 'img/uzbekistan.png', 'img/venezuela.png', 'img/vietnam.png', 'img/wales.png', 'img/yemen.png', 'img/zambia.png', 'img/zimbabwe.png'];
const trails = ['K', 'M', 'B', 'T', 'Qd', 'Qn', 'Sx', 'Sp', 'O', 'N', 'D', 'Ud', 'Dd', 'Td', 'Qtd', 'Qnd', 'Sxd', 'Spd', 'Od', 'Nd', 'V'];
const gameState = {
    coins: 0,
    level: 0,
    next: 1000,
    less: 20000,
    maxTime: 6000,
    runTime: 0,
    spawnID: -1,
    countID: -1,
    refTick: 50
};
let heldI = null;

function moneyFormat(value) {
    const amount = value.toString();
    const length = amount.length;
    if (length < 4) return `$${amount}`;
    else if (length < 7) return `$${amount.substring(0, length - 3)},${amount.substring(length - 3)}`;
    else {
        const mod = length % 3;
        const int = (length / 3 | 0) - 2;
        if (mod > 0) return `$${amount.substring(0, mod)}.${amount.substring(mod, mod + 3)}${trails[int]}`;
        else return `$${amount.substring(0, 3)}.${amount.substring(3, 6)}${trails[int - 1]}`;
    }
}
function newBin(level) {
    const img = document.createElement('img');
    img.setAttribute('src', tempMap[level]);
    img.setAttribute('alt', level);
    heldI = document.createElement('figure');
    heldI.setAttribute('id', Date.now().toString(36));
    heldI.setAttribute('data-flash', moneyFormat(3 ** level));
    heldI.setAttribute('draggable', true);
    heldI.ondragstart = onDragStart;
    heldI.appendChild(img);
}
function addBin() {
    let empty = null;
    for (const div of dropD)
        if (div.childElementCount == 0) {
            empty = div;
            break;
        }
    if (empty) {
        empty.appendChild(heldI);
        heldI = null;
        return true;
    } else return false;
}
function onSpawnTick() {
    timerP.value = gameState.runTime;
    if (gameState.runTime >= gameState.maxTime) {
        gameState.runTime = 0;
        newBin(gameState.level);
        if (!addBin()) clearInterval(gameState.spawnID);
    } else {
        gameState.runTime += gameState.refTick;
    }
}
function onCountTick() {
    let sum = 0;
    for (const div of dropD)
        if (div.lastElementChild?.classList.toggle('show'))
            sum += 3 ** div.lastElementChild.lastElementChild.alt;
    total.textContent = moneyFormat(gameState.coins += sum);
}
function onClickLevel(ev) {
    if (gameState.coins >= gameState.next) {
        const level = ++gameState.level;
        total.textContent = moneyFormat(gameState.coins -= gameState.next);
        ev.target.dataset.req = moneyFormat(gameState.next *= 2);
        for (const div of dropD)
            if (div.childElementCount > 0 && div.lastElementChild.lastElementChild.alt < level) {
                div.lastElementChild.lastElementChild.alt = level;
                div.lastElementChild.lastElementChild.src = tempMap[level];
                div.lastElementChild.dataset.flash = moneyFormat(3 ** level);
            }
        if (heldI) {
            heldI.lastElementChild.alt = level;
            heldI.lastElementChild.src = tempMap[level];
            heldI.dataset.flash = moneyFormat(3 ** level);
        }
    }
}
function onClickTimer(ev) {
    if (gameState.coins >= gameState.less) {
        timerP.max = gameState.maxTime -= 100;
        total.textContent = moneyFormat(gameState.coins -= gameState.less);
        ev.target.dataset.req = moneyFormat(gameState.less *= 4);
    }
}
function onAnimationEnd(ev) {
    ev.srcElement.classList.toggle('show');
}
function onDragOver(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'move';
}
function onDragStart(ev) {
    ev.dataTransfer.clearData();
    ev.dataTransfer.setData('text', ev.target.id);
    ev.dataTransfer.effectAllowed = 'move';
}
function onDrop(ev) {
    ev.preventDefault();
    const img = document.getElementById(ev.dataTransfer.getData('text'));
    const tag = ev.target;
    if (tag.tagName == 'DIV' && tag.childElementCount == 0) ev.target.appendChild(img);
    if (tag.tagName == 'FIGURE' && tag.id != img.id && tag.lastElementChild.alt == img.lastElementChild.alt) {
        const div = tag.parentElement;
        div.removeChild(tag);
        div.appendChild(img);
        const num = ++img.lastElementChild.alt;
        img.lastElementChild.src = tempMap[num];
        img.dataset.flash = moneyFormat(3 ** num);
        if (heldI && addBin()) gameState.spawnID = setInterval(onSpawnTick, gameState.refTick);
    }
}

for (const div of dropD) {
    div.onanimationend = onAnimationEnd;
    div.ondragover = onDragOver;
    div.ondrop = onDrop;
}
timerP.max = gameState.maxTime;
timerP.value = gameState.runTime;
buttonL.dataset.req = moneyFormat(gameState.next);
buttonL.onclick = onClickLevel;
buttonT.dataset.req = moneyFormat(gameState.less);
buttonT.onclick = onClickTimer;
gameState.spawnID = setInterval(onSpawnTick, gameState.refTick);
gameState.countID = setInterval(onCountTick, 1000);