export function* uniqueIdGenerator() {
  let id = 0;
  while (true) {
    yield id++;
  }
}

export function randInt(min, max, except=[]){
  while(true){
    const ret = parseInt(Math.random()*(max-min+1) + min)
    if(!except.includes(ret)){
      return ret
    }
  }
}

/**
  * 
  * @param {[number, number]} x 
  * @param {[number, number]} y 
  */
export function calPointDistince(x,y){
  const w = Math.abs(x[0] - y[0])
  const h = Math.abs(x[1] - y[1])
  return Math.sqrt(w*w + h*h)
}

export function message(s){
  alert(s)
}