$(()=>{

    $("#loginForm").submit(()=>{
        return false
    })

    $("#loginSubmitButton").click(()=>{
        var email = $("#adminEmail").val()
        var password = $("#adminPassword").val()

        var emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(email === "") {
            alert("Please enter your phone number");
            return
        }else if(!emailPattern.test(email)){
            alert("Email id invalid");
            return
        }

        if(password === ""){
            alert("Please enter your password");
            return
        }

        $("#buttonText").text("Logging you in...");
        $("#loginButtonSpinner").attr("hidden",false);
        $("#loginSubmitButton").attr("disabled",true);
        $.post("/admin/login",{
            email,password
        },(response)=>{
            console.log(response)
            if(response.success === false){
                alert(response.message);
                $("#buttonText").text("Login");
                $("#loginButtonSpinner").attr("hidden",true);
                $("#loginSubmitButton").attr("disabled",false);
                return
            }
            localStorage.setItem("token_data",response.token.encryptedData)
            localStorage.setItem("token_iv",response.token.iv)
            window.location = "/admin"
        }).catch(()=>{
            alert("Error in Login, Please try again later!");
            $("#buttonText").text("Login");
            $("#loginButtonSpinner").attr("hidden",true);
            $("#loginSubmitButton").attr("disabled",false);
        })


    })

})