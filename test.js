function myNew(constructor){
  let obj = Object.create();
  obj.__proto__ = constructor.prototype;    //指定原型
  constructor.call(obj, Array.prototype.slice.call(arguments, 1));    //调用构造函数
  return obj;
}

Function.prototype.myCall = function(o){
  let obj = o || window;
  let f = Symbol();
  obj[f] = this;
  let newArguments = [];
  for(let i = 1; i<arguments.length; i++)
    newArguments.push(arguments[i]);
  let res = obj[f](...newArguments);
  delete obj[f];
  return res;
}

Function.prototype.myApply = function(o){
  let obj = o || window;
  let f = Symbol();
  obj[f] = this;
  let res;
  if(arguments[1])
    res = obj[f](...arguments[1]);
  else
    res = obj[f]();
  delete obj[f];
  return res;
}

Function.prototype.myBind = function(o){
  let that = this;
  let arguments1 = [].slice.call(arguments, 1);
  let newf = function(){
    let arguments2 = [].slice.call(arguments);
    if(this instanceof newf)    //如果使用new调用newf，那么this指向新创建的实例，且在同一条原型链上，条件为true
      return that.apply(this, arguments1.concat(arguments2))    //将构造函数的this绑定到该实例上
    else
      return that.apply(o, arguments1.concat(arguments2));
  }
  let emptyf = function(){};
  emptyf.prototype = that.prototype;    //以空函数作为跳板，将空函数的原型指向构造函数的原型
  newf.prototype = new emptyf();    //将newf函数也就是使用new关键字时的构造函数的原型指向emptyf实例，实现原型链继承
  //newf.prototype = new that();    也可以实现原型链继承
  return newf;
}

function print(a,b,c){
  console.log(this.name);
  console.log(a, b, c);
  return '567'
}
let person = {
  'name': '123',
  'age': '22',
  'tei': '234'
}
let newprint = print.myBind(person, 1,2,3);
let b = new newprint();
console.log(b);
