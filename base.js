// 判断一个值是否存在于一个数组内，存在则返回true，不存在则返回false
function inArray(arg1,arr){
    for ( let i = 0; i < arr.length; i++){
        if (arg1 == arr[i]){
            return true;
        }
    }
    return false;
}
// 求销售值的最大值
function saleMax(arr,arg1,arg2){
    let arr1 = [];
    if(arguments.length == 1){
        for ( let i = 0; i < arr.length; i++){
            for ( let j = 0; j < arr[i].length - 2; j++){
                arr1.push(arr[i][j + 2]);
            }
        }
    }
    if(arguments.length == 2){
        if ( inArray(arguments[1], selectProdRegi()[0]) ){
            for ( let i = 0; i < arr.length; i++ ){
                if ( arr[i][0] == arg1 ){
                    for ( let j = 0; j < arr[i].length - 2; j++){
                        arr1.push(arr[i][j+2]);
                    }
                }
            }
        } else if ( inArray(arguments[1], selectProdRegi()[1]) ){
            for ( let i =  0; i < arr.length; i++ ){
                if ( arr[i][1] == arg1 ){
                    for ( let j = 0; j < arr[i].length - 2; j++){
                        arr1.push(arr[i][j + 2]);
                    }
                }
            }
        }
    }else if(arguments.length == 3){
        for ( let i =  0; i < arr.length; i++ ){
            if ( arr[i][0] == arg1 && arr[i][1] == arg2 ){
                for ( let j = 0; j < arr[i].length - 2; j++){
                    arr1.push(arr[i][j + 2]);
                }
            }
        }
    }
    return Math.max.apply(Math,arr1);
}
// 获得所有要用的数据中的最大值，用一个函数来完成。再找一个比这个最大值稍大一些的数，作为纵坐标的刻度的最大值
// 这个稍大一些的数，思路是这样，已有最大值的最大位数上的值，加一，然后后面跟上0，比如，做大值是380，那么这个稍大一些的值就是400
function transMax(arr){
    let max = saleMax(arr);
    let maxLength = max.toString().length;
    let max1 = Number(max.toString().charAt(0)) + 1;
    for ( let i = 0; i < maxLength - 1; i++){
        max1 = max1 * 10;
    }
    return max1;
}