var BASE_URL = " https://b0cf420b56f7.ngrok.io/";

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