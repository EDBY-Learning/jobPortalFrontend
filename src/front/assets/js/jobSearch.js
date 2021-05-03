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
                const card = getResultContent(element)
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
                const card = getResultContent(element)
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


function getResultContent(result){
    // let temp = JSON.stringify(result);
    // console.log(temp)
    return `
    <div class="col-12 col-md-6 col-lg-4 mb-5">
        <div class="card shadow-soft border-light">
            <div class="card-body">
                <h3 class="card-title mt-3">${result.school}</h3>
                <div class="text-muted font-italic"><small style="color: darkgreen;">${result.entry_time.toString().slice(0, 10)}</small></div>
                <p class="card-text">
                    ${result.message}
                </p>
                <ul class="list-group d-flex justify-content-center mb-4">
                    <li class="list-group-item d-flex pl-0 pb-1">
                        
                        <div>${result.city}</div>    
                    </li>
                    <li class="list-group-item d-flex pl-0 pb-1">
                        
                        <div>${result.positions}</div>    
                    </li>
                    <li class="list-group-item d-flex pl-0 pb-1">
                        
                        <div>${result.subjects}</div> 
                    </li>
                </ul>
                <div class="row">
                    <div class="col">
                        <button onclick="openSwal(${result.id})" class="btn btn-primary">Apply</button>
                    </div>
                    <div class="col">
                        <button onclick="saveJob(${result.id})" class="btn btn-secondary">Save</button>
                    </div>
                    <div class="col">
                    <a class="what-button" type="button" class="btn custom-btn custom-btn-bg custom-btn-link" href=
                    "whatsapp://send?text=A job opening for teaching in ${result.city} for post of ${result.positions},
                    To view more jobs for teachers visit our site https://jobportal.edbylearning.com?ids=${result.id} and Join our WhatsApp community for live job updates  https://chat.whatsapp.com/EZzx9EFTqA4Ft6uAyWq4ef"
                            data-action="share/whatsapp/share"
                            target="_blank"><i class="ni ni-world"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
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