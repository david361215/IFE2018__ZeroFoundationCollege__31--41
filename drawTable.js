// 这里是渲染表格表头和表身的两个函数。
// 渲染表头需要一些文字，这里直接放在函数中，就不通过传参了，因为这个函数就用一次，目前看不到传参的必要。
// 渲染表头需要 chooseValue_FromTwoSetsOfCheckboxInput函数。
// 渲染表身，参数是被显示的那部分源数据。通过chooseSourceData_AccordingToSomeSelectElement函数，加上所有源数据，即可获得该参数

// 还有三个函数，分别是点击输入框，点击取消按钮，点击确定按钮这三个事件的处理函数。
// 这三个函数不需要外部函数，只是对DOM元素做处理。

// 将数据渲染成表格头部
function tableHead() {
    let region1 = chooseValue_FromTwoSetsOfCheckboxInput()[0];
    let product1 = chooseValue_FromTwoSetsOfCheckboxInput()[1];       
    let thead = document.querySelector("thead");
    thead.innerHTML = "";
    // 渲染表头
    let tr1 = document.createElement("tr");
    let product = document.createElement("th");
    product.innerHTML = "商品";
    let region = document.createElement("th");
    region.innerHTML = "地区";
    // 表格头部的顺序也要根据地区和产品的数量情况，进行调换
    if ( region1.length == 1 && product1.length !== 1 ){
        tr1.appendChild(region);
        tr1.appendChild(product);
    } else {
        tr1.appendChild(product);
        tr1.appendChild(region);           
    }
    // 这是销售额的月份
    for( let k = 1; k < 13; k++){
        let td = document.createElement("td");
        td.innerHTML = k + "月";
        tr1.appendChild(td);
    }
    thead.appendChild(tr1);
}
// 将数据渲染成表格主体内容
// 这里的数组参数是刚才准备好的二维数组
function tableBody(arr){
    let tbody = document.querySelector("tbody");
    tbody.innerHTML = "";
    let num = 1;
    // 渲染其余表格内容
    for ( let i = 0; i < arr.length; i++){
        let tr2 = document.createElement("tr");
        //tr2.setAttribute("data-info",arr[i][0]+"-"+arr[i][1]);
        for ( let j = 0; j < 14; j++){
            // 合并单元格，就是当第一列的上下两行的数据出现重复时，将上一行数据跨行，且下一行不再增添td。
            // 如果不断出现重复，此时，不断对第一行进行跨行操作
            // 注意这里是先准确拿到要跨行的td，再增加num，然后再根据num进行跨行。因为num这个数据两个地方都要使用，一个是获取要跨行的元素，另一个是决定跨几行。
            // 核心问题是，谁来跨行，跨几行
            if ( i > 0 && j == 0 && arr[i][0] == arr[i-1][0] ){
                let lastTd = tbody.querySelectorAll("tr")[i-num].querySelector("td");
                num++;
                lastTd.rowSpan = num;
            }
            // 如果首列的元素遇上一行不同，那么就新增这个td元素，但是作为标记的num就要从1开始。相当于重新开始记录要跨行的元素以及跨几行 
            else if ( i > 0 && j == 0 && arr[i][0] !== arr[i-1][0] ){
                let td = document.createElement("td");
                td.innerHTML = arr[i][j];
                tr2.appendChild(td);
                num = 1;
                td.style.width = "64px";
            }
            // 从第三列开始，增加input到td中
            else if ( j > 1) {
                let td = document.createElement("td");
                let input = document.createElement("input");
                input.className = "text";
                input.value = arr[i][j];
                td.appendChild(input);
                tr2.appendChild(td);
            // 常规操作，新增td
            } else {
                let td = document.createElement("td");
                td.innerHTML = arr[i][j];
                tr2.appendChild(td);
                td.style.width = "64px";
            }
        }
        tbody.appendChild(tr2);
    }
}
// 当地区只选择了一个，而产品多于一个时，将选好的二维数组的头两项调换位置，使其中每个数组的第一项变成地区，第二项变成产品
function trsnaposeRegionAndProduct ( selectedSourceData ) {
    let region = chooseValue_FromTwoSetsOfCheckboxInput()[0];
    let product = chooseValue_FromTwoSetsOfCheckboxInput()[1];
    let arr = [];    //  这里不能影响参数数组selectedSourceData，所以不能直接在selectedSourceData中调整产品和地区的位置，要用一个新的数组
    if ( selectedSourceData !== undefined ){
        for (let i = 0; i < selectedSourceData.length; i++){
            let arr1 = [];
            for ( let j = 0; j < selectedSourceData[i].length; j++ ){
                arr1[j] = selectedSourceData[i][j];
            }
            arr.push(arr1);
        }
        if ( region.length == 1 && product.length !== 1 ){
            for ( let k = 0; k < arr.length; k++){  // 针对地区只有一个，而产品多于一个的情况，将地区放在数组前头。将来呈现时，就会看到地区在第一列
                {
                    let product1 = arr[k][0];
                    arr[k][0] = arr[k][1];
                    arr[k][1] = product1;
                }
            }            
        }
        return arr;
    }else {
        return [];
    }
}
// 鼠标单击输入框时，输入框右侧显示两个按钮。同时将输入框内的值保存到一个自定义属性上。
function clickInput(element){
    let input = document.querySelector("table").querySelectorAll("input");
    for ( let i = 0; i < input.length; i++ ){          // 清除所有按钮
        if ( input[i].parentNode.querySelector("div") ){
            input[i].parentNode.removeChild(input[i].parentNode.querySelector("div"));
        }
    }
    let div = document.createElement("div");   // 为当前输入框添加按钮
    let button1 = document.createElement("button");
    button1.innerText = "确定";
    div.appendChild(button1);
    let button2 = document.createElement("button");
    button2.innerText = "取消";
    div.appendChild(button2);
    element.parentNode.appendChild(div);
    element.dataset.value = element.value;   // 保存当前输入框的值
}
// 点击取消按钮，令输入框失去焦点，恢复输入框本身的值，移除按钮
function clickCancel(){
    let div = document.querySelector("tbody").querySelector("div");
    if(div){
        div.previousSibling.blur();
        div.previousSibling.value = div.previousSibling.dataset.value;
        div.parentNode.removeChild(div);
    }
}
// 点击确定按钮，检查输入是否合法，
// 如果不合法，令输入框恢复焦点，恢复输入框本身的值，使用户可以基于原先的正确的值，继续输入
// 如果合法，令输入框失去焦点，
function clickConfirm(){
    let div = document.querySelector("tbody").querySelector("div");
    if(div){
        if(/^[1-9]{1}[0-9]*$/.test(div.previousSibling.value)){
            div.previousSibling.blur();
            div.previousSibling.dataset.value = div.previousSibling.value;
            div.parentNode.removeChild(div);
        }else{
            alert("输入错误");
            div.previousSibling.focus();
            div.previousSibling.value = div.previousSibling.dataset.value;
        }
    }
}