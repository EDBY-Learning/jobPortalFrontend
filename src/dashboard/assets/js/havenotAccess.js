var BASE_URL = "https://ppritish5153.pythonanywhere.com/";

function verification_have_not_access(){
    // console.log('check')
    if(localStorage.getItem("access")){
        let timeNow = new Date().getTime()
        lastVerfiyCall = localStorage.getItem("lastVerfiyCall")?new Date(localStorage.getItem("lastVerfiyCall")).getTime():new Date(2000,10,30).getTime()
        // console.log((timeNow - lastVerfiyCall ) / 1000 )
        
        if((timeNow - lastVerfiyCall ) / 1000 > 900){
            $.post(BASE_URL+'auth/login/verify/',{"token":localStorage.getItem("access")},function(data,status){            
                console.log('have not access')
                localStorage.setItem('lastVerfiyCall',new Date().toString()) 
            }).fail(function(data){
                clear_localstorage()
                window.location.href = "../examples/login.html"
                localStorage.removeItem("lastVerfiyCall")
            }).always(function(){
                
            })
        }else{
            
        }
    }else{
        clear_localstorage()
        window.location.href = "../examples/login.html"
    }
     
}

window.addEventListener('load', verification_have_not_access)