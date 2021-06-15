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
        // document.getElementById("searchJobButton").scrollIntoView({behavior: 'smooth'});
    }else if(location){
        document.getElementById("locationSearch").value = location;
        document.getElementById("positionSearch").value = position;
        document.getElementById("subjectSearch").value = subject;
        console.log("here")
        searchForJobs()
        
    }else{
        // getRecentJob()
        // document.getElementById("searchJobButton").scrollIntoView({behavior: 'smooth'});
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
    let pagesCount = Math.ceil(jobData.length / records_per_page)
    let pageNumber = document.getElementById("pageNumber");
    if(pagesCount <= 1){
        pageNumber.style.visibility = "hidden";
    }else{
        pageNumber.style.visibility = "visible";
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
    // document.getElementById("searchJobButton").scrollIntoView({behavior: 'smooth'});
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
    data = jobData.find(x => x.id == id)
    if(data){
        let m1 = $(makeJobPostModal(data))
        m1.modal("show")
    }else{
        
    }
}

function saveJob(id){
    if(localStorage.getItem("access")){
        data = jobData.find(x => x.id == id)
        if(data){
            $.ajax({
                url:TEACHER_URL+"bookmark/?jobID="+id,
                type:'GET',
                headers:{
                    'Authorization': 'Bearer '+localStorage.getItem("access"),
                },
                success: function (result) {
                    let m1 = $(bookmarkConfirmation())
                    m1.modal("show")
                    //setTimeout(function() {$('#bookmarkConfirmation').modal('hide');}, 1000);
                },
                error: function (error) {
                    if(error.status==401){
                        let m1 = $(makeLoginPopup())
                        m1.modal("show")
                    }
                },
                complete:function(){
                    
                }
            })
        }else{
            
        }
    }else{
        let m1 = $(makeLoginPopup())
        m1.modal("show")
    }
}

function makeLoginPopup(){
    return `
    <div class="modal fade" id="makeLoginPopup" tabindex="-1" role="dialog" aria-labelledby="makeLoginPopupLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Login to bookmark</h3>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <p>You need to create an account so we can bookmark your preferred jobs!!</p>
                </div>
                <div class="row">
                    <div class="col-6 d-flex">
                        <a class="btn btn-primary" type="button" href="../../dashboard/pages/examples/login.html">Login</a>
                    </div>
                    <div class="col-6 d-flex">
                        <a class="btn btn-primary" type="button" href="../../dashboard/pages/examples/register.html">Register</a>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button style="width: 40%; display: block;margin-left: auto;margin-right: auto;" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> 
            </div>
        </div>
        </div>
    </div>`
}

function makeResume(){
    window.location.href = "../../dashboard/pages/examples/login.html"
}