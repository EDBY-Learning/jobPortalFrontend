const heading = document.getElementById("heading")
const info = document.getElementById("info")
const jobPostArea = document.getElementById("jobPostArea")
var jobData = [];
var preferredJob = []
var bookMarkedJob = []
var recentJob = []

var current_page = 1;
var records_per_page = 12;
const urlParams = new URLSearchParams(window.location.search);

var path_common = "../.."

window.addEventListener('load',setup)
// window.addEventListener('load',searchDashboard)

function setup(){
    if(localStorage.getItem("access")){
        document.getElementById("unauth-panel").style.display = 'none'
        document.getElementById("auth-panel").style.display = 'block' 
    }
    
    let id = urlParams.get("ids");
    let location = urlParams.get("location")
    let position = urlParams.get("position")
    let subject = urlParams.get("subject")
    let search = urlParams.get("search")
    
    if(id){
        document.getElementById("searchDashboard").style.display = "none"
        document.getElementById("searchArea").style.display = "block"
        getJobByIds(id);
        // document.getElementById("searchJobButton").scrollIntoView({behavior: 'smooth'});
    }else if(location){
        document.getElementById("searchDashboard").style.display = "none"
        document.getElementById("searchArea").style.display = "block"
        document.getElementById("locationSearch").value = location;
        document.getElementById("positionSearch").value = position?position:"";
        document.getElementById("subjectSearch").value = subject?subject:"";
        // console.log("here")
        searchForJobs()
        
    }else if(search){
        document.getElementById("searchDashboard").style.display = "none"
        document.getElementById("searchArea").style.display = "block"
        if(search=="recent"){
            getRecentJob()
        }else if(search=="bookmark"){
            getBookmarkedPreferredData("bookmark")
        }else if(search == "prefer"){
            getBookmarkedPreferredData("prefer")
        }else{

        }
    }
    else{
        document.getElementById("searchDashboard").style.display = "block"
        document.getElementById("searchArea").style.display = "none"
        searchDashboard()
    }
}


function searchDashboard(){
    let headers = {}
    if(localStorage.getItem("access")){
        headers = {
            'Authorization': 'Bearer '+localStorage.getItem("access"),
        }
    }
    $.ajax({
        url:JOB_URL+'search_dashboard/',
        type:'GET',
        headers:headers,
        success: function (result) {
            setSearchDashboard(result)
        },
        error: function (error) {
            if(error.status==401){
                refreshTokenAsAuthFailed()
                return;
            }
        }
    })
}


function getBookmarkedPreferredData(type){
    if(!localStorage.getItem("access")){
        heading.innerHTML = "Login"
        info.innerHTML = "Please login to view preferred jobs!!"
        return;
    }
    $.ajax({
        url:JOB_URL+'dashboard_data/',
        type:'GET',
        headers:{
            'Authorization': 'Bearer '+localStorage.getItem("access"),
        },
        success: function (result) {
            preferredJob = result['all_jobs']
            bookMarkedJob = result['bookmarked_jobs']
            if(type=="prefer"){
                heading.innerHTML = "Here are  your preferred Jobs"
                info.innerHTML = ""
                jobData = preferredJob
            }else{
                heading.innerHTML = "Your bookmarked jobs"
                info.innerHTML = ""
                jobData = bookMarkedJob
            }
            changePage(1);
        },
        error: function (error) {
            console.log(error)
            if(error.status==401){
                heading.innerHTML = "Login"
                info.innerHTML = "Please login to view preferred jobs!!"
            }
        }
    })
    document.getElementById("searchJobButton").scrollIntoView({behavior: 'smooth'});
}

