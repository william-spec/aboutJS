let arr = [1,2,3,[4,5,[6,7],8],9,10,[23,12]];

function flatten(array, n){
    for(let i = 0; i<n; i++){
        array = [].concat(...array);
    }
    return array;
}

function flatten2(array, n){
    if(n === 0)return array;
    return array.reduce((res, cur) => {
        if( cur instanceof Array )res.push(...flatten2(cur, n-1));
        else res.push(cur);
        return res;
    }, [])
}

console.log(flatten2(arr, 2));
