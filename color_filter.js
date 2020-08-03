/* Chroma Key effect form either the local camera or a local video file */

var rtop = 255, gtop = 255, btop = 255;
var rdown = 0, gdown = 0, bdown = 0;
var colorfilter = {};
var options;

function hasGetUserMedia() {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

var errorCallback = function(e) {
    console.log('Rejected!', e);
    colorfilter.video = document.getElementById('myVideo');
    document.getElementById('planb').style.display = "block";
    colorfilter.input = document.getElementById('vi');
    colorfilter.input.addEventListener('change', onInputChange, false);
};

var onInputChange = function() {
    const [file] = colorfilter.input.files;
    if (!file) {
        alert('No file selected!');
    }
    var url = window.URL.createObjectURL(file);
    colorfilter.video.src = url;
}

colorfilter.init = function init() {

    options = document.getElementById("sampler");
    options.addEventListener("mouseup", filterEstablishment, false);

    rc1 = document.getElementById("rcomponent1");
    gc1 = document.getElementById("gcomponent1");
    bc1 = document.getElementById("bcomponent1");
    rc2 = document.getElementById("rcomponent2");
    gc2 = document.getElementById("gcomponent2");
    bc2 = document.getElementById("bcomponent2");
    rc1.addEventListener("click", changeValues, false);
    gc1.addEventListener("click", changeValues, false);
    bc1.addEventListener("click", changeValues, false);
    rc2.addEventListener("click", changeValues, false);
    gc2.addEventListener("click", changeValues, false);
    bc2.addEventListener("click", changeValues, false);

    if (!hasGetUserMedia()) {
      alert('getUserMedia() is not supported in your browser');
    } else {
      colorfilter.video = document.getElementById('myVideo');
      colorfilter.video.onloadedmetadata = function(e) {
        colorfilter.c1 = document.getElementById('canvas1');
        colorfilter.ctx1 = colorfilter.c1.getContext('2d');
        colorfilter.c2 = document.getElementById('canvas2');
        colorfilter.ctx2 = colorfilter.c2.getContext('2d');

      };
      let self = colorfilter;
      colorfilter.video.addEventListener('play', function() {
          self.width = self.video.videoWidth / 2;
          self.height = self.video.videoHeight / 2;
          self.timerCallback();
        }, false);

      navigator.mozGetUserMedia({video: true, audio: false}, function(localMediaStream) {
        //colorfilter.video = document.getElementById('myVideo');
        colorfilter.video.src = window.URL.createObjectURL(localMediaStream);
      }, errorCallback);

    }
  },

  colorfilter.timerCallback = function timerCallback() {
    if (colorfilter.video.paused || colorfilter.video.ended) {
      return;
    }
    colorfilter.computeFrame(); // chroma-keying effect
    let self = colorfilter;
    setTimeout(function() {self.timerCallback();}, 0);
  },

  colorfilter.computeFrame = function computeFrame() {
      
      colorfilter.ctx1.drawImage(colorfilter.video, 0, 0, colorfilter.width, colorfilter.height); // draws actual frame
      let frame = colorfilter.ctx1.getImageData(0, 0, colorfilter.width, colorfilter.height); // get 32-bit pixel image data of the actual frame
      let l = frame.data.length / 4; // number of pixels in the image
      for (let i = 0; i < l; i++) { // analyses each frame's pixel, and extracts rgb components
        let r = frame.data[i * 4 + 0];
        let g = frame.data[i * 4 + 1];
        let b = frame.data[i * 4 + 2];
        //console.log(r + " " + b + " " + g);
        if (g <= gtop && r <= rtop && b <= btop && g >= gdown && r >= rdown && b >= bdown) // green
          {frame.data[i * 4 + 3] = 0;} // alpha value (rgba) -> 0 = transparent
      }
      colorfilter.ctx2.putImageData(frame, 0, 0); // the transparent part is going to be filled with the background image of canvas2
      return;
    }

function filterEstablishment() {
  rtop = document.getElementById("rcomponent2").value;
  gtop = document.getElementById("gcomponent2").value;
  btop = document.getElementById("bcomponent2").value;
  rdown = document.getElementById("rcomponent1").value;
  gdown = document.getElementById("gcomponent1").value;
  bdown = document.getElementById("bcomponent1").value;
  colorfilter.computeFrame();
}

function filterApplyment() {
    filterEstablishment()
    finalVideo = document.getElementById("myVideoFinal");
}

function changeValues() {
  var rv1 = document.getElementById("rcomponent1").value;
  var gv1 = document.getElementById("gcomponent1").value;
  var bv1 = document.getElementById("bcomponent1").value;
  var rv2 = document.getElementById("rcomponent2").value;
  var gv2 = document.getElementById("gcomponent2").value;
  var bv2 = document.getElementById("bcomponent2").value;

  var rpmin = document.getElementById("rpmin");
  var gpmin = document.getElementById("gpmin");
  var bpmin = document.getElementById("bpmin");
  var rpmax = document.getElementById("rpmax");
  var gpmax = document.getElementById("gpmax");
  var bpmax = document.getElementById("bpmax");

  rpmin.innerHTML = rv1;
  gpmin.innerHTML = gv1;
  bpmin.innerHTML = bv1;
  rpmax.innerHTML = rv2;
  gpmax.innerHTML = gv2;
  bpmax.innerHTML = bv2;
}

function changeImage(opt) {

    var cr7 = document.getElementById("cr7");
    var sky = document.getElementById("sky");
    var mordor = document.getElementById("mordor");

    if (opt.id == "cr7")
    {document.getElementById("canvas2").style = 'background-image: url("cr7.jpg")'; opt.checked=true; sky.checked=false; mordor.checked=false;}
    else if (opt.id == "sky")
    {document.getElementById("canvas2").style = 'background-image: url("sky.jpg")'; opt.checked=true; cr7.checked=false; mordor.checked=false;}
    else if (opt.id == "mordor")
    {document.getElementById("canvas2").style = 'background-image: url("mordor.jpg")'; opt.checked=true; sky.checked=false; cr7.checked=false;}
}
