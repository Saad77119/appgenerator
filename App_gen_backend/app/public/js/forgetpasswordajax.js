$("#forgetpass-form").submit(async (event)=>{
    event.preventDefault();
    let email = $("#email").val();
    var response = await fetch("/auth/ForgetPassword",{
        method : "POST",
        headers : {
            "content-type" : "application/JSON"
        },
        body : JSON.stringify({
            email
        })
    }).then((res)=>res.json());
    console.log(response);
    if(response.code === 200){
        $("#error-msg").text("");
        $("#error-msg").text(response.message);
    }else{
        $("#error-msg").text("");
        $("#error-msg").text(response.message);

    }
});