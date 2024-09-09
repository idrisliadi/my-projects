
const form = document.getElementById("forms");
const create = document.getElementById("create")
create.addEventListener("click", function(){
    $.ajax({
        method : "GET",
        url: "/createblog",
        success : function(data)
        {
            console.log($("#forms").html(data))
        }
})
})

const usermag= document.getElementById("usermag")
usermag.addEventListener("click", (e)=>{
    e.preventDefault(),
    form.innerHTML = `<div><form action="/deluser" method="POST">
             <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header bg-danger text-white text-center">
                        <h4>Delete User</h4>
                    </div>
                    <div class="card-body">
                        <form action="/deluser" method="POST">
                            <div class="form-group">
                                <label for="userEmail">User Email</label>
                                <input type="email" class="form-control" id="userEmail" name="email" placeholder="Enter user's email" required>
                            </div>
                            <button type="submit" class="btn btn-danger btn-block">Delete User</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
           </form></div>`

})


const adminblog = document.getElementById("view")
view.addEventListener("click", function(){
    $.ajax({
        method : "GET",
        url: "/adminblog",
        success : function(data)
        {
            console.log($("#forms").html(data))
        }
})
})

const galery = document.getElementById("galery")
galery.addEventListener("click", function(){
    $.ajax({
        method : "GET",
        url: "/admingalery",
        success : function(data)
        {
            console.log($("#forms").html(data))
        }
})
})  

galery.addEventListener("click", function(){
    $.ajax({
        method : "GET",
        url: "/admingalery",
        success : function(data){
            console.log($("#forms").html(data))
        }
    })
})


const viewservices = document.getElementById("viewservices")
viewservices.addEventListener("click", function(){
    $.ajax({
        method : "GET",
        url: "/adminservices",
        success : function(data){
            console.log($("#forms").html(data))
        }
    })
})

const about = document.getElementById("about")
about.addEventListener("click", function(){
    $.ajax({
        method : "GET",
        url: "/adminabout",
        success : function(data){
            console.log($("#forms").html(data))
        }
    })
})


const project = document.getElementById("project")
project.addEventListener("click", function(){
    $.ajax({
        method : "GET",
        url: "/adminproject",
        success : function(data){
            console.log($("#forms").html(data))
        }
    })
})



const reguser = document.getElementById("reguser")
reguser.addEventListener("click", function(){
    $.ajax({
        method : "GET",
        url: "/alluser",
        success : function(data){
            console.log($("#forms").html(data))
        }
    })
})



const update = document.getElementById("update")
update.addEventListener("click", function(){
    $.ajax({
        method : "GET",
        url: "/newupdate",
        success : function(data){
            console.log($("#forms").html(data))
        }
    })
})

const deletes = document.getElementById("deletes")
deletes.addEventListener("click", function(){
    $.ajax({
        method : "GET",
        url: "/deletes",
        success : function(data){
            console.log($("#forms").html(data))
        }
    })
})




const feedback = document.getElementById("feedback")
feedback.addEventListener("click", function(){
    $.ajax({
        method : "GET",
        url: "/adminfeedback",
        success : function(data){
            console.log($("#forms").html(data))
        }
    })
})


// const updateprice = document.getElementById("updateprice")
// updateprice.addEventListener("click", function(){
//     $.ajax({
//         method : "GET",
//         url: "/update",
//         success : function(data){
//             console.log($("#forms").html(data))
//         }
//     })
// })

document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    const query = document.getElementById('searchInput').value;

    // Perform the AJAX request
    fetch(`/search?query=${encodeURIComponent(query)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            // Update the categoriesList div with the response
            document.getElementById('forms').innerHTML = data;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            document.getElementById('forms').innerHTML = '<p>An error occurred while searching for categories.</p>';
        });
});


