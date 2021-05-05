const dashboardArea = document.getElementById("dashboardArea")

window.onload = function(){
    console.log('hey')
    getDashboardData()
}

function getDashboardData(){
    
    $.ajax({
        url:JOB_URL+'dashboard_data/',
        type:'GET',
        headers:{
            'Authorization': 'Bearer '+localStorage.getItem("access"),
        },
        success: function (result) {
            result.forEach((element,idx) => {
                const card = getJobResultContent(element,"none")
                dashboardArea.innerHTML+=card 
            });
        },
        error: function (error) {
            console.log(error)
        }
    })
}