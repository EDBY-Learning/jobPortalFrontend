const dashboardArea = document.getElementById("dashboardArea")
var jobData = null;

window.onload = function(){
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
            jobData = result
            console.log(result)
            document.getElementById("headingAreaDashboard").innerHTML = `Results: ${jobData.length}`
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

function openSwal(id){
    data = jobData.find(x => x.id == id)
    console.log(data)
    if(data){
        let m1 = $(makeJobPostModal(data))
        m1.modal("show")
    }else{
        
    }
}