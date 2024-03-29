//************ 实现Promise的constuctor、（resolve、reject）类似、then、（all、race）类似  方法
//************ 1、then回调方法异步调用
//************ 2、先绑定回调后改变状态需要将回调保存在resolve或reject中调用
//************ 3、then中判断三种状态并进行处理
//************ 4、then要实现链式调用（判断三种回调函数返回值--promise、异常、其他值）
//************ 5、then的回调函数的返回值不能与then的返回值相同（循环调用）
//************ 6、then实现穿透传递（当then的参数为空时，设置默认回调将结果传递给下一层的promise）
class Promise{
  PENDING = 'pending';
  FULFILLED = 'fulfilled';
  REJECTED = 'rejected';
  status = this.PENDING;
  result = undefined;
  OnFulfilledCbs = [];    //保存成功的回调函数
  OnRejectedCbs = [];   //保存失败的回调函数

  resolve(value){   
    if(this.status === this.PENDING){
      this.status = this.FULFILLED;
      this.result = value;

      //如果构造函数是异步的，也就是改变状态在用then绑定回调函数之后，那么执行保存的回调函数
      while(this.OnFulfilledCbs.length !== 0)
        this.OnFulfilledCbs.shift()(this.result); 
    }
  }

  reject(reason){
    if(this.status === this.PENDING){
      this.status = this.REJECTED;
      this.result = reason;

      //如果构造函数是异步的，也就是改变状态在用then绑定回调函数之后，那么执行保存的回调函数
      while(this.OnRejectedCbs.length !== 0)
        this.OnRejectedCbs.shift()(this.result);
    }
  }

  constructor(executor){
    try{
      executor(this.resolve.bind(this), this.reject.bind(this));
    }catch(error){
      this.reject(error);
    }
  }

  then(OnFulfilled,OnRejected){
    //如果没有传回调，设置默认回调
    if(typeof OnFulfilled !== 'function')
      OnFulfilled = () => this.result;
    if(typeof OnRejected !== 'function')
      OnRejected = () => {};

    let newPromise = new Promise((resolve, reject) => {
      //如果构造函数中是异步执行，那么就要保存回调函数，在构造函数被执行的时候调用
      if(this.status === this.PENDING){
        this.OnFulfilledCbs.push(value => {   
          this.parse(newPromise, OnFulfilled(value), resolve, reject);
        });
        this.OnRejectedCbs.push(reason => {   
          this.parse(newPromise, OnRejected(reason), resolve, reject);
        });
      }

      if(this.status === this.FULFILLED){
        setTimeout(() => {    
          this.parse(newPromise, OnFulfilled(this.result), resolve, reject);    //执行回调并判断返回值进行返回
        },);  //then方法必须异步，保证同步代码执行完后才能执行

      }
      if(this.status === this.REJECTED)
        setTimeout(() => {    
          this.parse(newPromise, OnRejected(this.result), resolve, reject);   //执行回调并判断返回值进行返回
        },);   //then方法必须异步，保证同步代码执行完后才能执行

    })
    return newPromise;
  }

  parse(promise, res, resolve, reject){    //处理then方法绑定的回调函数的返回值，用以决定then方法的返回promise状态
    if(promise === res)   //无法在then的回调中返回then方法返回的promise，否则为循环调用出错
        throw new TypeError("Chaining cycle detected");
    try{                          
      if(res instanceof Promise)    //若前一个promise的then的回调返回一个promise，那么由该promise的状态来决定新promise是否成功
        res.then(resolve,reject);   
      else
        resolve(res);   //实现链式调用，前一个promise默认情况下返回调用resolve使新promise成功
    }catch(error){
      reject(error);    //若前一个promise抛出异常则调用reject使新promise失败
    }
  }

  static resolve(value){    //静态resolve，可直接Promise.resolve()
    return new Promise((resolve, reject) => {
      if(value instanceof Promise)
        value.then(resolve, reject);
      else
        resolve(value);
    })
  }

  static reject(value){   //静态resolve，可直接Promise.reject()
    return new Promise((resolve, reject) => {
      reject(value);    //调用reject无需判断参数是否为Promise对象，因为结果总是失败
    })
  }

