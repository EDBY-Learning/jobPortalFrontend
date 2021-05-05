const heading = document.getElementById("heading")
const info = document.getElementById("info")
const jobPostArea = document.getElementById("jobPostArea")
var jobData = null;

window.onload = function(){
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get("ids");
    let location = urlParams.get("location")
    let position = urlParams.get("position")
    let subject = urlParams.get("subject")
    
    if(id){
        getJobByIds(id);
    }else if(location){
        document.getElementById("location").value = location;
        document.getElementById("position").value = position;
        document.getElementById("subject").value = subject;
        searchJobs()
    }else{
        getRecentJob()
    }
}

function getRecentJob(){
    $.ajax({
        url:JOB_URL+'latest_job/',
        type:'GET',
        success: function (result) {
            heading.innerHTML = "Some recent job posts"
            info.innerHTML = "You can now bookmark and save job post!!"
            jobPostArea.innerHTML = ""
            jobData = result.results
            jobData.forEach((element,idx) => {
                const card = getJobResultContent(element,"block")
                jobPostArea.innerHTML+=card 
            });
        },
        error: function (error) {
            console.log(error)
        }
    })
}

function getJobByIds(id){
    $.ajax({
        url:JOB_URL+'job_by_ids/',
        type:'GET',
        data:{ids:id},
        success: function (result) {
            heading.innerHTML = "Here are jobs you searched for"
            info.innerHTML = "You can now bookmark and save job post!!"
            jobPostArea.innerHTML = ""
            jobData = result
            if(jobData.length ==0){
                heading.innerHTML = "Search for Jobs"
            }
            jobData.forEach((element,idx) => {
                const card = getJobResultContent(element,"block")
                jobPostArea.innerHTML+=card 
            });
        },
        error: function (error) {
            console.log(error)
        }
    })
}

function searchJobs(){

}

function openSwal(id){
    data = jobData.find(x => x.id === id)
    if(data){

    }else{
        
    }
}

function saveJob(id){
    data = jobData.find(x => x.id === id)
    if(data){

    }else{
        
    }
}