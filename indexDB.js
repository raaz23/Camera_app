let req = indexedDB.open("gallery", 1);

let database;
let numberOfMedia = 0;
let backBtn=document.querySelector(".backBtn");

req.addEventListener("success", function () {
  database = req.result;
});
req.addEventListener("upgradeneeded", function () {
  let db = req.result;

  db.createObjectStore("media", { keyPath: "mId" });
});
req.addEventListener("error", function () {});

function saveMedia(media) {
  if (!database) return;

  let data = {
    mId: Date.now(),
    mediaData: media,
  };

  let tx = database.transaction("media", "readwrite");
  let mediaObjectStore = tx.objectStore("media");
  mediaObjectStore.add(data);
}

function viewMedia() {
  if (!database) return;

  let galleryContainer = document.querySelector(".gallery-container");

  let tx = database.transaction("media", "readonly");
  let mediaObjectStore = tx.objectStore("media");

  let req = mediaObjectStore.openCursor();

  req.addEventListener("success", function () {
   let  cursor = req.result;
    if (cursor) {

        numberOfMedia++;

      let mediaCard = document.createElement("div");

      mediaCard.classList.add("media-card");

      mediaCard.innerHTML = `<div class="actual-media"></div>
      <div class="media-buttons">
          <button class="media-download">Download</button>
          <button data-mid = "${cursor.value.mId}" class="media-delete">Delete</button>
      </div>`;

      let data=cursor.value.mediaData; // cursor me jo value hai uska media data nikallo;

      let actualMediaDiv=mediaCard.querySelector(".actual-media");
      let download=mediaCard.querySelector(".media-download");
      let dltBnt=mediaCard.querySelector(".media-delete");
     
      dltBnt.addEventListener("click",function (e){
        let id=Number(e.currentTarget.getAttribute("data-mid"));
        DeleteMedia(id);
        e.currentTarget.parentElement.parentElement.remove();

      })

      if(typeof data=="string"){
        let image=document.createElement("img");
            image.src=data;
            actualMediaDiv.append(image);
            download.addEventListener("click",function(e){
                downloadMedia(data,"string");
            });
      }
      else if(typeof data=="object") {
            
        let video=document.createElement("video");
        let url=URL.createObjectURL(data);
        video.loop=true;
        video.autoplay=true;
        video.muted=true;
        video.focus=true;
        video.controls=true;
        video.src=url;
        actualMediaDiv.append(video);
        download.addEventListener("click",function(e){
            downloadMedia(url,"object");
        });
        
}
         galleryContainer.append(mediaCard);
         cursor.continue();
      }
      else {
        console.log(numberOfMedia);
        if(numberOfMedia==0){
            let g=galleryContainer.textContent="No media is available here, yet it is empty !!";
           
        }
      }

      
  });
}

function downloadMedia(url,type){
    let tx=database.transaction("media","readonly");
    let mediaObj=tx.objectStore("media");
    let a=document.createElement("a");
    if(type=="string"){
        a.href=url;
        a.download="image.png";
        a.click();
        a.remove();
    }
    else if(type==="object"){
        a.href=url;
        a.download="videos.mp4";
        a.click();
        a.remove();
    }
    
}
function DeleteMedia(id){
    let tx=database.transaction("media","readwrite");
    let mediaObj=tx.objectStore("media");
    mediaObj.delete(id);
}

backBtn.addEventListener("click",function(e){
    location.assign("./index.html");
});