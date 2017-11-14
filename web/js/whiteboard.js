(function () {
    let canvas = document.querySelector('.whiteboard')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    let context = canvas.getContext('2d')
    let socket = io.connect()
    let drawing = false
    let current = {
        x: 0,
        y: 0
    }
    let chooseColor = document.querySelector('.chooseColor')
    let color = document.getElementById('color')
    chooseColor.addEventListener('click', () => {
        color.click()
    })
    color.addEventListener('change', () => {
        console.log(color.value)
    })


    canvas.addEventListener('mousedown', onMouseDown, false)
    canvas.addEventListener('mouseup', onMouseup, false)
    canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false)
    canvas.addEventListener('mouseout', onMouseup, false)

    socket.on('drawing', (data) => {
        let { x0, y0, x1, y1, color } = data
        drawLine(x0, y0, x1, y1, color, false)
    })

    function onMouseDown(e) {
        drawing = true
        current.x = e.clientX
        current.y = e.clientY
    }

    function onMouseMove(e) {
        if (!drawing) return
        drawLine(current.x, current.y, e.clientX, e.clientY, color.value, true)
        current.x = e.clientX
        current.y = e.clientY
    }

    function onMouseup(e) {
        if (!drawing) return
        drawing = false
        drawLine(current.x, current.y, e.clientX, e.clientY, color.value, true)
    }

    function drawLine(x0, y0, x1, y1, color, emit) {
        context.beginPath()
        context.moveTo(x0, y0)
        context.lineTo(x1, y1)
        context.strokeStyle = color
        context.lineWidth = 2
        context.stroke()
        context.closePath()

        if (emit) {
            socket.emit('draw', {
                x0,
                y0,
                x1,
                y1,
                color
            })
        }
    }

    // limit the number of events per second
    function throttle(callback, delay) {
        var previousCall = new Date().getTime();
        return function () {
            var time = new Date().getTime();

            if ((time - previousCall) >= delay) {
                previousCall = time;
                callback.apply(null, arguments);
            }
        };
    }
})()