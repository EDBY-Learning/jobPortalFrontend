const dashboardArea = document.getElementById("dashboardArea")
var jobData = null;
var preferredJob = null;
var bookMarkedJob = null;

var current_page = 1;
var records_per_page = 12;

window.onload = function(){
    getDashboardData()
}

function prevPage()
{
    if (current_page > 1) {
        current_page--;
        changePage(current_page);
    }
}

function nextPage()
{
    if (current_page < numPages()) {
        current_page++;
        changePage(current_page);
    }
}

function changePage(page)
{
    var btn_next = document.getElementById("btn_next");
    var btn_prev = document.getElementById("btn_prev");
    
    var page_span = document.getElementById("page");
 
    // Validate page
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();

    dashboardArea.innerHTML = "";

    for (var i = (page-1) * records_per_page; i < (page * records_per_page) && i < jobData.length; i++) {
        if(document.getElementById("preferredButton").disabled){
            card = getJobResultContent(jobData[i],"block")
        }else{
            card = getJobResultContent(jobData[i],"none")
        }
        dashboardArea.innerHTML+=card
    }
    page_span.innerHTML = page + "/" + numPages();

    if (page == 1) {
        btn_prev.style.visibility = "hidden";
    } else {
        btn_prev.style.visibility = "visible";
    }

    if (page == numPages()) {
        btn_next.style.visibility = "hidden";
    } else {
        btn_next.style.visibility = "visible";
    }
}

function numPages()
{
    return Math.ceil(jobData.length / records_per_page);
}

function toTop(){
    document.getElementById("JobsForYou").scrollIntoView({behavior: 'smooth'});
}

// preferredButton
// bookmarkedButton
function changeJobType(type){
    if(type=='preferred'){
        jobData = preferredJob
        document.getElementById("preferredButton").disabled = true
        document.getElementById("bookmarkedButton").disabled = false
        changePage(1);
    }else{
        jobData = bookMarkedJob
        document.getElementById("preferredButton").disabled = false
        document.getElementById("bookmarkedButton").disabled = true 
        changePage(1);
    }
    
}

function getDashboardData(){
    
    $.ajax({
        url:JOB_URL+'dashboard_data/',
        type:'GET',
        headers:{
            'Authorization': 'Bearer '+localStorage.getItem("access"),
        },
        success: function (result) {
            preferredJob = result['all_jobs']
            bookMarkedJob = result['bookmarked_jobs']
            changeJobType("preferred");
        },
        error: function (error) {
            console.log(error)
            if(error.status==401){
                LogoutUserAsFailedAuth()
            }
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

function saveJob(id){
    data = jobData.find(x => x.id == id)
    if(data){
        $.ajax({
            url:TEACHER_URL+"bookmark/?jobID="+id,
            type:'GET',
            headers:{
                'Authorization': 'Bearer '+localStorage.getItem("access"),
            },
            success: function (result) {
                data = bookMarkedJob.find(x => x.id == result.id)
                if(data){
                    
                }else{
                    bookMarkedJob.unshift(result)
                }
                let m1 = $(bookmarkConfirmation())
                m1.modal("show")
            },
            error: function (error) {
                if(error.status==401){
                    LogoutUserAsFailedAuth()
                }
            },
            complete:function(){
                
            }
        })
    }else{
        
    }
}