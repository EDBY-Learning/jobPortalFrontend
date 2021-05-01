var BASE_URL = "http://127.0.0.1:8000/";

window.onload = function(){
    if(localStorage.getItem("access")){
        $.post(BASE_URL+'auth/login/verify/',{"token":localStorage.getItem("access")},function(data,status){
            console.log("have access")
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