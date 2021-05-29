var BASE_URL = "http://127.0.0.1:8000/";
var JOB_URL = "http://127.0.0.1:8000/job/v2/"
var TEACHER_URL = "http://127.0.0.1:8000/teacher/"
var CRM_URL = "http://127.0.0.1:8000/crm/"
var BLOG_URL= "http://127.0.0.1:8000/edby/blogs/"

var LANG_CODE = {
    "1":`
    <span class="fa fa-star"></span>
    <span class="fa fa-star"></span>
    <span class="fa fa-star"></span>
    <span class="fa fa-star"></span>
    <span class="fa fa-star"></span>
    `,
    "2":`
    <span class="fa fa-star checked"></span>
    <span class="fa fa-star"></span>
    <span class="fa fa-star"></span>
    <span class="fa fa-star"></span>
    <span class="fa fa-star"></span>
    `,
    "3":`
    <span class="fa fa-star checked"></span>
    <span class="fa fa-star checked"></span>
    <span class="fa fa-star checked"></span>
    <span class="fa fa-star"></span>
    <span class="fa fa-star"></span>`,
    "4":`
    <span class="fa fa-star checked"></span>
<span class="fa fa-star checked"></span>
<span class="fa fa-star checked"></span>
<span class="fa fa-star checked"></span>
<span class="fa fa-star checked"></span>`
}

var APPLICATION_STATUS = {
    "-1":"Apply on given Contact",
    "1":"Applied",
    "2":"Sent Resume To School",
    "3":"Selected for Interview",
    "4":"Application Declined",
    "5":"Closed, No more application"
}

$("#logoutUser").click(function(){
    console.log("here")
    if(localStorage.getItem("access")){
        logoutAsFailed()
    }else{
        localStorage.clear()
        window.location.href = "../examples/login.html"
    }
})

function logoutAsFailed(){
    $.ajax({
        url:BASE_URL+'auth/logout/',
        type:'POST',
        data:{
            'refresh':localStorage.getItem("refresh")
        },
        headers:{
            'Authorization': 'Bearer '+localStorage.getItem("access"),
        },
        success: function (result) {
            localStorage.clear()
            window.location.href = "../examples/login.html"
        },
        error: function (error) {
     
        },
        complete:function(){
            localStorage.clear()
            window.location.href = "../examples/login.html"
        }
    })
}

function refreshTokenAsAuthFailed(){
    if(localStorage.getItem("refresh")){
        $.ajax({
            url:BASE_URL+'auth/login/refresh/',
            type:'POST',
            data:{
                'refresh':localStorage.getItem("refresh")
            },
            headers:{
                'Authorization': 'Bearer '+localStorage.getItem("refresh"),
            },
            success: function (result) {
                localStorage.setItem("access",result['access'])
                window.location = window.location
                // localStorage.setItem("refresh",result['refresh'])
            },
            error: function (error) {
                logoutAsFailed()
            },
            complete:function(){
                
            }
        })
    }else{
        logoutAsFailed()
    }
}

function buttonLockUnlock(id,val){
    document.getElementById(id).disabled = val;
}

function getJobResultContent(result,saveButton){
    deleteButton = 'none'
    if(saveButton=='none'){
        deleteButton = 'block'
    }
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
                    <li class=" d-flex pl-0 pb-1">
                        
                        <div><strong>Location : </strong>${result.city}</div>    
                    </li>
                    <li class="d-flex pl-0 pb-1">
                        
                        <div><strong> Designation : </strong>${result.positions}</div>    
                    </li>
                    <li class="d-flex pl-0 pb-1">
                        
                        <div><strong> Subjects: </strong>${result.subjects}</div> 
                    </li>
                </ul>
                <div class="row">
                    <div class="col">
                        <button onclick="openSwal(${result.id})" class="btn btn-primary">Apply</button>
                    </div>
                    <div class="col">
                        <button style="display:${saveButton}" onclick="saveJob(${result.id},'GET')" class="btn btn-secondary">Save</button>
                    </div>
                    <div class="col">
                        <button style="display:${deleteButton}" onclick="saveJob(${result.id},'DELETE')" class="btn btn-danger">Delete</button>
                    </div>
                    <div class="col">
                    <a class="what-button" type="button" class="btn custom-btn custom-btn-bg custom-btn-link" href=
                    "whatsapp://send?text=A job opening for teaching in ${result.city} for post of ${result.positions},
                    To view more jobs for teachers visit our site https://jobportal.edbylearning.com?ids=${result.id} and 
                    Join our WhatsApp community for live job updates  https://chat.whatsapp.com/IGTYltls5YL9XrIXgEGP9n"
                            data-action="share/whatsapp/share"
                            target="_blank"><i class="fab fa-whatsapp"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
}

