/** 
 * 1.Render song (done)
 * 2.Scroll song (done)
 * 3.Play/ pause/ seek
 * 4.Cd rotate
 * 5.Next/ previous
 * 6.Random
 * 7.Next / Repeat when ended
 * 8.Active song
 * 9.Scroll active song
 * 10.Play song when click
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const next = $('.btn-next');
const prev = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');
const volumeMute = $('.volume-mute');
const volumeDown = $('.volume-down');
const settingVolume = $('.volume');
const html = $('html');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isTimeUpdate: true,
    isRandom: false,
    isRepeat: false,
    isSound: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Hold me while you wait',
            singer: 'Lewis Capaldi',
            path: './assets/music/Hold me while you wait  Lewis Capaldi.mp3',
            img: './assets/img/lewis.jpg'
        },
        {
            name: 'Empty space',
            singer: 'James Arthur',
            path: './assets/music/James Arthur  Empty Space.mp3',
            img: './assets/img/james.png'
        },
        {
            name: 'Your\'re beautiful',
            singer: 'James Blunt',
            path: './assets/music/James Blunt Youre Beautiful  Bonfire Heart  Nobel Peace Prize Concert.mp3',
            img: './assets/img/blunt.jpg'
        },
        {
            name: 'Not to day',
            singer: 'Image Dragons',
            path: './assets/music/Imagine Dragons  Not Today from ME BEFORE YOU.mp3',
            img: './assets/img/dragons.jpg'
        },
        {
            name: 'Talking to the moon',
            singer: 'Bruno Mars',
            path: './assets/music/Bruno Mars  Talking to the Moon.mp3',
            img: './assets/img/brunomars.jpg'
        },
        {
            name: 'All of me',
            singer: 'Jonh Legend',
            path: './assets/music/John Legend  All of Me.mp3',
            img: './assets/img/legend.jpg'
        },
        
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function() {
        const html = this.songs.map((song, index) => {
            return `
                <div class="song ${this.currentIndex === index ? 'active': ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.img}')"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p>${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>`;
        })
        playlist.innerHTML = html.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // handle cd spin
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(3600deg)'}
        ], {
            duration: 100000,
            interactions: Infinity,
        })
        cdThumbAnimate.pause()
        // change size of CD//
        document.onscroll = function() {
           const scrollTop = document.documentElement.scrollTop || window.scrollY;
           const newCdWidth = cdWidth - scrollTop;
           cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
           cd.style.opacity = newCdWidth / cdWidth;
        }

        // handle when click play ///
        playBtn.onclick = ()=>{
            if(_this.isPlaying) audio.pause();
            else audio.play();

            //when playing
            audio.onplay = ()=>{
                _this.isPlaying = true;
                player.classList.add("playing");
                cdThumbAnimate.play()
            }
            //when pausing
            audio.onpause = ()=>{
                _this.isPlaying = false;
                player.classList.remove("playing");
                cdThumbAnimate.pause()
            }

            // see time of song in per second
            audio.ontimeupdate = ()=>{
                if(_this.isTimeUpdate) {
                    if(audio.duration) {
                        const progressPercent = Math.floor((audio.currentTime / audio.duration)*100);
                        progress.value = progressPercent;
                    }
                }
            }

           
        }
        // forward and rewind on mobile
        document.querySelector('#progress').addEventListener('touchstart', touchStart);
        function touchStart() {
            _this.isTimeUpdate = false;
            progress.onchange = (e) => {
                const seekTime = audio.duration / 100 * e.target.value;
                audio.currentTime = seekTime;
            }
        }
        document.querySelector('#progress').addEventListener('touchend', touchEnd);
        function touchEnd() {
            _this.isTimeUpdate = true;
        }
        // forward and rewind on desktop
        progress.onmousedown = ()=>{
            _this.isTimeUpdate = false;
            progress.onchange = (e) => {
                const seekTime = audio.duration / 100 * e.target.value;
                audio.currentTime = seekTime;
            }
        }

        progress.onmouseup = ()=> {
            _this.isTimeUpdate = true;
        }

        // auto play when changes song
        next.onclick = () => {
            if(_this.isRandom) {
                _this.playRandomSong();
                audio.onplay = ()=>{
                    _this.isPlaying = true;
                    player.classList.add("playing");
                    cdThumbAnimate.play()
                }
            } else {
                _this.nextSong();
            }
            audio.play();
            audio.onplay = ()=>{
                _this.isPlaying = true;
                player.classList.add("playing");
                cdThumbAnimate.play()
            }
            _this.render();
            _this.scrollToActiveSong();
        }
        prev.onclick = () => {
            if(_this.isRandom) {
                audio.onplay = ()=>{
                    _this.isPlaying = true;
                    player.classList.add("playing");
                    cdThumbAnimate.play()
                }
                _this.playRandomSong();
                
            } else {
                _this.prevSong();
            }
            audio.play();
            audio.onplay = ()=>{
                _this.isPlaying = true;
                player.classList.add("playing");
                cdThumbAnimate.play()
            }
            _this.render();
            _this.scrollToActiveSong();
        }

        //Random when you click next/prev
        randomBtn.onclick = (e) => {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        repeatBtn.onclick = (e) => {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }
        
        audio.onended = ()=>{
            if (_this.isRepeat) {
                audio.play();
            } else {
                next.click();
            }
         }
         // listen behavior click  at song 
         playlist.onclick = (e)=>{
            const songNode = e.target.closest('.song:not(.active)');
            
            if(songNode || e.target.closest('.option')) {
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                    audio.onplay = ()=>{
                        _this.isPlaying = true;
                        player.classList.add("playing");
                        cdThumbAnimate.play()
                    }
            }
        }
        } 
        var isSetting;
        // Volume handle
        audio.volume = 1;
        settingVolume.value = 1;
        volumeDown.onclick = ()=>{
           _this.volumeMute();
        }

        volumeMute.onclick = ()=>{
            _this.volumeUnmute();
        }
        
        settingVolume.onchange = (e)=>{
            const volumeValue = e.target.value;
            _this.changeVolume(volumeValue);
            if(volumeValue === '0') {
                _this.volumeMute();
            }
            // else {
            //     _this.volumeUnmute();
            //     _this.changeVolume(volumeValue);
            // }
        }
    },
    scrollToActiveSong: function() {
        setTimeout(()=> {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }, 200);
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;    
        cdThumb.style.backgroundImage =  `url('${this.currentSong.img}')`;
        audio.src = this.currentSong.path;
    },
    loadConFig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function() {
      let newIndex;
      do {
          newIndex = Math.floor(Math.random() * this.songs.length);
      } while(newIndex === this.currentIndex);

      this.currentIndex = newIndex;
      this.loadCurrentSong();
    },
    volumeMute: function() {
        this.isSound = !this.isSound;
        audio.muted = this.isSound;
        volumeDown.style.display = "none";
        volumeMute.style.display = "block";
        console.log('sound off: ' + this.isSound);
    },
    volumeUnmute: function() {
        this.isSound = !this.isSound;
        audio.muted = this.isSound;
        volumeDown.style.display = "";
        volumeMute.style.display = "";
        console.log('sound on: ' + this.isSound);
    },
    changeVolume: function(volumeValue) {
        audio.volume = volumeValue;
    },
    start: function() {
        this.loadConFig();
        this.defineProperties();
        this.handleEvents();
        this.loadCurrentSong();
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
        this.render();
    }
} 

app.start();



