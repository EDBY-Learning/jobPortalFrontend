if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('../../../firebase-messaging-sw.js').then((registration)=>{
          messaging.useServiceWorker(registration);
      })
    });
}



function getToken(){
    messaging.getToken({ vapidKey: 'BOUZ4zB6PhJ7P8ORhnstqLKTGBJNdu6u46gmxfCARlm6NDagE1mMj13qu3uxijKGZeMp1V97TxW-MjfeHELsZjs' }).then((currentToken) => {
        if (currentToken) {
            saveToken(currentToken)
        } else {
            // Show permission request UI
            console.log('No registration token available. Request permission to generate one.');
        }
        }).catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
    });
}

messaging.onTokenRefresh(function () {
      messaging.getToken().then(function (newToken) {
        saveToken(newToken)
      }).catch(function (err) {
        console.log('Unable to retrieve refreshed token ', err)
      })
})

messaging.onMessage((payload) => {
    console.log('Message received. ', payload);
});

function requestPermission() {
    // console.log(Notification.permission)
    if(Notification.permission=='granted'){
        getToken()
    }else if(Notification.permission=='default'){
        if(confirm("Do you want to recieve job updates, It increses your chance as you can apply earlier than others")){
            getToken()
        }else{
            
        }
    }else if(Notification.permission=='denied'){
        // alert("Allow Notification so that we can send you job updates!!")
    }
}

function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
        // Windows Phone must come first because its UA also contains "Android"
      if (/windows phone/i.test(userAgent)) {
          return "web";
      }
  
      if (/android/i.test(userAgent)) {
          return "android";
      }
  
      // iOS detection from: http://stackoverflow.com/a/9039885/177710
      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
          return "ios";
      }
  
      return "pc";
}

function saveToken(token){
    // console.log('checking for token')
    let authTokenSaved = localStorage.getItem('authTokenSaved');
    let tokenSaved = localStorage.getItem('tokenSaved');
    let accessToken = localStorage.getItem("access")
    
    let random = Math.floor((Math.random() * 100) + 1);
    if(authTokenSaved==token && random >40){
        return;
    }
    // console.log('No auth token found',tokenSaved)
    if (tokenSaved ==token){
        if(accessToken){
            authTokenSaveServer(token)
        }
        return;
    }
    normalTokenSave(token)
    
    
}


function authTokenSaveServer(token){
    $.ajax({
        url:CRM_URL+"auth_devices/",
        type:'POST',
        headers:{
            'Authorization': 'Bearer '+localStorage.getItem("access")
        },
        data:{
            name:navigator.platform,
            registration_id:token,
            type:getMobileOperatingSystem(),
        },
        success: function (result) {
            localStorage.setItem("authTokenSaved",token)
        },
        error: function (error) {
            if(error.status==401){
                refreshTokenAsAuthFailed()
            }if(error.status ==400){
                localStorage.setItem("authTokenSaved",token)
            }
        }
    })
}

function normalTokenSave(token){
    $.ajax({
        url:CRM_URL+"all_devices/",
        type:'POST',
        data:{
            name:navigator.platform,
            registration_id:token,
            type:getMobileOperatingSystem(),
        },
        success: function (result) {
            localStorage.setItem("tokenSaved",token)
        },
        error: function (error) {
            if(error.status==401){
                refreshTokenAsAuthFailed()
            }if(error.status ==400){
                localStorage.setItem("tokenSaved",token)
            }
        }
    })
}


window.addEventListener('load', requestPermission)