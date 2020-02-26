// 这部分是处理localStorage的工具函数
// 包括两个将中英文互相转换的函数，两个将二维数组和localStorage中的内容互相转换的函数，一个将表格内容转换成二维数组的函数。
// 需要从dataTransform模块中，调用这两个函数：transSourceData_IntoTwoDimensionArray，chooseSourceData_AccordingToSomeCheckboxInput
let sourceArr = load();
// 二维数组中的英文转化为中文
function translateEnglishIntoChinese(arr){
    for ( let i = 0; i < arr.length; i++ ){
        for ( let j = 0; j < arr[i].length; j++){
            if ( arr[i][j] == "mobile" ){
                arr[i][j] = "手机";
            } else if ( arr[i][j] == "notebook" ){
                arr[i][j] = "笔记本";
            }else if (arr[i][j]== "digitalspeaker"){
                arr[i][j] = "智能音箱";
            }
            if ( arr[i][j] == "eastchina" ){
                arr[i][j] = "华东";
            } else if ( arr[i][j] == "northchina" ){
                arr[i][j] = "华北";
            } else if ( arr[i][j] == "southchina" ){
                arr[i][j] = "华南";
            }
        }
    }
    return arr; 
}
// 将二维数组中的中文转化为英文
function translateChineseIntoEnglish(arr){
    for ( let i = 0; i < arr.length; i++ ){
        for ( let j = 0; j < arr[i].length; j++){
            if ( arr[i][j] == "手机" ){
                arr[i][j] = "mobile";
            } else if ( arr[i][j] == "笔记本" ){
                arr[i][j] = "notebook";
            } else if (arr[i][j]== "智能音箱"){
                arr[i][j] = "digitalspeaker"
            }
            if ( arr[i][j] == "华东" ){
                arr[i][j] = "eastchina";
            } else if ( arr[i][j] == "华北" ){
                arr[i][j] = "northchina";
            } else if ( arr[i][j] == "华南" ){
                arr[i][j] = "southchina";
            }
        }
    }
    return arr; 
}
// 将表格内容转化为二维数组
function transTableBodyIntoArr(){
    let tbodyTrs = document.querySelector("tbody").querySelectorAll("tr");
    let arr = [];
    let length = tbodyTrs[0].querySelectorAll("td").length;
    for ( let i = 0; i < tbodyTrs.length; i++ ) {
        let tds = tbodyTrs[i].querySelectorAll("td");
        let arr1 = [];
        for ( let j = 0; j < length; j++) {
            if ( j == 0 ) {
                arr1.push(chooseSourceData_AccordingToSomeCheckboxInput(load())[i][0]); //这是产品名
            } else if ( j == 1 ) {
                arr1.push(chooseSourceData_AccordingToSomeCheckboxInput(load())[i][1]); //这是地区名
            } else if ( j > 1) {                                                        //之所以不从表格中获取这两个名字，是因为表格中有跨行，不方便获取
                if ( tds.length == 14 ){
                    arr1.push(tds[j].childNodes[0].value);   // td的第一个子元素是input
                } else if ( tds.length == 13 ) {
                    arr1.push(tds[j-1].childNodes[0].value);
                }
            }
        }
        arr.push(arr1);
    }
    return arr;
}
// 将内容全为英文和数字的二维数组中的内容存储进 localStorage
function transTwoDimensionArrayIntoLocalStorage(arr){
    for ( let i = 0; i < arr.length; i++ ){
        let value = "";
        for ( let j = 2; j < arr[i].length; j++ ){
            if ( j !== arr[i].length - 1 ){
                value += arr[i][j] + ","
            } else if ( j == arr[i].length - 1 ){
                value += arr[i][j];
            }
        }
        localStorage.setItem(arr[i][0] + "_" + arr[i][1],value);
    }
}
// 将 localStorage 中的内容转化为二维数组
function transLocalStorageIntoArr(){   
    let arr = translateChineseIntoEnglish(transSourceData_IntoTwoDimensionArray());
    for ( let i = 0; i < arr.length; i++ ){
        for ( let j = 0; j < localStorage.length; j++ ){
            let num = localStorage.key(j).indexOf("_");
            if ( localStorage.key(j).slice(0,num) == arr[i][0] && localStorage.key(j).slice(num+1) == arr[i][1] ){
                arr[i].splice(2,12);
                let arr2 = localStorage.getItem(localStorage.key(j)).split(",");
                for ( let k = 0; k < arr2.length; k++ ){
                    arr[i].push(arr2[k]);
                }
            }
        }
    }
    return arr;
}
// 加载数据，如果localStorage中有数据，那么从其中加载，否则，从本地文件加载
function load(){
    let sourceArr = [];
    if ( localStorage.length !== 0 ){
        sourceArr = translateEnglishIntoChinese(transLocalStorageIntoArr());
    } else if( localStorage.length == 0 ){
        sourceArr = transSourceData_IntoTwoDimensionArray();
    }
    return sourceArr;
}