function setSearchDashboard(data){
    let recent_job_panel = document.getElementById("recentJobs")
    recentJob = data.recent_jobs
    recent_job_panel.innerHTML = ""
    data.recent_jobs.forEach(element => {
        recent_job_panel.innerHTML+=smallCard(element,'recent')
    });

    let prefered_job_panel = document.getElementById("preferedJobs")
    preferredJob = data.prefered_jobs
    prefered_job_panel.innerHTML = ""
    data.prefered_jobs.forEach(element => {
        prefered_job_panel.innerHTML+=smallCard(element,'prefer')
    });

    let saved_job_panel = document.getElementById("savedJobs")
    bookMarkedJob = data.bookmarked_jobs
    saved_job_panel.innerHTML = ""
    data.bookmarked_jobs.forEach(element => {
        saved_job_panel.innerHTML+=smallCard(element,'bookmark')
    })
}

function smallCard(data,type){
    let visibility = 'visible'
    if(type== 'bookmark'){
        visibility='hidden'
    }
    return `
        <div style="padding:5px; margin:10px;" class="card">
            <div class="card-body">
                <h5 class="card-title">${data.positions.slice(0, 15) + "..."}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${data.city.slice(0, 15) + "..."}</h6>
                <p>${data.entry_time.toString().slice(0, 10)}</p>
                <a type="button btn" class="btn btn-primary" href="javascript:openJobPostModal(${data.id},'${type}')" class="card-link">Detail</a>
                <a style="visibility:${visibility}" type="button btn" class="btn btn-link" href="javascript:saveJobPost(${data.id},'${type}')" class="card-link">Save</a>
            </div>
        </div>
    `
}


function getCorrectData(id,type){
    if(type == 'recent'){
        data = recentJob.find(x => x.id == id)
    }else if(type == 'prefer'){
        data = preferredJob.find(x => x.id == id)
    }else if(type == 'bookmark'){
        data = bookMarkedJob.find(x => x.id == id)
    }else{
        data = jobData.find(x => x.id == id)
    }
    return data
}

function openJobPostModal(id,type){
    data = getCorrectData(id,type)
    // console.log(data)
    if(data){
        let m1 = $(makeJobPostModal(data))
        m1.modal("show")
    }else{
        
    }
}

function saveJobPost(id,type){
    if(localStorage.getItem("access")){
        data = getCorrectData(id,type)
        url = TEACHER_URL+"bookmark/?jobID="+id
        if(data){
            $.ajax({
                url:url,
                type:"GET",
                headers:{
                    'Authorization': 'Bearer '+localStorage.getItem("access"),
                },
                success: function (result) {
                    swal({
                        title: 'Saved',
                        text: 'Successfully Saved',
                        type: 'success',
                        timer: 800
                    })  
                },
                error: function (error) {
                    if(error.status==401){
                        let m1 = $(makeLoginPopup(path_common))
                        m1.modal("show")
                    }
                },
                complete:function(){
                    
                }
            })
        }
    }else{
        let m1 = $(makeLoginPopup(path_common))
        m1.modal("show")
    }
    
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
    var page_span2 = document.getElementById("page2");
 
    // Validate page
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();

    jobPostArea.innerHTML = "";
    
    let searchType = urlParams.get("search")
    let showSave = ""
    if (searchType=="bookmark"){
        showSave = "none"
    }
    for (var i = (page-1) * records_per_page; i < (page * records_per_page) && i < jobData.length; i++) {
        const card = getJobResultContent(jobData[i],showSave)
        jobPostArea.innerHTML+=card
    }
    page_span.innerHTML = page + "/" + numPages();
    page_span2.innerHTML = page + "/" + numPages();

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
    let pagesCount = Math.ceil(jobData.length / records_per_page)
    let pageNumber = document.getElementById("pageNumber");
    let pageNumber2 = document.getElementById("pageNumber2");
    if(pagesCount <= 1){
        pageNumber.style.visibility = "hidden";
        pageNumber2.style.visibility = "hidden";
    }else{
        pageNumber.style.visibility = "visible";
        pageNumber2.style.visibility = "visible";
    }
    return pagesCount;
}

