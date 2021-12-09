$("#login-form").submit(async (event)=>{
    event.preventDefault();
    let email = $("#email").val();
    let password = $('#password').val();
    var response = await fetch("/auth/login",{
        method : "POST",
        headers : {
            "content-type" : "application/JSON"
        },
        body : JSON.stringify({
            email,
            password
        })
    }).then((res)=>res.json());
   console.log(response);
    if(response.code === 200){
        window.location.replace("http://localhost:9999/home");
    }else{
        $("#error-msg").text("");
        $("#error-msg").text(response.message);

    }
});
