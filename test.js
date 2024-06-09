
function getGoodControlPoint(angle, x1, y1, x2, y2){
  const k = (y2 - y1) / (x2 - x1),
        d = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)/2
  const x = d * Math.tan(angle)
            * (k/Math.sqrt(k*k+1))
            + (x1 + x2) / 2,
        y = d * Math.tan(angle)
            * (1/Math.sqrt(k*k+1))
            + (y1 + y2) / 2
  console.log(x,y)
  return [x, y]
}

function test(){
      let a = [[1,0], [2,1]]
      a = a.sort((a,b)=>a[0]-b[0])
      const cur = a.shift()
      console.log(a)
      console.log(cur)
}
test()
