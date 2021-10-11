function quickSort(arr, l ,r){      //快排，在判断条件时增加=来判断有重复数据时的情况，否则会进入死循环
    function getIndex(arr, l, r){
        let temp = arr[l];
        while(l < r){
            while(l<r && arr[r]<=temp)r--;
            arr[l] = arr[r];
            while(l<r && arr[l]>temp)l++;
            arr[r] = arr[l]
        }
        arr[l] = temp;
        return l;
    }

    if(l>=r)return;
    let index = getIndex(arr, l, r);
    quickSort(arr, l, index - 1);
    quickSort(arr, index+1, r);
}


function findKthLargest(nums, n) {       //找到第K大的数
    let res = 0;
    quickSort(nums, 0, nums.length-1)
    return res;

    function quickSort(arr, l ,r){
        function getIndex(arr, l, r){
            let temp = arr[l];
            while(l < r){
                while(l < r && arr[r]<=temp)r--;
                arr[l] = arr[r];
                while(l < r && arr[l]>temp)l++;
                arr[r]=arr[l]
            }
            arr[l] = temp;
            return l;
        }

        let index = getIndex(arr, l, r);
        if(index > k - 1)
            quickSort(arr, l, index - 1);
        else if(index < k - 1)
            quickSort(arr, index+1, r);
        else{
            res = arr[index];
            return;
        } 
    }
};

let n = [3,2,3,1,2,4,5,5,6];
findKthLargest(n, 4);


var smallestK = function(arr, k) {      //找到最小的K个数
    let res = [];
    quickSort(arr, k, 0, arr.length - 1, res);
    return res;
};
function quickSort(arr, k, l, r, res){
    if(l>=r)return;
    let index = getIndex(arr, l, r);
    if(index > k - 1)
        quickSort(arr,k,l, index - 1, res);
    else if(index < k - 1)
        quickSort(arr,k,index+1, r, res);
    else
        res.push(...arr.slice(0, k));
}
function getIndex(arr, l, r){
    let temp = arr[l];
    while(l<r){
        while(l<r && arr[r]>=temp)r--;
        arr[l]=arr[r];
        while(l<r && arr[l]<temp)l++;
        arr[r]=arr[l];
    }
    arr[l] = temp;
    return l;
}
let a = [1,3,5,7,2,4,6,8];
console.log(smallestK(a, 4));
