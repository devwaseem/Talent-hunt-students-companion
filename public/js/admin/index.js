$(()=>{
    $("#scoreUpdateForm").submit(()=>{
        return false
    })  

    $("#passcode-container").attr("hidden",true)

    $('#type').change(()=>{
        if ($("#type").val() !== "0"){
            $("#passcode-container").attr("hidden",false)
        }else{

            $("#passcode-container").attr("hidden",true)
        }    
    })

    

    $("#updateSubmitButton").click(()=>{
        let r = $("#r").val()
        if(r.length !== 12){
            alert("invalid rrn");
            return
        }
        let type = $("#type").val()
        let p = $("#passcode").val()
        if(p === "" && type !== "0"){
            alert("Please enter the Passcode");
            return
        }
        $("#buttonText").text("Updating...");
        $("#updateButtonSpinner").attr("hidden",false);
        $("#updateSubmitButton").attr("disabled",true);
        $.ajax({
            url:"/admin/u/" + type,
            method:"post",
            data:{r,p},
            headers:{
                "token_iv":localStorage.getItem("token_iv"),
                "token_data":localStorage.getItem("token_data")
            },
        }).then((response)=>{
            console.log(response)
            $("#buttonText").text("Update");
            $("#updateButtonSpinner").attr("hidden",true);
            $("#updateSubmitButton").attr("disabled",false);
            if(response.success === false){
                alert(response.message);
            }else{
                alert("Update Successful");
            }
        }).catch((e)=>{
            alert("Error in Updating, Please try again later!");
            $("#buttonText").text("Update");
            $("#updateButtonSpinner").attr("hidden",true);
            $("#updateSubmitButton").attr("disabled",false);
        })
        // $.post("/admin/u/0",{r},(response)=>{
        //     $("#buttonText").text("Update");
        //     $("#updateButtonSpinner").attr("hidden",true);
        //     $("#updateSubmitButton").attr("disabled",false);
        //     if(response.success === false){
        //         alert(response.message);
        //     }else{
        //         alert("Update Successful");
        //     }
        // }).catch(()=>{
        //     alert("Error in Updating, Please try again later!");
        //     $("#buttonText").text("Update");
        //     $("#updateButtonSpinner").attr("hidden",true);
        //     $("#updateSubmitButton").attr("disabled",false);
        // })
    })
    })