/**
 * Created by vivid on 2017/6/1.
 */
//游戏数据 4*4格子里的数据
    //    0,0 0,1 0,2 0,3 i,j
    //    1,0 1,1 1,2 1,3
    //    2,0 2,1 2,2 2,3
    //    3,0 3,1 3,2 3,3
    //    i,j
var board=new Array();
//游戏分数
var score=0;

//记录该格的数据 是否发生了叠加
var hasConflictn=new Array();


var startx=0; //手指滑动起始点坐标
var starty=0;
var endx=0; //手指滑动移出点坐标
var endy=0;


$(document).ready(function () {
    //调用一些尺寸
    prepareForMobile();

    //启动游戏
    newgame();
});

/**
 * 初始化尺寸
 */
function prepareForMobile() {
    //★★★★如果当前屏幕分辨率很大 就不考虑自适应
    if(documentWigth>500){
        gridContainerWidth=500;
        cellSpace=20;
        cellSideLength=100;
    }

    $('#grid-containner').css('width',gridContainerWidth-2*cellSpace)
        .css("height",gridContainerWidth-2*cellSpace)
        .css('padding',cellSpace)
        .css('border-radius',0.02*gridContainerWidth);

    $(".grid-cell").css('width',cellSideLength)
        .css('height',cellSideLength)
        .css('border-radius',0.02*cellSideLength);

}


function newgame() {
//给 16个格子定位 初始化棋盘格
    init();
//    在随机的两个格子生成数字
    generateoneNumber();
    generateoneNumber();
}

//给 16个格子定位 初始化棋盘格
function init() {
    //其实是背景格子（之后的数字格子会覆盖在它上面） 将其定位到指定位置
    for (var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            var gridCell=$("#grid-cell-"+i+"-"+j);
        //   根据坐标 设置其的top 和left
            gridCell.css('top',getPosTop(i,j));
            gridCell.css('left',getPosLeft(i,j));
        }
    }

//    对数据初始话 4*4的二维数组
    for(var i=0;i<4;i++){
        board[i]=new Array();
        hasConflictn[i]=new Array;
        for(var j=0;j<4;j++){
            board[i][j]=0;
            //初始化
            hasConflictn[i][j]=false;
        }


    }

    //刷新界面 就是将二维数组的值显示到界面上
    updateBoardView();

//    初始化分数
    score=0;
//修改界面的分数
    updateScore(score);
}


//刷新数据 就是将二维数组的值显示到界面上 就是创建个数字格子 覆盖上去
function updateBoardView() {

    $(".number-cell").remove(); //删除所有的数字格子

    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            $("#grid-containner").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell=$('#number-cell-'+i+'-'+j);
            //如果是0 则隐藏宽高为0 并定位在 背景格子的中间
            if(board[i][j]==0){
                //隐藏
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                //定位到背景格子中间
                theNumberCell.css('top',getPosTop(i,j)+cellSideLength/2);
                theNumberCell.css('left',getPosLeft(i,j)+cellSideLength/2);
            }else {

                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);

                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));

            //    设置背景色
                theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
                //设置前景色
                theNumberCell.css('color',getNumberColor(board[i][j]));
                //显示值
                theNumberCell.text(board[i][j]);

                //由于有个文字溢出的bug 所以要修改其字体大小
                if(board[i][j]>999){
                    theNumberCell.css('fontSize',0.4*cellSideLength);
                }else if(board[i][j]>99){
                    theNumberCell.css('fontSize',0.5*cellSideLength);
                }else {
                    theNumberCell.css('fontSize',0.6*cellSideLength);
                }
            }
            //恢复默认状态
            hasConflictn[i][j]=false;
        }
        $('.number-cell').css('line-height',cellSideLength+'px');
            // .css('font-size',0.6*cellSideLength+'px');
    }
}

