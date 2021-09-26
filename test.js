//*********************** 防抖
function debounce(func, sleep){       //将func函数的参数作为debounce函数的参数传入，调用时使用call绑定
    let timer = '';
    return function(args){
        if(timer)
            clearSetTimeout(timer);
        timer = setTimeout(func.call(this, args), sleep);
    }
}

function output(s){
    print(s);
}

let a = debounce(output, 500);
a('123');


//*********************** 节流
function throttle(func, sleep){       //将func函数的参数作为throttle函数的参数传入，调用时使用call绑定
    let timer = '';
    return function(args){
        if(!timer){
            timer = setTimeout(() => {
                func.call(this, args);
                timer = '';
            }, sleep);
        }
    }
}

function output(s){
    print(s);
}

let a = throttle(output, 500, '123');
a('123');
