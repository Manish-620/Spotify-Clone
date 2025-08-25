
/* Auth guard */
(function(){
  const logged = localStorage.getItem('spot_user');
  if(!logged){ location.href='login.html'; return; }
  const user = JSON.parse(logged);
  document.addEventListener('DOMContentLoaded', ()=>{
    const name = user.name || user.email.split('@')[0];
    const n = document.getElementById('userName');
    if(n) n.textContent = name.charAt(0).toUpperCase()+name.slice(1);
    document.getElementById('logoutBtn').addEventListener('click', ()=>{ localStorage.removeItem('spot_user'); location.href='login.html'; });
  });
})();

/* Music player */
const audio = document.getElementById('audio');
const btnPlay = document.getElementById('btnPlay');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const seekBar = document.getElementById('seekBar');
const volBar = document.getElementById('volBar');
const curTimeEl = document.getElementById('curTime');
const durTimeEl = document.getElementById('durTime');
const nowCover = document.getElementById('nowCover');
const nowTitle = document.getElementById('nowTitle');
const nowArtist = document.getElementById('nowArtist');
const heroArt = document.getElementById('heroArt');
const trackGrid = document.getElementById('trackGrid');
const playlistList = document.getElementById('playlistList');
const searchInput = document.getElementById('searchInput');

const LIB = [
  { id: 1, title: "Nebula Drift", artist: "Spotlite", cover: "assets/covers/nebula_drift.svg", src: "assets/songs/nebula_drift.wav", tags:["Focus","Ambient"] },
  { id: 2, title: "Midnight Loop", artist: "Spotlite", cover: "assets/covers/midnight_loop.svg", src: "assets/songs/midnight_loop.wav", tags:["Lo-Fi","Chill"] },
  { id: 3, title: "Sunrise Echoes", artist: "Spotlite", cover: "assets/covers/sunrise_echoes.svg", src: "assets/songs/sunrise_echoes.wav", tags:["Uplift","Study"] },
];

let queue = [...LIB];
let index = 0;
let isSeeking = false;

function fmt(t){ if(!isFinite(t)) return "0:00"; const m=Math.floor(t/60); const s=Math.floor(t%60).toString().padStart(2,'0'); return `${m}:${s}`; }

function renderTracks(list){
  trackGrid.innerHTML='';
  list.forEach((t,i)=>{
    const card=document.createElement('div'); card.className='card';
    card.innerHTML = `
      <img src="${t.cover}" alt="cover"/>
      <div class="meta"><div class="title">${t.title}</div><div class="artist">${t.artist}</div><div class="tags">${t.tags.map(x=>`<span class='pill'>${x}</span>`).join('')}</div></div>
      <button class="playCard">Play</button>`;
    card.querySelector('.playCard').addEventListener('click', ()=> playAt(i));
    card.querySelector('img').addEventListener('click', ()=> playAt(i));
    trackGrid.appendChild(card);
  });
}

function renderPlaylists(){
  playlistList.innerHTML='';
  const pls=[{name:"Focus Flow",ids:[1,3]},{name:"Night Ride",ids:[2,1]},{name:"Daily Mix",ids:[1,2,3]}];
  pls.forEach(pl=>{ const li=document.createElement('li'); li.textContent=pl.name; li.addEventListener('click', ()=>{ queue = LIB.filter(t=>pl.ids.includes(t.id)); index=0; load(index,true); renderTracks(queue); }); playlistList.appendChild(li); });
}

function load(i, autoplay=false){
  if(i<0||i>=queue.length) return; index=i; const t=queue[index];
  audio.src=t.src; nowCover.src=t.cover; nowTitle.textContent=t.title; nowArtist.textContent=t.artist;
  heroArt.style.backgroundImage = `url('${t.cover}')`; heroArt.style.filter = 'blur(40px) saturate(1.1)'; heroArt.style.opacity = '0.6';
  if(autoplay) audio.play();
}

function playAt(i){ load(i,true); }

btnPlay.addEventListener('click', ()=> { if(audio.paused) audio.play(); else audio.pause(); });
btnPrev.addEventListener('click', ()=> { index = (index-1+queue.length)%queue.length; load(index,true); });
btnNext.addEventListener('click', ()=> { index = (index+1)%queue.length; load(index,true); });

audio.addEventListener('play', ()=> btnPlay.textContent='⏸');
audio.addEventListener('pause', ()=> btnPlay.textContent='▶');

audio.addEventListener('timeupdate', ()=> { if(isSeeking) return; if(audio.duration) seekBar.value = Math.floor((audio.currentTime/audio.duration)*100); curTimeEl.textContent = fmt(audio.currentTime); durTimeEl.textContent = fmt(audio.duration||0); });

seekBar.addEventListener('input', ()=> { isSeeking = true; });
seekBar.addEventListener('change', ()=> { if(audio.duration) audio.currentTime = (seekBar.value/100)*audio.duration; isSeeking=false; });

volBar.addEventListener('input', ()=> audio.volume = volBar.value);
audio.addEventListener('ended', ()=> btnNext.click());

searchInput.addEventListener('input', ()=> { const q=searchInput.value.toLowerCase(); const list = LIB.filter(t => (t.title+t.artist+t.tags.join(' ')).toLowerCase().includes(q)); queue = list.length?list:[...LIB]; renderTracks(queue); });

document.getElementById('playHero').addEventListener('click', ()=> load(0,true));

renderPlaylists(); renderTracks(queue); load(0,false);
