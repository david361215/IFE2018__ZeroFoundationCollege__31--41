// 这里根据用户点击表单的情况，做各种显示
// 首先处理表单的点击逻辑，然后显示表格的表头表身，显示两份图表，图例
// 需要用到drwaTable，drawChart和dataTransform模块的函数
// 点击表单，即开始展示图表
let form = document.getElementsByTagName("form");
let region = document.getElementsByName("region");
let product = document.getElementsByName("product");

form[0].addEventListener("click",function(e){
    if(e.target.type === "checkbox"){
        handleTheLogicOfClickWhichCheckbox("region-checkbox-wrapper",e);  // 处理表单逻辑
        handleTheLogicOfClickWhichCheckbox("product-checkbox-wrapper",e);
        tableHead();   //画表格表头
        tableBody(trsnaposeRegionAndProduct(chooseSourceData_AccordingToSomeCheckboxInput(sourceArr)));  // 画表格表身
        drawChart();   //画图表
        drawLegend();    // 画图例
        transCheckboxValue_IntoHash();
    }
})
// 多选框互相之间的选择关系
// 注意click事件是在selectd状态改变之后发生的，也就是先感知到是否被点击，然后才执行click事件
function  handleTheLogicOfClickWhichCheckbox(id,e){
    let input = document.querySelector("#"+id).querySelectorAll("input");
    // 如果点击全选，那么如果发现全选被选择，则所有其余项也要被选择，否则其余项都不被选择
    if( e.target == input[3] ){
        if ( input[3].checked ){
            input[0].checked = true;
            input[1].checked = true;
            input[2].checked = true;
        } else{
            input[0].checked = false;
            input[1].checked = false;
            input[2].checked = false;
        } // 如果点击其余三个项，那么如果三个项全都被选中，则全选项也要被选中                
    } else if (e.target == input[0] || e.target == input[1] || e.target == input[2]) {
        if ( input[0].checked&&input[1].checked&&input[2].checked ){
            input[3].checked = true;
        } // 如果三个项有一个没被选中，那么全选也不被选中
        if ( !input[0].checked || !input[1].checked || !input[2].checked ){
            input[3].checked = false;
        } // 如果三个项都没被选中，那么最后被点击的这个项必须被选中，不能空着
          // 这里注意体会，选中状态和click事件之间的先后顺序
        if ( !input[0].checked && !input[1].checked && !input[2].checked ){
            e.target.checked = true;
        }
    }
}
