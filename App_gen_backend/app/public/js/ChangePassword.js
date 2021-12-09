$("#changepass-form").submit(async (event)=>{
    event.preventDefault();
    let confirmpassword = $("#confirmpassword").val();
    let password = $('#password').val();
   let url =  window.location.href;
   url = url.toString();
   url = url.split('/');
   let id =url[url.length-1];
    var response = await fetch("/auth/ChangePassword",{
        method : "POST",
        headers : {
            "content-type" : "application/JSON"
        },
        body : JSON.stringify({
            password,
            confirmpassword,
            id
        })
    }).then((res)=>res.json());
    console.log(response);
    if(response.code === 200){

        $("#error-msg").text("");
        $("#error-msg").text(response.message);
        setInterval(function(){ window.location.replace("http://localhost:9999/auth/login"); }, 5000);
    }else{
        $("#error-msg").text("");
        $("#error-msg").text(response.message);

    }
});