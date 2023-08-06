let videoPlayer = document.querySelector("video");
let RecordBtn = document.querySelector("#record");

let isRecorder = false;

let mediaRecorder=null;
let chunks = [];


RecordBtn.addEventListener("click", function(e) {
    if(isRecorder){
        mediaRecorder.stop();
        isRecorder=false;
        console.log("okk 1");
    }
    else {
        mediaRecorder.start();
        isRecorder = true;
        console.log("ook 2");
    }
});
let promiseToUseCamera = navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

promiseToUseCamera
  .then(function (mediaStream) {
    // lamen terms me mediaStream ek object hai jisme continously camera and mic ka input ara hai and wo input fir maine using objects video me dalra hu
  
    videoPlayer.srcObject = mediaStream;

    mediaRecorder = new MediaRecorder(mediaStream);

    mediaRecorder.addEventListener("dataavailable", function (e) {
      chunks.push(e.data);
    });

    mediaRecorder.addEventListener("stop", function (e) {
      let blob = new Blob(chunks, { type: "video/webd" });
      chunks = [];

       let link = URL.createObjectURL(blob); //kisi tarike se blob ki link bnadi h

       let a = document.createElement("a");
       a.href = link;
       a.download = "video.mp4";
       a.click();
      a.remove();
    });
  })
  .catch(function () {
    console.log("user has denied the access of camera");
  });