function makeJobPostModal(result){
    return `
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
            <div class="modal-body">
            <div class="col-12 d-flex">
            <div class="card profile-card-5 flex-fill">
                <div class="card-img-block">
                    <img class="card-img-top" src="${result.image}" alt="Card image cap" onerror="this.style.opacity='0'">
                    <img class="card-img-top" src="${result.image_url}" alt="Card image cap" onerror="this.style.opacity='0'">
                </div>
                <div class="card-body pt-0">
                    <h5 class="card-title" style="color: #ff8400;"><strong>School: </strong>${result.school}</h5>
                    <p class="card-text"><strong>City: </strong>${result.city}</p>
                    <p class="card-text"><strong>Hiring for Positions: </strong> ${result.positions}</p>
                    <p class="card-text"><strong>Hiring for Subjects: </strong> ${result.subjects}</p>
                    <p class="card-text"><strong>Mobile Number: </strong> ${result.contact}</p>
                    <p class="card-text"><strong>Email: </strong> ${result.email}</p>
                    <p class="card-text"><strong>Message: </strong> ${result.message}</p>
                </div>
                    
            </div>
        </div>
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> 
            </div>
        </div>
        </div>
    </div>`
}

function bookmarkConfirmation(){
    return `
    <div class="modal fade" id="bookmarkConfirmation" tabindex="-1" role="dialog" aria-labelledby="bookmarkConfirmationLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Success!!</h3>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                Go to dashboard to view your bookmarks 
            </div>
            <div class="modal-footer">
                <button style="width: 40%; display: block;margin-left: auto;margin-right: auto;" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> 
            </div>
        </div>
        </div>
    </div>`
}


$("#changePasswordWithToken").click(function(){
    let new_password  = document.getElementById("new_password").value
    let confirm_password = document.getElementById("confirm_password").value
    let mobile  = document.getElementById("mobile").value
    let token = document.getElementById("token").value
    if(new_password=="" || confirm_password=="" || mobile =="" || token==""){
        document.getElementById("error-text").innerHTML = "Provide All Info!!"
        return;
    }else{
        document.getElementById("error-text").innerHTML = ''
    }

    buttonLockUnlock('changePasswordWithToken',true)
    $.ajax({
        url:BASE_URL+'auth/reset_password_with_token/',
        type:'POST',
        data:{
            'username':mobile,
            'new_password': new_password,
            'token' : token,
            'confirm_password' :confirm_password
        },
        success: function (result) {
            document.getElementById("new_password").value = ''
            document.getElementById("token").value = ''
            document.getElementById("confirm_password").value = ''
            document.getElementById("success-message").innerHTML = "Password Changed Succesfully"
        },
        error: function (error) {
            document.getElementById("error-text").innerHTML =  error.responseText
        },
        complete: function(){
            buttonLockUnlock('changePasswordWithToken',false)
        }
    })
})

function getBlogContent(data,show_comment){
    let target = "_blank"
    if(show_comment == 'openInSamePage'){
        target = ""
    }
    return `
    <div style="padding:10px;width: 90%; display: block;margin-left: auto;margin-right: auto;" class="col-12 col-md-8 card gedf-card shadow-soft border-light">
        <div style="background-color:lightgrey;" class="card-header">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="mr-2">
                        <img class="rounded-circle" width="45" src="../../assets/img/theme/profile.jpg" alt="">
                    </div>
                    <div class="ml-2">
                        <div class="h5 m-0">@edby</div>
                        <div class="h7 text-muted">${data.user.first_name}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-body">
            <div class="text-muted h7 mb-2"> <i class="fas fa-clock"></i> ${timeDifference(data.entry_time.toString())}</div>
            <div style="margin:10px; !important" class="row">
                ${returnPostTag(data.tags)}
            </div>
            <a class="card-link" href="javascript:void(0)">
                <h3 class="card-title"> ${data.title}</h3>
            </a>
            <p style="font-size:16px;" class="card-text">
                ${data.body}
            </p>
            <p class="card-text">
               <a href="#" onClick="window.open('//${getReferncelink(data.link)}', '_blank')" > ${getReferncelink(data.link)} </a>
            </p>
            
        </div>
        <div style="border-top: 2px solid;" class="card-footer">
            ${fetchLiked(data.id,data.total_like)}
            <a target="${target}" style="display:${show_comment};" href="../examples/blog-detail.html?blog_id=${data.id}" class="card-link"><i class="fas fa-comment"></i>Discussion</a>
            <a target="_blank" href="whatsapp://send?text=${data.title}  Read full blog https://jobportal.edbylearning.com/dashboard/pages/examples/blog-detail.html?blog_id=${data.id}" class="card-link"><i class="fas fa-share"></i> Share</a>
        </div>
    </div>
    `
}

function getReferncelink(link){
    if(link){
        link = link.trim()
    }
    if(link !="None" && link!='' && link){
        return `${link}`
    }
    return ''
}


function returnPostTag(data){
    let temp = ''
    data.split(',').forEach(element => {
        temp+=`<span style="margin-right:5px;" class="badge badge-info">${element}</span>`
    });
    return temp;
}

function timeDifference(previous_datetime) {

    let current = new Date()
    let previous = new Date(previous_datetime)

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return 'approximately ' + Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return 'approximately ' + Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return 'approximately ' + Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}