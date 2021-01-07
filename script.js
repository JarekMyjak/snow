const numberOfCanvasWorkers = 3 // keep it low, beetween 2 and 4 works ok
const numberOfSnowflakesPerCanvas = 7000 // have fun at your own risk, each canvas will spawn that many snowflakes
const scaleFactor = 0.5 // scale difference between canvas objects best results beetween 0.2 and 1 

for (let i = 1; i < numberOfCanvasWorkers + 1; i++) {
    
    const thisCanvasScaleAndIndex = 1 + i*scaleFactor
    const newCanvas = document.createElement('canvas');
    newCanvas.width = window.innerWidth / thisCanvasScaleAndIndex
    newCanvas.height = window.innerHeight / thisCanvasScaleAndIndex
    const canvasID = `workerCanvas${thisCanvasScaleAndIndex.toString().replace('.', '')}`
    newCanvas.id = canvasID

    
    // paralax is handled by scaling canvases
    newCanvas.style.zIndex = (i+3).toString()
    // transform: scale() is weird
    newCanvas.style.transform = 'scale('+((thisCanvasScaleAndIndex*2)-1)+')'

    document.body.appendChild(newCanvas);
    const canvasWorker = document.getElementById(canvasID).transferControlToOffscreen();
    const w = window.innerWidth
    const h = window.innerHeight


    const worker = new Worker("worker.js");
    worker.postMessage({ canvas: canvasWorker, windowW: w, windowH: h, snowflakes: numberOfSnowflakesPerCanvas}, [canvasWorker]);

}
