// 这部分是处理源数据的工具函数
// 这里不需要任何外部函数
// 从一个多选框元素数组中，选取全部值，或选取被选中值。根据第一个参数是部分还是全部
function chooseValue_FromCheckboxElement(checkbox){
    let arr = [];
    for ( let i = 0; i < checkbox.length; i++){
        if( checkbox[i].checked ){
            arr.push(checkbox[i].value);
        }
    }
    return arr;  
}
// 获取两个多选框的选中项的值，放进二维数组，返回这个二维数组
function chooseValue_FromTwoSetsOfCheckboxInput (){
    let region = document.getElementsByName("region");
    let product = document.getElementsByName("product");
    let arr = [];
    arr.push(chooseValue_FromCheckboxElement(region));
    arr.push(chooseValue_FromCheckboxElement(product));
    return arr;
}
// 将ife31data.js文件中保存的源数据转化为二维数组。统一用二维数组，因为用数组更容易渲染表格。
function transSourceData_IntoTwoDimensionArray(){
    let arr = [];
    for ( let i = 0; i < sourceData.length; i++ ){
        let arr2 = [];
        arr2.push(sourceData[i].product);
        arr2.push(sourceData[i].region);
        for ( let j = 0; j < sourceData[i].sale.length; j++ ){
            arr2.push(sourceData[i].sale[j]);
        }
        arr.push(arr2);
    }
    return arr;
}
// 根据用户选择的地区和产品，把二维源数据数组中对应的数组挑出来，两个维度的选择，因此要筛选两次
function chooseSourceData_AccordingToSomeCheckboxInput(sourceDateArr){
    let region = chooseValue_FromTwoSetsOfCheckboxInput()[0];
    let product = chooseValue_FromTwoSetsOfCheckboxInput()[1];
    if( region.length === 0 && product.length === 0 ){
        return [];
    }
    let selectedByProduct = chooseSourceData_AccordingToOneCheckboxInput(product,sourceDateArr,0);
    let selectedByRegion = chooseSourceData_AccordingToOneCheckboxInput(region,selectedByProduct,1)
    return selectedByRegion;
}
// 根据一组多选框的若干选中项，去源数据数组中筛选一次，返回源数据的一部分，返回值也是一个二维数组
function chooseSourceData_AccordingToOneCheckboxInput(selectElementArr,sourceDateArr,selectOrderInSourceData){
    let arr = [];
    if(selectElementArr.length === 0) {
        return sourceDateArr;
    }
    for(let i = 0; i < sourceDateArr.length; i++){
        for(let j = 0; j < selectElementArr.length; j++){
            if(selectElementArr[j] === sourceDateArr[i][selectOrderInSourceData]){
                arr.push(sourceDateArr[i]);
            }
        }
    }
    return arr;
}