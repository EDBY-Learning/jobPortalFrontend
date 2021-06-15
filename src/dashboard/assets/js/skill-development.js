window.addEventListener('load',getCourseList)

function getCourseList(){
    if(!localStorage.getItem("access")){
        document.getElementById("unauth-header").innerHTML = "Login to view Courses"
        return;
    }
    $.ajax({
        url:TEACHER_URL+'profile/1/',
        type:'GET',
        headers:{
            'Authorization': 'Bearer '+localStorage.getItem("access"),
        },
        success: function (result) {
            document.getElementById("unauth-panel").style.display = 'none'
            document.getElementById("panel").style.display = 'block'
            setData(result)
        },
        error: function (error) {
            if(error.status==401){
                refreshTokenAsAuthFailed()
                return;
            }
            document.getElementById("unauth-header").innerHTML = "Failed to log you in! "+error.responseText
        }
    })
}

function setData(data){
    
    let courseArea = document.getElementById("courseArea")
    courseArea.innerHTML = ''
    data.experience.forEach(element => {
        courseArea.innerHTML+=`
        <div class="col-12 col-lg-4">
            <div class="card shadow-soft bg-white border-light animate-up-3 text-gray py-4 mb-5 mb-lg-0">
                <div class="card-header text-center pb-0">
                    <div class="icon icon-shape icon-shape-primary rounded-circle mb-3">
                    <i class="fas fa-bullhorn"></i>
                    </div>
                    <h4 class="text-black">Certification</h4>
                    <p>
                    Title of course
                    </p>
                </div>
                <div class="card-body">
                    <ul class="list-group">
                        <li class=" d-flex px-0 pt-0 pb-2">
                            <div class="icon icon-sm icon-success mr-4">
                                <i class="far fa-check-circle"></i>
                            </div>
                            <div>Details of course</div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
            `
    }); 
     
}