function toTop(){
    document.getElementById("searchJobButton").scrollIntoView({behavior: 'smooth'});
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
            // jobData.forEach((element,idx) => {
            //     const card = getJobResultContent(element,"block")
            //     jobPostArea.innerHTML+=card 
            // });
            changePage(1);
        },
        error: function (error) {
            console.log(error)
        }
    })
    document.getElementById("searchJobButton").scrollIntoView({behavior: 'smooth'});
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
                info.innerHTML = "Wrong IDs"
            }
            // jobData.forEach((element,idx) => {
            //     const card = getJobResultContent(element,"block")
            //     jobPostArea.innerHTML+=card 
            // });
            changePage(1);
        },
        error: function (error) {
            console.log(error)
        }
    })
    document.getElementById("searchJobButton").scrollIntoView({behavior: 'smooth'});
}

function searchForJobs(){
    loc = document.getElementById("locationSearch").value.trim()
    
    if(!loc){
        document.getElementById("error").innerHTML = "Location is required e.g Delhi or Bengal or UAE"
        return;
    }

    pos = document.getElementById("positionSearch").value.trim();
    sub = document.getElementById("subjectSearch").value.trim();
    // console.log(location)
    url = JOB_URL+'search/?location='+loc+"&position="+pos+"&subject="+sub
    // console.log(url)
    $.ajax({
        url:url,
        type:'GET',
        success: function (result) {
            heading.innerHTML = `Location: ${loc}, Position: ${pos}, Subject: ${sub}`
            info.innerHTML = "You can now bookmark and save job post!!"
            jobPostArea.innerHTML = ""
            jobData = result
            if(jobData.length ==0){
                heading.innerHTML = `No Result was found for Location ${loc}, Designation ${pos}, Subject ${sub}`
                info.innerHTML = `To increase the range search based on state or country`
            }
            // jobData.forEach((element,idx) => {
            //     const card = getJobResultContent(element,"block")
            //     jobPostArea.innerHTML+=card 
            // });
            changePage(1);
        },
        error: function (error) {
            console.log(error)
        },
        complete:function(){
            
        }
    })
    document.getElementById("searchJobButton").scrollIntoView({behavior: 'smooth'});
}

$("#searchJobButton").click(function(){
    searchForJobs()
})

function openSwal(id){
    data = jobData.find(x => x.id == id)
    if(data){
        let m1 = $(makeJobPostModal(data))
        m1.modal("show")
    }else{
        
    }
}

function saveJob(id,method){
    
    if(localStorage.getItem("access")){
        data = jobData.find(x => x.id == id)
        url = TEACHER_URL+"bookmark/?jobID="+id
        if(method=='DELETE'){
            url = TEACHER_URL+"bookmark/"+id+"/"
            updateAnalytics('remove_saved_job',"Saved Job Removed",id)
        }else{
            updateAnalytics('save_job',"Saved Job",id)
        }
        if(data){
            $.ajax({
                url:url,
                type:method,
                headers:{
                    'Authorization': 'Bearer '+localStorage.getItem("access"),
                },
                success: function (result) {
                    index = jobData.findIndex(item => item.id === result.id)
                    if(index!=-1){
                        if(method=='DELETE'){
                            jobData.splice(index, 1)
                            changePage(+document.getElementById('page').innerHTML.split("/")[0]);
                        }
                    }else{
                        bookMarkedJob.unshift(result)
                    }
                    
                    swal({
                        title: 'Action Success',
                        text: 'Successfully',
                        type: 'success',
                        timer: 800
                    })                    
                },
                error: function (error) {
                    if(error.status==401){
                        let m1 = $(makeLoginPopup(path_common))
                        m1.modal("show")
                    }
                },
                complete:function(){
                    
                }
            })
        }else{
            
        }
    }else{
        let m1 = $(makeLoginPopup(path_common))
        m1.modal("show")
    }
}

function makeResume(){
    window.location.href = "../../dashboard/pages/examples/login.html"
}