const dashboardArea = document.getElementById("dashboardArea")
var jobData = null;
var preferredJob = [];
var bookMarkedJob = [];
var blogData = [];
var likesData = [];

var current_page = 1;
var records_per_page = 12;

window.addEventListener('load', getDashboardData)
window.addEventListener('load',getJobBlog)

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
        if('school' in jobData[i]){
            if(document.getElementById("preferredButton").disabled){
                card = getJobResultContent(jobData[i],"block")
            }else{
                card = getJobResultContent(jobData[i],"none")
            }
        }else{
            card = getBlogContent(jobData[i],'')
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
    document.getElementById("toTheTop").scrollIntoView({behavior: 'smooth'});
}

// preferredButton
// bookmarkedButton
function changeJobType(type,page){
    if(type=='preferred'){
        jobData = preferredJob
        document.getElementById("preferredButton").disabled = true
        document.getElementById("blogButton").disabled = false
        document.getElementById("bookmarkedButton").disabled = false
        changePage(page);
    }else if(type=="bookmarked"){
        jobData = bookMarkedJob
        document.getElementById("preferredButton").disabled = false
        document.getElementById("blogButton").disabled = false
        document.getElementById("bookmarkedButton").disabled = true 
        changePage(page);
    }else{
        jobData = blogData;
        document.getElementById("preferredButton").disabled = false
        document.getElementById("blogButton").disabled = true
        document.getElementById("bookmarkedButton").disabled = false
        changePage(page);
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
            // changeJobType("preferred",1);
        },
        error: function (error) {
            console.log(error)
            if(error.status==401){
                refreshTokenAsAuthFailed()
            }
        }
    })
}

function getJobBlog(){
    
    $.ajax({
        url:BLOG_URL+'all_blogs/',
        type:'GET',
        headers:{
            'Authorization': 'Bearer '+localStorage.getItem("access"),
        },
        success: function (result) {
            blogData = result['blogs']
            likesData = result['likes']
            changeJobType("blogs",1);
        },
        error: function (error) {
            console.log(error)
            if(error.status==401){
                refreshTokenAsAuthFailed()
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

function saveJob(id,method){
    data = jobData.find(x => x.id == id)
    url = TEACHER_URL+"bookmark/?jobID="+id
    if(method=='DELETE'){
        url = TEACHER_URL+"bookmark/"+id+"/"
    }
    if(data){
        $.ajax({
            url:url,
            type:method,
            headers:{
                'Authorization': 'Bearer '+localStorage.getItem("access"),
            },
            success: function (result) {
                //data = bookMarkedJob.find(x => x.id == result.id)
                index = bookMarkedJob.findIndex(item => item.id === result.id)
                if(index!=-1){
                    if(method=='DELETE'){
                        bookMarkedJob.splice(index, 1)
                        changeJobType("bookmarked",document.getElementById('page').innerHTML.split("/")[0])
                    }
                }else{
                    bookMarkedJob.unshift(result)
                }
                let m1 = $(bookmarkConfirmation())
                m1.modal("show")
            },
            error: function (error) {
                if(error.status==401){
                    refreshTokenAsAuthFailed()
                }
            },
            complete:function(){
                
            }
        })
    }else{
        
    }
}

function fetchLiked(id,total_like){
    var index = likesData.findIndex(item => item.blogId == id)
    if(index!=-1 && likesData[index]['like']=="True"){
        return `<a id="like_${id}" href="javascript:void(0)" class="card-link">${total_like} <i class="fas fa-thumbs-up"></i> Liked</a>`
    }else{
        return `<a id="like_${id}" href="javascript:likePost('${id}','1')" class="card-link">${total_like} <i class="far fa-thumbs-up"></i> Like</a>`
    } 
}

function likePost(blogId,like){
    $.ajax({
        url:BLOG_URL+'like_blog/',
        type:'POST',
        headers:{
            'Authorization': 'Bearer '+localStorage.getItem("access"),
        },
        data:{
            like:like,
            blogId:blogId
        },  
        success: function (result) {
            let temp  = document.getElementById('like_'+blogId)
            if(+like==1){
                temp.innerHTML = `${result.total_like} <i class="fas fa-thumbs-up"></i> Liked`
                temp.href = `javascript:void(0)`//javascript:likePost('${blogId}','0')
            }else{
                temp.innerHTML  =`${result.total_like} <i class="far fa-thumbs-up"></i> Like`
                temp.href = `javascript:likePost('${blogId}','1')`
            }
        },
        error: function (error) {
            console.log(error)
            if(error.status==401){
                refreshTokenAsAuthFailed()
            }
        }
    })
}
