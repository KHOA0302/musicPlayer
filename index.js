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

const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const next = $('.btn-next');
const prev = $('.btn-prev');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isTimeUpdate: true,
    time: {
        spin: audio.duration,
    },
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
    ],
    render: function() {
        const html = this.songs.map((song) => {
            return `
                <div class="song">
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
        $('.playlist').innerHTML = html.join('');
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
       
        // change current time of songs
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
            _this.nextSong();
            audio.play();
            audio.onplay = ()=>{
                _this.isPlaying = true;
                player.classList.add("playing");
                cdThumbAnimate.play()
            }
        }

        prev.onclick = () => {
            _this.prevSong();
            audio.play();
            audio.onplay = ()=>{
                _this.isPlaying = true;
                player.classList.add("playing");
                cdThumbAnimate.play()
            }
        }
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;    
        cdThumb.style.backgroundImage =  `url('${this.currentSong.img}')`;
        audio.src = this.currentSong.path;
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
    start: function() {
        this.defineProperties();
        this.handleEvents();
        this.loadCurrentSong();
        this.render();
    }
} 

app.start();




