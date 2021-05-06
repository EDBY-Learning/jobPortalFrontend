window.onload = function(){
    getPersonalData()
}

function getPersonalData(){
    $.ajax({
        url:TEACHER_URL+'profile/1/',
        type:'GET',
        headers:{
            'Authorization': 'Bearer '+localStorage.getItem("access"),
        },
        success: function (result) {
            
        },
        error: function (error) {
     
        }
    })
}