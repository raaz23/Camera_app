let mediaPlayer = document.querySelector("video");
let RecordBtn = document.querySelector("#record");
let capture =document.querySelector("#capture");
let body=document.querySelector("body");
let isRecorder = false;

let mediaRecorder= null;;
let chunks = [];

let FilterColor;

let allFilter=document.querySelectorAll(".filter");
let zoomIn=document.querySelector(".zoom_in");
let zoomOut=document.querySelector(".zoom_out");
let currZoom=1;

zoomIn.addEventListener("click",function(){
    currZoom=currZoom+0.1;
    if(currZoom>3) currZoom=3;
    mediaPlayer.style.transform=`scale(${currZoom})`;
    console.log(currZoom);

});
zoomOut.addEventListener("click",function(){
    currZoom=currZoom-0.1;
    if(currZoom<1) currZoom=1;
    mediaPlayer.style.transform=`scale(${currZoom})`;
    console.log(currZoom);
});

for(let i=0;i<allFilter.length;i++){
    allFilter[i].addEventListener("click",function(e){


        let previousFilter=document.querySelector(".filter-div");
        if(previousFilter) {
            previousFilter.remove();
        }
        FilterColor=e.currentTarget.style.backgroundColor;
        console.log("starting here", FilterColor);
        let div=document.createElement("div");
        div.classList.add("filter-div");
        div.style.backgroundColor=FilterColor;
        body.append(div);  
        console.log(3);

    });
}

capture.addEventListener("click",function(e){
    let span=capture.querySelector("span");

span.classList.add("animation-capture");

setTimeout(function(){
    span.classList.remove("animation-capture");
},1000)

    let canvas=document.createElement("canvas");
    canvas.height=mediaPlayer.videoHeight;
    canvas.width=mediaPlayer.videoWidth;

    let tool=canvas.getContext("2d");
    tool.translate(canvas.width/2,canvas.height/2);
    tool.scale(currZoom,currZoom);
    tool.translate(-canvas.width/2,-canvas.height/2)


    tool.drawImage(mediaPlayer,0,0,);
    if (FilterColor) {
        console.log("Applying filter color:", FilterColor);
        tool.fillStyle = FilterColor;
        tool.fillRect(0, 0, canvas.width, canvas.height);
    }
   
    let url=canvas.toDataURL();
    saveMedia(url);

    /* console.log(1);
    let a = document.createElement("a");
        a.href = url;
        a.download = "image.png"; // 
        a.click();
        a.remove();  */
        
});


RecordBtn.addEventListener("click", function(e) {
    let span=document.querySelector("#record span");
    let previousFilter=document.querySelector(".filter-div");
    if(previousFilter) {
        previousFilter.remove();
    }
    FilterColor="";
    if(isRecorder){
        stopRecording();
        isRecorder=false;
        console.log("okk 1");
        span.classList.remove("animation-video");
    }
    else {
        startRecording();
        isRecorder = true;
        console.log("ook 2");
        span.classList.add("animation-video");
        currZoom=1;
        mediaPlayer.style.transform=`scale(${currZoom})`;
    }
});

let promiseToAccess = navigator.mediaDevices.getUserMedia({ video: true, audio: true ,});

        promiseToAccess.then(function (mediaStream) {
            mediaPlayer.srcObject = mediaStream;

            mediaRecorder = new MediaRecorder(mediaStream);
            mediaRecorder.addEventListener("dataavailable", function (e) {
                chunks.push(e.data);
            });

            mediaRecorder.addEventListener("stop", function (e) {
                let blob = new Blob(chunks, { type: "video/mp4" });
                chunks = [];

                saveMedia(blob);

                /* let link = URL.createObjectURL(blob);

                let a = document.createElement("a");
                a.href = link;
                a.download = "recorded_video.mp4";
                a.click();
                a.remove(); */
            });
        }).catch(function (error) {
            console.log("Error accessing media devices:", error);
        });

        function stopRecording() {
            if (mediaRecorder && mediaRecorder.state !== "inactive") {
                mediaRecorder.stop();

            }
        }

        function startRecording() {
            if (mediaRecorder && mediaRecorder.state === "inactive") {
                   mediaRecorder.start();
        
            } else {
                console.error("MediaRecorder not available or already recording.");
            }
        }
    
        let gallery=document.querySelector("#gallery");
        gallery.addEventListener("click", function(e){
            location.assign("./gallery.html");
        });