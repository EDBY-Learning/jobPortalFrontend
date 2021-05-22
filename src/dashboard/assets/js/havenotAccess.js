var BASE_URL = "https://e0c1beaf270b.ngrok.io/";

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