//发布订阅模式；将该类型的回调函数存储起来（订阅）；当触发该类型事件时，调用回调函数（发布）；
class sb{
    constructor(){
       this.list = {}; 
    }
    on(type, callback){      //订阅
        if(!this.list)this.list = {};
        if(!list[type]) list[type] = [callback];
        else
            list[type].push(callback);
    }
    off(type, callback){
        if(!list[type]) return;
        else
            list[type] = list[type].filter(item => item !== callback);
    }
    emit(type, ...args){     //发布
        list[type].ForEach(f => {
            f.apply(this, args)
        })
    }
}


//观察者模式（包含发布订阅模式的原理）；将该被观察者的观察者存储起来；当被观察者更新时，调用观察者的函数；
class Subject{
    constructor(name){
        this.observers = [];
        this.name = name;
        this.state = '1';
    }
    attach(observer){
        this.observers.push(observer);
    }
    setState(state){
        this.state = state;
        this.observers.forEach(o => {
            o.update(state);
        })
    }
}
class Observer{
    constructor(name){
        this.name = name;
    }
    update(state){
        console.log('I see change to' + state);
    }
}
