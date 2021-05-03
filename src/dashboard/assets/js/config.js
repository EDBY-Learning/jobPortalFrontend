var BASE_URL = "http://127.0.0.1:8000/";
var JOB_URL = "http://127.0.0.1:8000/job/v2/"
$("#logoutUser").click(function(){
    console.log("here")
    if(localStorage.getItem("access")){
        $.ajax({
            url:BASE_URL+'auth/logout/',
            type:'POST',
            data:{
                'refresh':localStorage.getItem("refresh")
            },
            headers:{
                'Authorization': 'Bearer '+localStorage.getItem("access"),
            },
            success: function (result) {
                localStorage.clear()
                window.location.href = "../examples/login.html"
            },
            error: function (error) {
         
            }
        })
    }else{
        localStorage.clear()
            window.location.href = "../examples/login.html"
    }

    
  })