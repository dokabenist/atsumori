
const Util = require('./util');

class Atsumori {

  static IMAGE_ID = {
    STAMP: 'stamp.png',
    STEAM: 'steam.png'
  };
  static SOUND_ID = {
    SHOUT_0: 'sound_0',
    SHOUT_1: 'sound_1'
  };
  static ELEMENT_ID = {
    OVERLAY: 'atsumoriOverlay'
  };
  static KEYFRAME_ID = {
    STAMP: 'atsumoriStamp',
    STEAM: 'atsumoriSteam'
  };

  static BASE_INTERVAL = 15 * 1000;
  static MIN_INTERVAL = 10 * 1000;

  constructor (config) {
    this.config = config || {resourcePath: './resources/'};

    this.videoElement = null;
    this.overlayElement = null;

    this.images = {};
    this.soundBuffers = {};
    this.audioContext = null;
    this.loaded = {
      image: false,
      sound: false
    };

    this.timerId = null;
    this.maxInterval = 0;

    this.setup();
  }

  setup () {
    let timerId = window.setTimeout(() => {
      window.clearTimeout(timerId);

      // check video element
      this.videoElement = this.findVideoElement();
      if (!this.videoElement) return;

      // load
      this.startLoadImage();
      this.startLoadSound();

      // CSS3 Animation
      this.setupKeyframes();

      // check later
      this.checkAndPlayLater();
    }, 5 * 1000);
  }

  setupKeyframes () {
    let keyframes = [
      `@keyframes ${Atsumori.KEYFRAME_ID.STAMP} {\n 0% { transform: scale(2.0, 2.0); opacity: 0.30;}\n 75% { transform: scale(0.8, 0.8);  opacity: 0.8;}\n 100% { transform: scale(1.0, 1.0);  opacity: 1.0;}\n}`,
      `@keyframes ${Atsumori.KEYFRAME_ID.STEAM} {\n 0% { transform: scale(1.0, 1.0); opacity: 0.20;}\n 20% { transform: scale(1.0, 1.0);  opacity: 1.0;}\n 100% { transform: scale(1.25, 1.5);  opacity: 0.0;}\n}`
    ];
    let style = window.document.createElement('style');
    (window.document.head || window.document).appendChild(style);
    keyframes.forEach((keyframe) => {
      style.sheet.insertRule(keyframe, style.sheet.cssRules.length);
    });
  }

  findVideoElement () {
    var foundVideo = null, foundVideoSize = 480 * 270;
    Array.from(window.document.getElementsByTagName('video')).forEach(video => {
      let w = video.clientWidth, h = video.clientHeight, size = w * h;
      if (size > foundVideoSize) {
        foundVideoSize = size;
        foundVideo = video;
      }
    });
    return foundVideo;
  }

  startLoadImage () {
    const imageIds = [Atsumori.IMAGE_ID.STAMP, Atsumori.IMAGE_ID.STEAM];
    let leastImageIds = new Set(imageIds);

    imageIds.forEach((imageId) => {
      let url = `${this.config.resourcePath}${imageId}`;
      let image = new Image();
      image.onload = () => {
        // set image
        image.onload = null;
        this.images[imageId] = image;
        
        // all loaded?
        leastImageIds.delete(imageId);
        if (leastImageIds.size == 0) {
          this.loaded.image = true;
        }
      };
      image.src = url;
    });
  }

  startLoadSound () {
    let audioContextName = ['AudioContext', 'webkitAudioContext'].find((name) => {
      return (typeof window[name] === 'function');
    });
    if (!audioContextName) return;
    this.audioContext = new (window[audioContextName])();

    let dummyAudio = new Audio();
    let playableSpec = [
      {mimeType: 'audio/aac', extension: 'm4a'},
      {mimeType: 'audio/ogg', extension: 'ogg'}
    ].find(function (item) {
      return dummyAudio.canPlayType(item.mimeType);
    });
    dummyAudio = null;
    if (!playableSpec) return false;

    const soundIds = [Atsumori.SOUND_ID.SHOUT_0, Atsumori.SOUND_ID.SHOUT_1];
    let leastSoundIds = new Set(soundIds);
    let extension = playableSpec.extension;

    soundIds.forEach((soundId) => {
      let url = `${this.config.resourcePath}${soundId}.${extension}`;
      let request = new XMLHttpRequest();
      request.open('GET', url);
      request.responseType = 'arraybuffer';

      request.onload = () => {
        request.onload = null;
        if ((request.status < 400) && request.response) {
          this.audioContext.decodeAudioData(request.response, (buffer) => {
            this.soundBuffers[soundId] = buffer;

            // all loaded?
            leastSoundIds.delete(soundId);
            if (leastSoundIds.size == 0) {
              this.loaded.sound = true;
            }
          });
        }
      };
      request.send();
    });
  }

