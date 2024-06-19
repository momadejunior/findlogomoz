  let url = 'https://api-us-west-2.hygraph.com/v2/cltnjyce406ze07v0wktr3jh3/master';

 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBreW_0IJDQ2F_duc2ZeRPAfl6foP93cUc",
  authDomain: "findlogos-77103.firebaseapp.com",
  projectId: "findlogos-77103",
  storageBucket: "findlogos-77103.appspot.com",
  messagingSenderId: "428504989885",
  appId: "1:428504989885:web:2b036aa0a83b3ed84277d4",
  measurementId: "G-RN7V4PLTH8"
};

  firebase.initializeApp(firebaseConfig);

  function publishAsset(id) {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `mutation PublicarImagem {
          publishAsset(where: {id: "${id}"}, to: PUBLISHED) {
            id
            url
          }
        }`,
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.errors) {
        console.log("Asset not published, retrying...");
	       let constraint = document.getElementById('upload-sucess').innerHTML=`<div>Asset not published, retrying...</div>`;
        setTimeout(() => publishAsset(id), 5000); // Retry after 5 seconds
      } else {
        console.log("Asset published successfully!");
	      let constraint = document.getElementById('upload-sucess').innerHTML=`<div>Logo Uploaded successfully!</div>`;
      }
    });
  }

  document.getElementById('fileButton').addEventListener('change', function (e) {
    var file = e.target.files[0];
    var storageRef = firebase.storage().ref('images/' + file.name);
    var uploadTask = storageRef.put(file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      function (snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        document.getElementById('uploader').value = progress;
        console.log('Upload is ' + progress + '% done');
	       let constraint = document.getElementById('upload-sucess').innerHTML=`<div>Upload is '${progress}'% done</div>`;
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING:
            console.log('Upload is running');
            break;
        }
      },
      function (error) {
        switch (error.code) {
          case 'storage/unauthorized':
            break;
          case 'storage/canceled':
            break;
          case 'storage/unknown':
            break;
        }
      },
      function () {
        var downloadURL = uploadTask.snapshot.downloadURL;
        console.log('downloadURL', downloadURL);
        fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              query: `mutation InsertFile {
                createAsset(data: {fileName: "", uploadUrl: "${downloadURL}"}) {
                  id
                  url
                  fileName
                }
              }`,
            })
          })
          .then(res => res.json())
          .then(data => {
            console.log(data);
            let idImage = data.data.createAsset.id;
            console.log(idImage);
            idImage.toString();
            publishAsset(idImage);
          });
      });
  });
