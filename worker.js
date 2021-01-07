onmessage = function (evt) {
  const canvas = evt.data.canvas;
  //canvas.width = window.innerWidth
  //canvas.height = window.innerHeight
  const ctx = canvas.getContext(
    '2d',
    {
      antialias: false,
      depth: false,
      imageSmoothingEnabled: false
    })
  const objects = []
  const w = canvas.width
  const h = canvas.height

  const windowW = evt.data.windowW
  const windowH = evt.data.windowH


  let randomValues = new Uint8Array(2);
  crypto.getRandomValues(randomValues);


  for (let i = 0; i < 10000; i++) {
    addRandomObject(randomValues, objects);
  }

  const start = () => {
    animate();
  }

  ctx.beginPath()
  ctx.lineCap = "round"
  ctx.lineWidth = 3
  ctx.strokeStyle = "#ffffff"

  function animate() {

    if (objects.length < 100) {
      addRandomObject(randomValues, objects);
    }

    //ctx.clear() // bleeding edge tech

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath()
    objects.map((obj) => {

      ctx.moveTo(obj.x, obj.y)
      //ctx.clearRect(obj.x+4,obj.y+4,7,7) I want to believe
      ctx.lineTo(obj.x, obj.y)
      obj.y = (obj.y + obj.r)
      obj.x += (Math.sin((obj.y+obj.offset)/h)) * obj.r * 0.2
      
      if (obj.y > h) {
        obj.x = randomValues[0] * (windowW/255)
        obj.y = randomValues[1] * 4 - 1080
        //obj.r = (randomValues[1] >> 5) + 5
        
        crypto.getRandomValues(randomValues);
      }
    })
    ctx.stroke()
    
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(start);

  function addRandomObject(randomValues, objects) {
    let x = randomValues[0] * (windowW/255);
    let y = randomValues[1] * 4 - 1080
    let r = 3
  
    crypto.getRandomValues(randomValues);
    objects.push({ x: x, y: y, r: r , offset: y});
  }
};