//创建一个新的数字 随机位置 随机值 有动画
function generateoneNumber() {
    //判断是否还有空间
    if (nospance(board)){
        return false;
    }
//这个被抛弃了 效率太差
    // //随机一个位置 x y
    // var randx=Math.floor(Math.random()*4);
    // var randy=Math.floor(Math.random()*4);
    // var temp=0;
    // while (temp<500){
    //     //判断位置是否可用
    //     if(board[randx][randy]==0){
    //         break
    //     }
    //     //位置被占用则继续生成随机位置
    //     randx=Math.floor(Math.random()*4);
    //     randy=Math.floor(Math.random()*4);
    //     temp++
    // }
    // //随机5百次没成功 则手动 基本没希望执行这个 16个空而已嘛
    // if (temp>=500){
    //     alert("500次");
    //     for(var i=0;i<4;i++){
    //         for(var j=0;j<4;j++){
    //             if (board[i][j]==0){
    //                 randx=i;
    //                 randy=j;
    //             }
    //         }
    //     }
    // }

    //随机一个位置 x y
    var randx=Math.floor(Math.random()*4);
    var randy=Math.floor(Math.random()*4);
    //如果这个随机位置不可用
    if (board[randx][randy]!=0){
        var weizhi=new Array();
        var count=0;
        for (var i=0;i<4;i++){
            for (var j=0;j<4;j++){
                if (board[i][j]==0){
                    //☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆
                    //这边是真的给力
                    weizhi[count]=i*4+j;
                    count++;
                }
            }
        }
        //计算随机数☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆☆
        var temp=Math.floor(Math.random()*count);
        randx=Math.floor(weizhi[temp]/4);
        randy=Math.floor(weizhi[temp]%4);
    }


    //随机一个数字 开始生成的 只有 2 和4 两个数字
    var randNumber=Math.random()<0.5?2:4;

    //在随机位置上显示随机数字
    //将值保存到数组中
    board[randx][randy]=randNumber;

    //通知让前端显示  有动画
    showNumberWidthAnimation(randx,randy,randNumber);

    return true;
}

//键盘监听 上下左右方向键
$(document).keydown(function (event) {
   // ★★★★★★★★★当出现滚动条是 按下 屏幕也会滚动 所以要屏蔽默认键盘事件★
   //event.preventDefault(); //这个方法 如果放在这里会 屏蔽了所有默认按键

   switch (event.keyCode)
   {
       case 37: //左
           event.preventDefault();//这个方法 如果放在这里会 屏蔽了当前按键默认事件
           //向左移动
           if (moveLeft()){
                //★★为了让移动动画播放完整 这些 就晚点执行
                //★★左移了 新增一个数字
                setTimeout(generateoneNumber(),230);
                //判断游戏是否已经结束
                setTimeout(isgameover(),300) ;
           }
           break;
       case 38://上
           event.preventDefault();
           if (moveUp()){
               setTimeout(generateoneNumber(),230);
               setTimeout(isgameover(),300) ;
           }
           break;
       case 39://右
           event.preventDefault();
           if (moveRight()){
               setTimeout(generateoneNumber(),230);
               setTimeout(isgameover(),300) ;
           }
           break;
       case 40: //下
           event.preventDefault();
           if (moveDown()){
               setTimeout(generateoneNumber(),230);
               setTimeout(isgameover(),300) ;
           }
           break;
       default:
           break;
   }

});


/**
 * 触控监听 touchstart touchend 事件 和键盘监听类似
 */
document.addEventListener('touchstart',function (event) {
    startx=event.touches[0].pageX;
    starty=event.touches[0].pageY;
});

//这段是因为安卓4.0的一个bug 19827号bug 可能会导致触摸效果不被触发 只要这么写就能躲过
document.addEventListener('touchmove',function (event) {
    event.preventDefault();
});
document.addEventListener('touchend',function (event) {
    endx=event.changedTouches[0].pageX;
    endy=event.changedTouches[0].pageY;

    //计算移动方向
    var deltax=endx-startx;
    var deltay=endy-starty;
//  ★★★★★  得排除用户的点击操作 点击其实也是滑动事件 同样有 初始位置和离开位置
//   ★★★★★ 所以 当初始位置和离开位置 比较小时 则认为它不是移动 这里认为小于0.25倍屏幕宽度
    if (Math.abs(deltax)<0.25*documentWigth&&Math.abs(deltay)<0.25*documentWigth){
        return
    }

//    竖直方向还是水平方向
    if (Math.abs(deltax)>=Math.abs(deltay)){
    //    x方向
        if (deltax>0){
        //right x轴右为正
            if (moveRight()){
                setTimeout(generateoneNumber(),230);
                setTimeout(isgameover(),300) ;
            }
        }else {
        //    left
            if (moveLeft()){
                //为了让移动动画播放完整 这些 就晚点执行
                //左移了 新增一个数字
                setTimeout(generateoneNumber(),230);
                //判断游戏是否已经结束
                setTimeout(isgameover(),300) ;
            }
        }
    }else {
    //    y方向
        if (deltay>0){
            //down y轴下为正
            if (moveDown()){
                setTimeout(generateoneNumber(),230);
                setTimeout(isgameover(),300) ;
            }
        }else {
            //up
            if (moveUp()){
                setTimeout(generateoneNumber(),230);
                setTimeout(isgameover(),300) ;
            }
        }
    }

});

