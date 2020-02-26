// 坐标轴横轴方向上，刻度线需要三个数据，刻度值需要一个数据，这里默认是“月”
// 坐标轴纵轴方向上，刻度线需要三个数据，刻度值需要一个数据，即所有源数据的最大值
// 折线图，点的横坐标需要三个数据，同坐标轴横轴一样,纵坐标还需要两个数据，所有源数据，以及自身那组数据
// 柱状图同折线图需要数据一样
// 画图例需要源数据，要显示的那部分源数据。
// 因此，需要从外部文件获取的数据有两个，一个是未经处理的所有源数据，一个是要显示的那部分源数据。后者通过chooseSourceData_AccordingToSomeCheckboxInput函数即可获得
let dataOfHistogramCoordinate = {
    flag:'histogram',
    id:"#histogram",
    canvas_height: "300",
    canvas_width: "600",
    canvas_style_width: "45%",
    xStart: 50,
    yStart: 15,
    axisH: 250,
    axisL: 500,
    source: sourceArr,
    xquota:12,
    yquota:5
}
let dataOfLinechartCoordinate = {
    flag:'linechart',
    id:"#linechart",
    canvas_height: "300",
    canvas_width: "600",
    canvas_style_width: "45%",
    xStart: 50,
    yStart: 15,
    axisH: 250,
    axisL: 500,
    source: sourceArr,
    xquota:11,
    yquota:5
}
let colorArr = ["#60acfc","#3c72c4","#2292dd","#5bc49f","#8cbb44","#c4c43c","#ff7c7c","#b34d4d","#d52bb3"];
// 定义好画布，画出坐标轴及刻度
// 四件事，1 画布大小，2 坐标轴大小，3 刻度值及其位置，刻度线的位置，4 辅助线长度及位置
// 做这四件事，需要哪些数据？
// 1 画布大小，需要三个数据，2 坐标轴大小，需要四个数据，3 刻度值分水平和竖直，关于水平刻度值，需要知道具体的刻度值（这里是月份），水平方向坐标轴起点位置及长度、打算将该轴分成几
// 份的份数、，坐标 轴长度已经说过了。所以这里需要份数这个数据，以及具体值；竖直刻度值，同样需要份数，坐标轴起点位置及高度（已提供），及具体值，这里的值要根据图表中实际显示的数据
// 来确定，因此这里需要源数据 在这一块，我们需要三个值，分别是横纵轴的份数，以及源数据，4 辅助线的长度就是横轴的长度，位置就是纵轴刻度线的位置，都已经有了。
// 所有这些数据中，稍有难度的是确定纵轴刻度值，也就是如何根据图表中显示的实际值，确定纵轴的最大刻度值
// 首先，需要确定源数据的最大值，然后将其转化为一个稍大一些的值，否则，折线图的最高点就对应纵轴的最高点，这不好看，最后，求出该值与纵轴高度的比例，依据这个比例，将纵轴高度转化
// 为刻度值，绘制在图表中
function drawCoordinate(obj){
// 首先定义绘制区域，也就是画布的宽高，或者说，打算将画布分成多少细密的小方块，这两个值越大，那么就意味着小方块越小。其实是在定义内部坐标系统。
// 因此，这个宽高的值更多的是对内。
// 同时，更本质的是，这个宽高的比值，决定了画布的长宽比。
// 接着定义绘制区域在文本流中的大小，这个是CSS意义上的大小，这个大小可以是百分数，从而令画布可以随视口大小而变动。
// 如果不定义这个CSS意义的大小，那么上面一开始定义的画布的宽高就是画布在文本流中的大小。
// 这两个大小是不一样的，具体解释见：https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_usage
    let canvas = document.querySelector(obj.id);
    // 1 根据画布宽，高，长宽比，中的两个，即可知道另一个。根据长宽比，只须知道CSS宽，高中的一个，即可确定另一个
    canvas.height = obj.canvas_height;
    canvas.width = obj.canvas_width;
    canvas.style.width = obj.canvas_style_width;
    // 接下来依据画布的坐标系统定义内部各个元素的大小及位置
    if ( canvas.getContext ){
        var ctx = canvas.getContext("2d");
        // 2 画两条坐标轴。画坐标轴，需要四个值，把这四个值定义好
        let xStart = obj.xStart;
        let yStart = obj.yStart;
        let axisH = obj.axisH;
        let axisL = obj.axisL;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(xStart, yStart);
        ctx.lineTo(xStart, yStart + axisH);
        ctx.lineTo(xStart + axisL, yStart + axisH);

        // 3 为刻度值做好准备，定义好文本信息样式,即刻度值的样式，位置
        ctx.font = "16px Arial";
        ctx.textAlign = "end";
        ctx.textBaseline = "middle";

        // 获取真实数据中的最大值，用于确定纵轴最大刻度值
        let max1 = transMax(obj.source);
        // 纵轴最大刻度值，与纵轴高度的比例关系。这个比例关系，将把每一个纵轴方向上的的数据值，放在坐标系统中正确的纵轴位置上
        let verticalRatio = max1/axisH;
        // 3.1 画纵轴刻度线及刻度值
        for( let i = 0; i <= obj.yquota; i++){
            let ydiff = i * (axisH / obj.yquota);
            ctx.moveTo(xStart, yStart + ydiff);
            ctx.lineTo(xStart - 10, yStart + ydiff);
            ctx.fillText( (axisH - ydiff) * verticalRatio, xStart - 15, yStart + ydiff);
        }
        // 3.2 画横轴刻度线及刻度值（月份）
        let distanceX = (axisL - axisL % obj.xquota) / obj.xquota;
        if ( obj.flag == 'histogram' ){
            for ( let i = 0; i < obj.xquota; i++ ){
                ctx.moveTo( xStart + distanceX * (0.5 + i), yStart + axisH );
                ctx.lineTo( xStart + distanceX * (0.5 + i), yStart + axisH + 10 );
                ctx.fillText( i + 1 + "月", xStart + distanceX * (0.5 + i) + 16, yStart + axisH + 20 );
            }
        }
        else if ( obj.flag == 'linechart' ){
            for( let i = 0; i < obj.xquota + 1; i++){
                ctx.moveTo( xStart + distanceX * i,yStart + axisH);
                ctx.lineTo( xStart + distanceX * i,yStart + axisH + 10);
                ctx.fillText( i + 1 + "月" , xStart + 16 + distanceX * i , yStart + axisH + 20 );
            }            
        }
        ctx.stroke();

        // 4 画辅助线，六条暗色横线，帮助看清每个位置的值
        ctx.beginPath();
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = '#111';
        ctx.setLineDash([15, 3]);
        for( let i = 0; i < 5; i++){
            ctx.strokeStyle = "#ccc";
            let ydiff = i * (axisH / obj.yquota);
            ctx.moveTo(xStart, yStart + ydiff);
            ctx.lineTo(xStart + axisL, yStart + ydiff);
        }
        ctx.stroke();
    }
}
// 画折线，其实就是确定一个个折线点的坐标，横坐标，纵坐标
// 确定横坐标需要三个值：横轴起点的x坐标值、横轴长度值、份数，然后需要依据长度值和份数，求出每个点在横轴方向上的间隔
// 确定纵坐标需要四个值：纵轴起点的y坐标值，纵轴长度值，所有源数据、当前折线的数据；然后依据所有源数据和纵轴长度，确定比例
function drawPolyline (obj){
    let ctx = document.querySelector(obj.id).getContext("2d");
    let xStart = obj.xStart;
    let yStart = obj.yStart;
    let axisH = obj.axisH;
    let axisL = obj.axisL;
    let xquota = obj.xquota;
    let verticalRatio = transMax(obj.source)/axisH; 
    let distanceX = (axisL - axisL % obj.xquota) / obj.xquota;
    // 画折线
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    // 设置描边颜色
    for ( let i = 0; i < obj.source.length; i++){
        if ( obj.data == obj.source[i] ){
            ctx.strokeStyle = colorArr[i];
        }
    }
    ctx.moveTo(xStart, yStart + axisH - obj.data[2] / verticalRatio );
    for ( let i = 1; i < 12; i++){
        ctx.lineTo( xStart + distanceX * i , yStart + axisH - obj.data[i+2] / verticalRatio );
        ctx.stroke();
    }
    // 画折线上的点
    ctx.beginPath();
    for ( let i = 0; i < 12; i++){
        ctx.moveTo( xStart + distanceX * i , yStart + axisH - obj.data[i+2] / verticalRatio );
        ctx.arc( xStart + distanceX * i, yStart + axisH - obj.data[i+2] / verticalRatio, 2.5, 0, Math.PI*2, true);
    }
    ctx.fill();
}
// 画柱子
function drawColumn(obj){
    let ctx = document.querySelector(obj.id).getContext("2d");
    let xStart = obj.xStart;
    let yStart = obj.yStart;
    let axisH = obj.axisH;
    let axisL = obj.axisL;
    let xquota = obj.xquota;
    let verticalRatio = transMax(obj.source)/axisH;
    let distanceX = (axisL - axisL % obj.xquota) / obj.xquota;
    let length = obj.data.length;
    // 画柱子
    ctx.beginPath();
    for ( let i = 0; i < 12; i++ ){
        for( let j = 0; j < length; j++ ){
            for ( let k = 0; k < obj.source.length; k++){
                if ( obj.data[j] == obj.source[k] ){
                    ctx.fillStyle = colorArr[k];
                }
            }
            // 1/10个distanceX，这是坐标轴上，不同月份的柱子，之间的空隙的一半
            // 8/10则是每个月份所有柱子占有的宽度
            ctx.fillRect( xStart + 1/10 * distanceX + j/length * 8/10 * distanceX + distanceX * i, 
                yStart + axisH - obj.data[j][i+2] / verticalRatio, 
                1/length * 4/5 * distanceX, 
                obj.data[j][i+2] / verticalRatio);
        }
    }
}
// 画图例
function drawLegend(){
    let li = document.querySelector("#legend").querySelectorAll("li");
    document.querySelector("#legend").style.display = "block";
    for ( let i = 0; i < sourceArr.length; i++){
        li[i].style.display = "none";
    }
    for ( let i = 0; i < sourceArr.length; i++ ){
        for ( let j = 0; j < chooseSourceData_AccordingToSomeCheckboxInput(sourceArr).length; j++ ){
            if ( chooseSourceData_AccordingToSomeCheckboxInput(sourceArr)[j] == sourceArr[i] ){
                li[i].style.display = "block";
            }
        }
    }    
}
// 画图表
function drawChart(){
    // 画坐标轴
    drawCoordinate(dataOfHistogramCoordinate); 
    drawCoordinate(dataOfLinechartCoordinate);
    // 画折线图
    for ( let i = 0; i < chooseSourceData_AccordingToSomeCheckboxInput(sourceArr).length; i++ ){
        drawPolyline({
            id:"#linechart",
            source: sourceArr,
            xStart: 50,
            yStart: 15,
            axisH: 250,
            axisL: 500,
            xquota: 11,
            data:chooseSourceData_AccordingToSomeCheckboxInput(sourceArr)[i]
        });
    }
    // 画柱状图
    drawColumn({
        id:"#histogram",
        source: sourceArr,
        xStart: 50,
        yStart: 15,
        axisH: 250,
        axisL: 500,
        xquota: 12,  
        data:chooseSourceData_AccordingToSomeCheckboxInput(sourceArr)
    });
}