/**
 * Created by vivid on 2017/6/1.
 */
//获取当前设备屏幕宽度
var documentWigth=window.screen.availWidth;
//游戏大方块的背景宽度
var gridContainerWidth=0.92*documentWigth;
//设置小方块的变长
var cellSideLength=0.18*documentWigth;
//小方块间的间距
var cellSpace=0.04*documentWigth;
// 计算top
function getPosTop(i, j) {
    return cellSpace+i*(cellSpace+cellSideLength);
}
// 计算left
function getPosLeft(i, j) {
    return cellSpace+j*(cellSpace+cellSideLength);
}

//返回一个背景色
function getNumberBackgroundColor(number) {
    switch(number){
        case 2:return "#eee4da";break;
        case 4:return"#ede0c8";break;
        case 8:return"#f2b179";break;
        case 16:return"#f59563";break;
        case 32:return"#f67c5f";break;
        case 64:return"#f65e3b";break;
        case 128:return"#edcf72";break;
        case 256:return"#edcc61";break;
        case 512:return"#9c0";break;
        case 1024:return"#33b5e5";break;
        case 2048:return"#09c";break;
        case 4098:return"#a6c";break;
        case 8192:return"#93c";break;
    }
    return "black";
}
//设置前景色
function getNumberColor(number) {
    //数字为2和4 是这个颜色 其他时候都是白色
    if (number<=4)
        return "#776e65";
    return "white";
}

//判断4*4格子是否有空余
function nospance(board) {
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            if(board[i][j]==0){
                //还有空间
                return false;
            }
        }
    }
    //没有空间
    return true;
}

//显示指定新增的值 外加动画（从宽高为0 到100 定位点也从中间移到背景格子左上角）
function showNumberWidthAnimation(x, y, Number) {

    //拿到格子
    var numberCell=$("#number-cell-"+x+"-"+y);
    //背景色
    numberCell.css('background-color',getNumberBackgroundColor(Number));
//    字体色
    numberCell.css("color",getNumberColor(Number));
//    文字内容
    numberCell.text(Number);

//  jquery的动画
// 原先是宽高为0 变成100px  刚开始位置在对应格子中间 所以 top left 需要重新获取
    numberCell.animate({
        width:cellSideLength,
        height:cellSideLength,
        top:getPosTop(x,y),
        left:getPosLeft(x,y)
    },50);
}

//    判断能不能向左移动
function canMoveLeft(board) {
    for(var i=0;i<4;i++){
        //应为是向左移动 所以左边一列不用管
        for(var j=1;j<4;j++){
            // 有空位 或者同一行相邻两个元素值一样 就可以合并
            if (board[i][j]==0||board[i][j-1]==board[i][j])
                return true;
        }
    }
    return false;
}
//    判断能不能向上移动
function canMoveUp(board) {
    for(var j=0;j<4;j++){
        //向上移动 第一行就不管啦
        for(var i=1;i<4;i++){
            // 有空位 或者同一行相邻两个元素值一样 就可以合并
            if (board[i][j]==0||board[i-1][j]==board[i][j])
                return true;
        }
    }
    return false;
}
//能否向右移动
function canMoveRight(board) {
    for(var i=0;i<4;i++){
        for(var j =2;j>=0;j--){
            if (board[i][j]==0||board[i][j+1]==board[i][j]) return true;
        }
    }
    return false;
}
//能否向下移动
function canMoveDown(board) {
    for (var j=0;j<4;j++){
        for(var i=2;i>=0;i--){
            if (board[i][j]==0||board[i+1][j]==board[i][j]) return true;
        }
    }
    return false;
}

//判断移动时 水平方向 是否有障碍物
function noBlockHorizontal(row, col1, col2, board) {
    for(var i=col1+1;i<col2;i++){
        if (board[row][i]!=0){
            return false;
        }
    }
    return true;
}
//判断移动时 垂直方向 是否有障碍物
function noBlockVertical(col, row1, row2, board) {
    for(var i=row1+1;i<row2;i++){
        if (board[i][col]!=0){
            return false;
        }
    }
    return true;
}

//不能移动
function noMove(board) {
    if (canMoveUp(board)||canMoveDown(board)||canMoveLeft(board)||canMoveRight(board)){
        return false;
    }
    return true;
}





