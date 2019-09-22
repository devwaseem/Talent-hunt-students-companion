$(()=>{
    var page = parseInt($("#page").html())
    var maxPage = parseInt($("#maxpage").html())
    if(page-1 <= 0){
        $("#button-previous").hide()
    }
    if(page == maxPage){
        $("#button-next").hide()
    }
    $("#button-previous").click(()=>{
        window.location = "/leaderboard/"+ (page-1)
    })
    $("#button-next").click(()=>{
        window.location = "/leaderboard/"+ (page+1)
    })
})