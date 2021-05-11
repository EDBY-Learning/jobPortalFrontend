var BASE_URL = "https://ppritish5153.pythonanywhere.com/";

window.onload = function(){
    if(localStorage.getItem("access")){
        $.post(BASE_URL+'auth/login/verify/',{"token":localStorage.getItem("access")},function(data,status){
            console.log("have access")
            window.location.href = "../dashboards/dashboard.html"
        }).fail(function(data){
            localStorage.clear();
        }).always(function(){
            
        })
    }else{
        localStorage.clear();
    }
    
}