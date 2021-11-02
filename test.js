function kkk(obj){
  let res = {};
  for(let i in obj){
    if(obj[i] instanceof Object){
      let t = kkk(obj[i]);
      for(let a in t)
        res[i + '.' + a] = t[a];
    }
    else
      res[i] = obj[i];
  }
  return res;
}


let my = {
  a: {
    b: 'c',
    d: {
      e: 'f'
    }
  },
  g: 'h'
}
let r = kkk(my);
console.log(r);
// {
//   a.b: 'c',
//   a.d.e: 'f'
//   g: 'h'
// }
