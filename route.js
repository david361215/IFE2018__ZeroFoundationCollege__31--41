// 用到 base.js 中的transNodelistIntoArray函数
// 用到 checkbox.js 中的whetherClickTheSelectAll函数
// 用到 dataTransform.js 中的chooseValue_FromTwoSetsOfCheckboxInput函数

// 此处的思路是：根据用户选择保存相应地区和产品到hash中，但不保存“全选”项。根据hash渲染数据时，由于不需要处理“全选”，所以会很容易。
// 至于是否要选中“全选”，只需要根据这一组多选框是否选中除了“全选”外的所有选项，即可。这样不用考虑“全选”，整个过程都简明易懂很多。

// 根据hash的值，模拟用户选择，选中表单中相应值。注意hash中不包括全选
function selectCheckbox_AccordingToHash(){
    let allCheckbox = [];
    let productCheckbox = document.getElementsByName("product");
    let regionCheckbox = document.getElementsByName("region");
    transNodelistIntoArray(productCheckbox,allCheckbox);
    transNodelistIntoArray(regionCheckbox,allCheckbox);
    clickCheckbox_AccordingToHash(allCheckbox); //根据hash，选择相应多选框
    whetherClickTheSelectAll(productCheckbox);  //是否选择多选框中的“全选”
    whetherClickTheSelectAll(regionCheckbox);   //同上
    tableHead();   //画表格表头
    tableBody(trsnaposeRegionAndProduct(chooseSourceData_AccordingToSomeCheckboxInput(sourceArr)));  // 画表格表身
    drawChart();   //画图表
    drawLegend();  // 画图例
}
// 根据hash，选中若干表单元素，但不包括“全选”这个选项
function clickCheckbox_AccordingToHash(allCheckbox){
    for(let i=0;i<allCheckbox.length;i++){
        allCheckbox[i].checked=false;
    }
    let hash = decodeURIComponent(window.location.hash);
    hash = hash.slice(1,hash.length);
    hash = hash.split("_");
    console.log(hash);
    for(let i = 0; i < hash.length; i++){
        for(let j = 0; j < allCheckbox.length; j++){
            if(allCheckbox[j].value === hash[i]){
                allCheckbox[j].checked = true;
            }
        }
    }
}
// 将用户在表单中选择的产品和地区保存进hash，但不保存“全选”这个选项
function transCheckboxValue_IntoHash(){
    let arr = chooseValue_FromTwoSetsOfCheckboxInput();
    let str = "";
    for(let i = 0; i < 2; i++){
        for(let j = 0; j < arr[i].length; j++ ){
            if(arr[i][j] !== "全选"){
               str += arr[i][j] + "_";
            }
        }
    }
    str = str.slice(0,str.length - 1);  //删除位于字符串末尾的下划线
    window.location.hash = str;
}
// 将一个Nodelist转换成数组
function transNodelistIntoArray(Nodelist,arr){
    for(let i = 0 ; i < Nodelist.length; i++){
        arr.push(Nodelist[i]);
    }
    return arr;
}
// 如果一组checkbox除了最后一个外，都被选中，那么也选中最后一个
function whetherClickTheSelectAll(oneSetOfCheckbox){
    let checkedNum = 0;
    let length = oneSetOfCheckbox.length;
    for(let i = 0; i < length - 1; i++){
        if(oneSetOfCheckbox[i].checked){
            checkedNum++;
        }
    }
    if(checkedNum === length - 1){
        oneSetOfCheckbox[length - 1].checked = true;
    }
}