//向左移动
function moveLeft() {
//    判断能不能向左移动
    if (!canMoveLeft(board))return false;

    //移动
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            if (board[i][j]!=0){
                for(var k=0;k<j;k++){               //第二个参数得小于第三个参数
                    //如果ik 为0 则移动过去
                    if (board[i][k]==0&&noBlockHorizontal(i,k,j,board)){
                        //move
                        // alert("ksksk0");
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }else if (board[i][j]==board[i][k]&&noBlockHorizontal(i,k,j,board)&&!hasConflictn[i][k]){
                        //合并时 不仅要判断两者是否相当 ，中间是否有障碍物 还要判断 board[i][k] 是否 已经有一次合并碰撞
                        //move
                        showMoveAnimation(i,j,i,k);
                        //add
                        board[i][k]+=board[i][j];
                        board[i][j]=0;

                        hasConflictn[i][k]=true;

                        //增加 分数 在两个盒子合并时 分数增加
                        score+=board[i][k];
                        updateScore(score);

                        continue;
                    }
                }
            }
        }
    }

    //    刷新数据 虽然上面的发生了移动 但是呢 数值并没有改变 需要刷新 但是jquery的动画可能是异步的
//    并不影响循环的时间  所以要延迟200 (动画时间也是200ms) 再刷新 否则动画就看不到了
    setTimeout("updateBoardView()",200);
    return true;
}


//向上移动
function moveUp() {

    if (!canMoveUp(board))return false;

    for(var j=0;j<4;j++){
        for(var i=0;i<4;i++){
            if (board[i][j]!=0){
                for(var k=0;k<i;k++){
                    if (board[k][j]==0&&noBlockVertical(j,k,i,board)){

                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }else if(board[i][j]==board[k][j]&&noBlockVertical(j,k,i,board)&&!hasConflictn[k][j]){

                        showMoveAnimation(i,j,k,j);
                        board[k][j]+=board[i][j];
                        board[i][j]=0;

                        hasConflictn[k][j]=true;

                        score+=board[k][j];
                        updateScore(score);
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}
// 向右移动
function moveRight() {

    if(!canMoveRight(board)) return false;

    for(var i=0;i<4;i++){
        for(var j=3;j>=0;j--){
            if (board[i][j]!=0){
                for (var k=3;k>j;k--){

                    if (board[i][k]==0&&noBlockHorizontal(i,j,k,board)){
                    //    move
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }if (board[i][k]==board[i][j]&&noBlockHorizontal(i,j,k,board)&&!hasConflictn[i][k]){
                        showMoveAnimation(i,j,i,k);
                        board[i][k]+=board[i][j];
                        board[i][j]=0;

                        hasConflictn[i][k]=true;

                        score+=board[i][k];
                        updateScore(score);
                        continue;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()",200);
    return true;
}
//向下移动
function moveDown() {
    if (!canMoveDown(board)) return false;

    for(var j=0;j<4;j++){
        for(var i=3;i>=0;i--){
            if (board[i][j]!=0){
                for(var k=3;k>i;k--){
                    if (board[k][j]==0&&noBlockVertical(j,i,k,board)){
                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }else if(board[k][j]==board[i][j]&&noBlockVertical(j,i,k,board)&&!hasConflictn[k][j]){
                        showMoveAnimation(i,j,k,j);
                        board[k][j]+=board[i][j];
                        board[i][j]=0;

                        hasConflictn[k][j]=true;

                        score+=board[k][j];
                        updateScore(score);
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}
//程序是否结束
function isgameover() {
//   没位置 不能移动 则游戏结束
    if (nospance(board)&&noMove(board)){
        gameover();
    }
}
//游戏结束
function gameover() {
    alert("gameover 您的分数为 ："+score);
}