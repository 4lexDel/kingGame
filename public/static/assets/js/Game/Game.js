class Game extends GameBase { //A renommer ?
    constructor(canvas, fullscreen = true) {
        super(canvas, fullscreen)

        this.init();
    }

    init() {
        this.resize();

        this.initMap();

        this.initEvent();

        /*---------Draw settings----------*/
        this.FPS = 15;
        this.prevTick = 0;
        this.draw();
        /*--------------------------------*/

        this.players = [];
    }

    initMap() {

    }

    initEvent() {
        this.canvas.onmouseup = (e) => {
            this.mouseAction(e);
        }

        window.onresize = (e) => {
            this.resize();
        };

        document.addEventListener("keydown", (e) => { //KEYBOARD EVENT
            //console.log(e.key);
            switch (e.key) {
                case "Enter":
                    break;
                case "ArrowUp":
                    socket.emit("move", 0, -5);
                    break;

                case "ArrowDown":
                    socket.emit("move", 0, 5);
                    break;

                case "ArrowRight":
                    socket.emit("move", 5, 0);
                    break;

                case "ArrowLeft":
                    socket.emit("move", -5, 0);
                    break;
            }
        });
    }

    mouseAction(e) {
        let coord = MouseControl.getMousePos(this.canvas, e);
        //let val = e.which == 1 ? 1 : 0;
        //this.map.setTileID(coord.x, coord.y, val);
        this.manageCoords(coord.x, coord.y);
    }

    manageCoords(x, y) {

    }

    draw() {
        /*------------------------------FPS-----------------------------*/
        window.requestAnimationFrame(() => this.draw());

        let now = Math.round(this.FPS * Date.now() / 1000);
        if (now == this.prevTick) return;
        this.prevTick = now;
        /*--------------------------------------------------------------*/

        //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.width);
        this.ctx.fillStyle = "rgb(210,210,210)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.displayPlayers();
    }

    displayPlayers() {
        if (this.players != null && this.players.length > 0) {
            this.players.forEach(player => {
                this.ctx.fillStyle = player.color;
                this.ctx.beginPath();
                this.ctx.ellipse(player.x, player.y, 50, 50, 0, 0, 2 * Math.PI);
                this.ctx.fill();
            });
        }
    }
}