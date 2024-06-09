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

export function calTangentPoints(x1, y1, r1, x2, y2, r2){
  const angle = Math.atan2(y2-y1, x2-x1)
  return [[x1 + r1*Math.cos(angle), y1 + r1*Math.sin(angle)],
          [x2 - r2*Math.cos(angle), y2 - r2*Math.sin(angle)]]
}

export function getGoodControlPoint(angle, x1, y1, x2, y2){
  const k = (y2 - y1) / (x2 - x1),
        d = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)/2
  const x = d * Math.tan(angle)
            * (k/Math.sqrt(k*k+1))
            + (x1 + x2) / 2,
        y = d * Math.tan(angle)
            * (1/Math.sqrt(k*k+1))
            + (y1 + y2) / 2
  return [x, y]
}

export function calLinePercent(x1, y1, x2, y2, percent){
  return [x1 + (x2-x1)*percent, y1 + (y2-y1)*percent]
}

export function removeAllEventListeners(){
  Array.from(arguments).forEach(i=>{

  })
}