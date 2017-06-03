/**
 * Created by vivid on 2017/6/1.
 */

//移动 fromx, fromy,从那里移动  tox, toy移到那里去
function showMoveAnimation(fromx, fromy, tox, toy) {
    var numberCell=$('#number-cell-'+fromx+"-"+fromy);

//    用jquery移动
    numberCell.animate({
        top:getPosTop(tox,toy),
        left:getPosLeft(tox,toy)
    },200);
}


//修改界面的分数
function updateScore(score) {
    // $("#score").animate({
    //     fontSize:"0px"
    // },30,"swing",function () {
    //     $("#score").text(score);
    //     $("#score").animate({
    //         fontSize: "25px"
    //     }, 70, "swing");
    // });
    $("#score").fadeOut(30,function () {
        $("#score").text(score);
    }).fadeIn(100);



}