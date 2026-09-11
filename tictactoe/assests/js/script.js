document.addEventListener('DOMContentLoaded', ()=>{
    document.body.classList.add('loaded');
})

let container = document.querySelector('.welcome-container');

function startGame(btn){
    stopConfetti();
    let div = document.createElement('div');
    div.classList.add('options');
    let btn1 = document.createElement('button');
    let btn2 = document.createElement('button');
    btn1.innerHTML = '<a href="twoPlayer.html">Two Player</a>'
    btn2.innerHTML = '<a href="AIPlayer.html">AI Player</a>'
    div.appendChild(btn1);
    div.appendChild(btn2);
    container.innerHTML = '';
    container.appendChild(div);
}

let audio = new Audio('../assests/tune/welcome.mp3');
let isPlaying = false;

function welcomeSong(){
    audio.play();
    isPlaying = true;
}

mute.addEventListener('click', ()=>{
    if(!isPlaying){
        welcomeSong();
        mute.innerHTML = '<i class="fa fa-volume-up"></i>';

    }if (audio.paused) {
        audio.play();
        mute.innerHTML = '<i class="fa fa-volume-up"></i>';
    } else {
        audio.pause();
        mute.innerHTML = '<i class="fa fa-volume-mute"></i>';
    }
})

document.addEventListener('click', ()=>{
    if(!isPlaying) {
        welcomeSong();
        startConfetti();
    }
})