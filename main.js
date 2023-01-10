const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $('.cd');
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev');
const randonBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist')
// const PLAYER_STORAGE_KEY = 'F8_PLAYER'
const app = {
    currentIndex: 0,
    isPlaying: false,
    israndom : false,
    isRepeat : false,
    // config : JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Tết Này Con Sẽ Về',
            singer: 'Bùi Công Nam',
            path: './music/Tet-Nay-Con-Se-Ve-Bui-Cong-Nam.mp3',
            image: './music/th (3).jfif'
        },
        {
            name: 'Nàng Thơ',
            singer: 'Hoàng Dũng',
            path: './music/Nang-Tho-Hoang-Dung.mp3',
            image: './music/th.jfif'
        }
    ],
    // setConfig: function(key, value) {
    //     this.config[key] = value;
    //     localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    // },
    render: function() {
        // nhạn về một mảng
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active':''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')"> </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('');// chuyển thành string
    },
    defineProperty: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
       
    }
    ,
    handleEvent: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        //Xử lý cd quay 
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000,//10 seconds
            iterations: Infinity
        })
        cdThumbAnimate.pause()
        // Xử lý phóng to thu nhỏ cd
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
        // Xư lý khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            }else {
                audio.play();
            }
        }
        // Khi song được play
        audio.onplay = function() {
            cdThumbAnimate.play();
            _this.isPlaying = true;
            player.classList.add('playing');
        }
        // khi song pouse 
        audio.onpause = function() {
            player.classList.remove('playing');
            _this.isPlaying = false;
            cdThumbAnimate.pause();

        }
        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration ) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent;
            }
        }
        // Xử lý khi tua 
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime;
        }

        // khi next bài hát
        nextBtn.onclick = function () {
           if (_this.israndom) {
               _this.playRandomSong();
            }else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        // khi prev song 
        prevBtn.onclick = function () {
            if (_this.israndom) {
                _this.playRandomSong();
             }else {
                 _this.prevSong();
             }
           audio.play();
            _this.render();
            _this.scrollToActiveSong();

        }
        // khi random được xử lý bật tắt  
        randonBtn.onclick = function (e) {
            _this.israndom = !_this.israndom;
            randonBtn.classList.toggle('active', _this.israndom);
        }
        // xu ly lap lai 1 song
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);

        }

        // xử lý next next song khi audio ended
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            }else {
                nextBtn.click();
            }
        }
        // Lắng nghe click vào playList
        playlist.onclick = function(e) { 
            // xử lý khi click vào song 
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
            }
        }   
    },
    scrollToActiveSong: function () {
        setTimeout(function () {
            $('.song.active').scrollIntoView({
                behavior: 'smooth'
            });
        }, 300)
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path;
    },

    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) { 
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) { 
            this.currentIndex = this.songs.length - 1;;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function() {
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length);
        }while (newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function () {
        //gán cầu hình vào ứng dụng
        // this.loadConfig();
        // Định nghĩa các thuộc tính cho OBJECT
        this.defineProperty();

        // Lắng nghe Và sử lý các sự kiện
        this.handleEvent();
        // tải thông tin bài hát đầu tiên UI khi chạy ứng dụng
        this.loadCurrentSong();
        // Render playlist 
        this.render();
        // Hiển Thị Trạng THái Ban Đầu Của Btn Repeatt
        // randonBtn.classList.toggle('active', this.israndom);
        // repeatBtn.classList.toggle('active', this.isRepeat);

    }
}
app.start();