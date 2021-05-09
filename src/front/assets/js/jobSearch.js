const heading = document.getElementById("heading")
const info = document.getElementById("info")
const jobPostArea = document.getElementById("jobPostArea")
var jobData = null;

var current_page = 1;
var records_per_page = 12;

window.onload = function(){
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get("ids");
    let location = urlParams.get("location")
    let position = urlParams.get("position")
    let subject = urlParams.get("subject")
    
    if(id){
        getJobByIds(id);
        document.getElementById("searchJobButton").scrollIntoView({behavior: 'smooth'});
    }else if(location){
        document.getElementById("locationSearch").value = location;
        document.getElementById("positionSearch").value = position;
        document.getElementById("subjectSearch").value = subject;
        console.log("here")
        searchForJobs()
        
    }else{
        getRecentJob()
        document.getElementById("searchJobButton").scrollIntoView({behavior: 'smooth'});
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
 
    // Validate page
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();

    jobPostArea.innerHTML = "";

    for (var i = (page-1) * records_per_page; i < (page * records_per_page) && i < jobData.length; i++) {
        const card = getJobResultContent(jobData[i],"block")
        jobPostArea.innerHTML+=card
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
    console.log(url)
    $.ajax({
        url:url,
        type:'GET',
        success: function (result) {
            heading.innerHTML = "Here are jobs you searched for"
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
    data = jobData.find(x => x.id === id)
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

    }else{
        
    }
}