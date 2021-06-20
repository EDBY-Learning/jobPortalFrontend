window.addEventListener('load',getCourseList)

function getCourseList(){
    if(!localStorage.getItem("access")){
        document.getElementById("unauth-header").innerHTML = "Login to view Courses"
        return;
    }
    $.ajax({
        url:SKILL_URL+'course_list/',
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
    data.course.forEach(element => {
        courseArea.innerHTML+=`
        <div class="col-12 col-lg-4">
            <div class="card shadow-soft bg-white border-light animate-up-3 text-gray py-4 mb-5 mb-lg-0">
                <div class="card-header text-center pb-0">
                    <div class="icon icon-shape icon-shape-primary rounded-circle mb-3">
                        <img src="${element.partner_logo}" alt="Partner logo" onerror="this.style.opacity='0'"/>
                    </div>
                    <h4 class="text-black">${element.title}</h4>
                    <p>
                        By ${element.partner_name}
                    </p>
                    <p style="font-weight:bolder;">
                        Coming Soon...
                    </p>
                </div>
                <div class="card-body">
                    <ul class="list-group">
                        <li class=" d-flex px-0 pt-0 pb-2">
                            <div class="icon icon-sm icon-success mr-4">
                                <i class="far fa-check-circle"></i>
                            </div>
                            <div>${element.description}</div>
                        </li>
                        <li class=" d-flex px-0 pt-0 pb-2">
                            <div class="icon icon-sm icon-success mr-4">
                                <i class="far fa-check-circle"></i>
                            </div>
                            <div><strong>About ${element.partner_name}</strong>: ${element.partner_description}</div>
                        </li>
                    </ul>
                </div>
                <div class="card-footer">
                    <strong><p style="font-weight:bolder;">Get ${element.discount} on preregistration for this course</p></strong>
                    <button type="button" onclick="openCourseModal('${element.partner_group}')" class="btn btn-primary">Pre Register(discount:<strike>${element.price}</strike> ${element.offer_price})</button>
                </div>
            </div>
        </div>
            `
    }); 
     
}


function openCourseModal(group){
    let m1 = $(courseModal(group))
    m1.modal("show")
}

function courseModal(group){
    return `
    <div class="modal fade" id="courseModal" tabindex="-1" role="dialog" aria-labelledby="courseModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Register Now for discount!!</h3>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                Join group now to get discount for this course
            </div>
            <div class="modal-footer">
                <a href="${group}" target="_blank"> <button style="width: 100%; display: block;margin-left: auto;margin-right: auto;" type="button" class="btn btn-primary">Join Whatsapp</button> </a>
            </div>
        </div>
        </div>
    </div>`
}
