var BASE_URL = "https://ppritish5153.pythonanywhere.com/";

window.onload = function(){
    if(localStorage.getItem("access")){
        $.post(BASE_URL+'auth/login/verify/',{"token":localStorage.getItem("access")},function(data,status){            
        }).fail(function(data){
            localStorage.clear();
            window.location.href = "../examples/login.html"
        }).always(function(){
            
        })
    }else{
        localStorage.clear();
        window.location.href = "../examples/login.html"
    }
     
}