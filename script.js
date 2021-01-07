for (let i = 2; i < 5; i++) {
    let newCanvas = document.createElement('canvas');
    newCanvas.width = window.innerWidth / i
    newCanvas.height = window.innerHeight / i
    newCanvas.id = `workerCanvas${i}`
    newCanvas.style.transform = 'scale('+(i+i-1)+')'

    document.body.appendChild(newCanvas);

    const canvasWorker = document.querySelector(`#workerCanvas${i}`).transferControlToOffscreen();
    const w = window.innerWidth
    const h = window.innerHeight


    const worker = new Worker("worker.js");
    worker.postMessage({ canvas: canvasWorker, windowW: w, windowH: h }, [canvasWorker]);

}
