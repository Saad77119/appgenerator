$("#registration-form").submit(async (event)=>{
    event.preventDefault()
    let name = $("#name").val();
    let email = $("#email").val();
    let gender = $('input[name="gender"]:checked').val();
    let confirmpassword = $("#confirmpassword").val();
    let password = $('#password').val();
    var response = await fetch("/auth/register",{
        method : "POST",
        headers : {
            "content-type" : "application/JSON"
        },
        body : JSON.stringify({
            name,
            email,
            gender,
            password,
            confirmpassword
        })
    }).then((res)=>res.json());
console.log(response);
if(response.code === 200){
    window.location.replace("http://localhost:9999/auth/confirmPassword");
}else{
$("#error-text").text("");
$("#error-text").text(response.message);

}
});