  static all(promises){
    const values = new Array(promises.length);
    let count = 0;
    return new Promise((resolve, reject) => {
      promises.forEach((promise, index) => {
        promise.then(value => {   
          values[index] = value;   //当该promise成功时就将value存入数组，需保证按照promises顺序返回
          count++;
          if(count === promises.length)   //判断是否所有promise都已经成功，并返回成功数组
            resolve(values);
        }, reason => {
          reject(reason);   //失败则直接将该失败值返回
        })
      });
    })
  }

  static race(promises){
    return new Promise((resolve, reject) => {
      promises.forEach(promise => {
        promise.then(value => {
          resolve(value);
        }, reason => {
          reject(reason);
        })
      });
    })
  }
}

//***********测试链式使用和then中回调方法返回值是promise的情况
// let mypromise = new Promise((resolve,reject) => {
//   resolve('111');
// })
// .then(value => {console.log(value); 
//                 // return new Promise((resolve,reject) => {reject('123');});
//                 return mypromise;
//                },
//       reason => {console.log(reason); 
//                  return new Promise((resolve,reject) => {resolve('456');});
//                 })
// .then(value => {console.log('success:' + value);},
//       reason => {console.log('failed:' + reason);})

//***********测试then中回调的返回值与then的返回值相同时的情况
// let promise = new Promise((resolve,reject) => {
//   resolve('111');
// })
// let p = promise.then(value =>{ return p;})

//***********测试静态方法
// Promise.resolve('111').then(value => {console.log(value);})
// Promise.reject('111').then(value => {console.log(value);}
                           // reason => {console.log(reason);})

//***********测试all方法
// let p1 = new Promise((resolve, reject) => {
//   reject('123');
// })
// let p2 = new Promise((resolve, reject) => {
//   resolve('456');
// })
// Promise.all([p1,p2]).then(value => {
//   console.log(value);}, reason => {
//     console.log(reason);
//   })

//***********测试race方法
let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('123')
  }, 1000);
})
let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('345')
  }, 100);
})
Promise.race([p1,p2]).then(value => {
  console.log(value);}, reason => {
    console.log(reason);
  })






//************ 实现Promise的有并发控制的all方法
async function limitedPromiseAll(promises, batchSize = 10){
    let queue = promises.slice(0, batchSize);   //需要执行的队列，其实可以不用
    let res = new Array(promises.length);   //保存结果
    let runningCount = queue.length;
    let i = batchSize;
    return new Promise((resolve, reject) => {
        for(let j = 0; j<batchSize; j++){   //首先将队列中的内容全部执行
            queue.shift()().then(value => {
                console.log(value);
                runningCount--;
                res[j] = value;     //保存结果
                next();     //执行完成后取下一个任务
            }, reason => {
                reject(reason);
            })
        }
        function next(){
            if(i < promises.length){    //判断是否还有任务
                queue.push(promises[i]);    //推入队列
                runningCount++;
                let index = i;      //记录下i变化前该promise的编号
                i++;        //i在执行完成调用then前就自增
                queue.shift()().then(value => {     //马上执行并绑定其回调，回调中依然使用next来在完成后取下一个任务
                    console.log(value);
                    runningCount--;
                    res[index] = value;
                    next(); 
                }, reason => {
                    reject(reason);
                })
            }
            else if(runningCount === 0)
                resolve(res);  
        }
    })
}

function promise1(){
    return new Promise((resolve, reject) => {
        setTimeout(() => {resolve(1)}, 1000);
    })
}

function promise2(){
    return new Promise((resolve, reject) => {
        setTimeout(() => {resolve(2)}, 100);
    })
}

function promise3(){
    return new Promise((resolve, reject) => {
        setTimeout(() => {resolve(3)}, 500);
    })
}

function promise4(){
    return new Promise((resolve, reject) => {
        setTimeout(() => {resolve(4)}, 600);
    })
}

limitedPromiseAll([promise1, promise2, promise3, promise4], 2).then(value => {
    console.log(value);
});
