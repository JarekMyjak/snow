onmessage = function (evt) {
  const canvas = evt.data.canvas;
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
  const snowflakes = evt.data.snowflakes

  // I replaced standard random functions with this, i don't want to make a big random float just to map it to bool
  let randomValues = new Uint8Array(2);
  crypto.getRandomValues(randomValues);



  // Adding initial snowflakes
  for (let i = 0; i < snowflakes; i++) {
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

    //ctx.clear() // bleeding edge tech, requires chrome://flags/#new-canvas-2d-api and doesn't work on my machine :/

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //draws the entire screen with one path
    ctx.beginPath()
    objects.map((obj) => {

      //each snowflake is a line of zero length with wide stroke and round endcap
      ctx.moveTo(obj.x, obj.y)
      ctx.lineTo(obj.x, obj.y)

      obj.y = (obj.y + obj.r)
      obj.x += (Math.sin((obj.y+obj.offset)/h)) * obj.r * 0.2
      
      if (obj.y > h) {
        obj.x = randomValues[0] * (windowW/255)

        //spawns offscreen
        obj.y = randomValues[1] * 4 - 1080
        
        //resets random values
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


