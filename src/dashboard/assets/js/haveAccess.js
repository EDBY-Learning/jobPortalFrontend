var BASE_URL = "https://ppritish5153.pythonanywhere.com/";

function verification_have_access(){
    // console.log('check')
    if(localStorage.getItem("access")){
        $.post(BASE_URL+'auth/login/verify/',{"token":localStorage.getItem("access")},function(data,status){
            console.log("have access")
            window.location.href = "../dashboards/dashboard.html"
        }).fail(function(data){
            clear_localstorage()
        }).always(function(){
            
        })
    }else{
        clear_localstorage()
    }
    
}

window.addEventListener('load', verification_have_access)