  checkAndPlay () {
    if (this.isPlayable()) {
      this.play();
      this.maxInterval = Atsumori.BASE_INTERVAL;
    }
    else {
      this.maxInterval = Math.floor(this.maxInterval * 0.75);
    } 
  }

  checkAndPlayLater () {
    let videoElement = this.videoElement;
    let leastSecond = Math.floor((videoElement.duration - videoElement.currentTime) * 1000);
    let interval = Math.max(
      Util.random(Math.max(leastSecond, this.maxInterval)),
      Atsumori.MIN_INTERVAL
    );
    this.timerId = window.setTimeout(this.onTimer.bind(this), interval);
  }

  play () {
    // calculate size
    let videoElement = this.videoElement;
    let videoWidth = videoElement.videoWidth, videoHeight = videoElement.videoHeight;
    var clientWidth = videoElement.clientWidth, clientHeight = videoElement.clientHeight;
    var offsetLeft, offsetTop;
    if ((videoWidth > 0) && (videoHeight > 0)) {
      if ((clientWidth / videoWidth) < (clientHeight / videoHeight)) {
        offsetLeft = 0;
        let newHeight = Math.floor(clientWidth * videoHeight / videoWidth);
        offsetTop = Math.floor((clientHeight - newHeight) / 2);
        clientHeight = newHeight;
      }
      else {
        offsetTop = 0;
        let newWidth = Math.floor(clientHeight * videoWidth / videoHeight);
        offsetLeft = Math.floor((clientWidth - newWidth) / 2);
        clientWidth = newWidth;
      }
    }

    let styles = {
      display: 'block',
      position: 'absolute',
      overflow: 'hidden',
      margin: '0px',
      padding: '0px',
      borderWidth: '0px',
      left: `${videoElement.offsetLeft + offsetLeft}px`,
      top: `${videoElement.offsetTop + offsetTop}px`,
      width: `${clientWidth}px`,
      height: `${clientHeight}px`,
      zIndex: 9999,
      pointerEvents: 'none'
    };

    // overlay container
    if (!this.overlayElement) {
      this.overlayElement = Util.createElement('div', {id: Atsumori.ELEMENT_ID.OVERLAY}, styles);
      this.videoElement.parentElement.appendChild(this.overlayElement);
    }
    else {
      Util.updateElementStyles(this.overlayElement, styles);
    }

    // stamp image
    let stampImage = this.images[Atsumori.IMAGE_ID.STAMP];
    if (stampImage.parentElement) {
      stampImage.parentElement.removeChild(stampImage);
    }

    let imageWidth = Math.floor(clientWidth * 0.30);
    let imageHeight = Math.floor(imageWidth * 0.67);
    Util.updateElementStyles(
      stampImage,
      {
        position: 'absolute',
        margin: '0px',
        padding: '0px',
        borderWidth: '0px',
        left: `${clientWidth - imageWidth}px`,
        top: `${clientHeight - imageHeight}px`,
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
        animation: `${Atsumori.KEYFRAME_ID.STAMP} 0.20s linear 0.0s forwards`
      }
    );
    this.overlayElement.appendChild(stampImage);

    // steam image
    let steamImage = this.images[Atsumori.IMAGE_ID.STEAM];
    if (steamImage.parentElement) {
      steamImage.parentElement.removeChild(steamImage);
    }

    Util.updateElementStyles(
      steamImage,
      {
        position: 'absolute',
        margin: '0px',
        padding: '0px',
        borderWidth: '0px',
        left: `${clientWidth - imageWidth}px`,
        top: `${clientHeight - imageWidth}px`,
        width: `${imageWidth}px`,
        height: `${imageWidth}px`,
        transformOrigin: '100% 100%',
        animation: `${Atsumori.KEYFRAME_ID.STEAM} 0.90s linear 0.05s forwards`
      }
    );
    this.overlayElement.appendChild(steamImage);

    // play sound
    let soundSource = this.audioContext.createBufferSource();
    soundSource.buffer = this.soundBuffers[Util.randomItem([Atsumori.SOUND_ID.SHOUT_0, Atsumori.SOUND_ID.SHOUT_0, Atsumori.SOUND_ID.SHOUT_1])];
    soundSource.connect(this.audioContext.destination);
    soundSource.start(0.1);

    // banish later
    let timerId = window.setTimeout(() => {
      window.clearTimeout(timerId);
      Util.updateElementStyles(this.overlayElement, {display: 'none'});
    }, 1600);
  }

  onTimer () {
    if (this.timerId) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }

    this.checkAndPlay();
    this.checkAndPlayLater();
  }

  isPlayable () {
    let videoElement = this.videoElement;

    // resource has loaded
    if (!this.loaded.image) return false;
    if (!this.loaded.sound) return false;

    // video element is visible
    if (!Util.isVisibleElement(videoElement)) return false;

    // video element is playing
    if (videoElement.paused || !(videoElement.duration > 0)) return false;

    return true;
  }

}

module.exports = Atsumori;
