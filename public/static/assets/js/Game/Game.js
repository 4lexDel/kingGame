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
        this.FPS = 60;
        this.prevTick = 0;
        this.draw();
        /*--------------------------------*/

        this.mousePressed = false;

        this.mouseX = 0;
        this.mouseY = 0;

        this.players = [];
        this.player = null; //Own player

        this.bullets = [];

        this.gridSpacing = 60;

        this.fontSize = 20;
    }

    initMap() {

    }

    initEvent() {
        // this.canvas.onmouseup = (e) => {
        //     this.mouseAction(e);
        //     this.mousePressed = false;
        // }

        // this.canvas.onmousedown = (e) => {
        //     console.log("1");
        //     this.mousePressed = true;
        // }

        console.log(this.canvas);

        this.canvas.onmousedown = (e) => {
            this.shotBullet(e);
            //this.mousePressed = true;
        };
        this.canvas.onmouseup = (e) => {

            this.mousePressed = false;
        };
        this.canvas.onmousemove = (e) => { this.refreshMouseCoord(e); };

        this.canvas.addEventListener('touchstart', (e) => {
            this.refreshTouchCoord(e);
            this.mousePressed = true;
        }, false);

        this.canvas.addEventListener('touchmove', (e) => {
            this.refreshTouchCoord(e);
        }, false);

        this.canvas.addEventListener('touchend', (e) => {
            this.refreshTouchCoord(e);
            this.mousePressed = false;
        }, false);

        window.onresize = (e) => {
            this.resize();
        };

        /*document.addEventListener("keydown", (e) => { //KEYBOARD EVENT
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
        });*/
    }

    // mouseAction(e) {
    //     let coord = MouseControl.getMousePos(this.canvas, e);
    //     //let val = e.which == 1 ? 1 : 0;
    //     //this.map.setTileID(coord.x, coord.y, val);
    //     this.manageCoords(coord.x, coord.y);
    // }

    shotBullet(e) {
        let coord = MouseControl.getMousePos(this.canvas, e);

        let bx = coord.x;
        let by = coord.y;

        let deltaX = bx - this.canvas.width / 2;
        let deltaY = by - this.canvas.height / 2; //Vu que on est toujours au centre

        // let length = Math.sqrt(deltaX ** 2 + deltaY ** 2);
        let alpha = Math.atan(deltaY / deltaX);

        if (deltaX < 0) alpha = Math.PI + Math.atan(deltaY / deltaX);
        else alpha = Math.atan(deltaY / deltaX);

        // if (posX < cibleX) {
        //     a = atan((posY - cibleY) / (posX - cibleX)); //Calcule angle par raport a la souris
        // }
        // if (posX > cibleX) {
        //     a = PI + atan((cibleY - posY) / (cibleX - posX));
        // }

        // console.log(`dx ${deltaX} dy ${deltaY}`);
        // console.log(`length ${length}`);
        // console.log(this.player);

        socket.emit("shot", this.player.x, this.player.y, alpha);
    }

    refreshTouchCoord(e) {
        let coord = TouchControl.getTouchPos(this.canvas, e);

        this.mouseX = coord.x;
        this.mouseY = coord.y;
    }

    refreshMouseCoord(e) {
        let coord = MouseControl.getMousePos(this.canvas, e);

        this.mouseX = coord.x;
        this.mouseY = coord.y;
    }

    manageCoords() {
        if (this.player != null) {
            // console.log(this.mouseX + " | " + this.mouseY);
            let deltaX = this.mouseX - this.canvas.width / 2;
            let deltaY = this.mouseY - this.canvas.height / 2; //Vu que on est toujours au centre

            let length = Math.sqrt(deltaX ** 2 + deltaY ** 2);

            if (length > 5) socket.emit("move", 5 * deltaX / length, 5 * deltaY / length);
        }
    }

    draw() {
        // var posX = event.clientX;
        // var posY = event.clientY;

        // console.log(`x : ${posX} y : ${posY}`);
        /*------------------------------FPS-----------------------------*/
        window.requestAnimationFrame(() => this.draw());

        let now = Math.round(this.FPS * Date.now() / 1000);
        if (now == this.prevTick) return;
        this.prevTick = now;
        /*--------------------------------------------------------------*/

        //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.width);
        this.ctx.fillStyle = "rgb(210,210,210)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.players != null && this.players.length > 0) {
            this.displayMovingGrid();

            this.ctx.save();
            this.ctx.translate(this.canvas.width / 2 - this.player.x, this.canvas.height / 2 - this.player.y);

            this.displayPlayers();
            this.displayBullets();

            this.ctx.restore();

            this.displayCoords();
        }

        this.manageCoords();
    }

    displayMovingGrid() {
        let nbGridX = (this.canvas.width / this.gridSpacing) + 2;
        let nbGridY = (this.canvas.height / this.gridSpacing) + 2;

        let ox = -(this.player.x % this.gridSpacing) - this.gridSpacing;
        let oy = -(this.player.y % this.gridSpacing) - this.gridSpacing;

        this.ctx.save();
        this.ctx.translate(ox, oy);

        this.ctx.strokeStyle = "rgb(80,80,80)";
        this.ctx.lineWidth = 0.1;

        for (let x = 0; x < nbGridX; x++) {
            for (let y = 0; y < nbGridY; y++) {
                this.ctx.strokeRect(x * this.gridSpacing, y * this.gridSpacing, this.gridSpacing, this.gridSpacing);
            }
        }

        this.ctx.restore();
    }

    displayPlayers() {
        this.players.forEach(player => {
            this.ctx.fillStyle = player.color;
            this.ctx.beginPath();
            // console.log(player);
            this.ctx.ellipse(player.x, player.y, player.radius, player.radius, 0, 0, 2 * Math.PI);
            this.ctx.fill();

            this.ctx.fillStyle = "black";
            this.ctx.textAlign = "center";
            // this.ctx.textBaseline = 'middle';
            this.ctx.fillText(player.pseudo, player.x, player.y - player.radius - this.fontSize / 2);
        });
    }

    displayBullets() {
        this.bullets.forEach(bullet => {
            this.ctx.fillStyle = "black";
            this.ctx.beginPath();
            this.ctx.ellipse(bullet.x, bullet.y, bullet.radius, bullet.radius, 0, 0, 2 * Math.PI);
            this.ctx.fill();
        });
    }

    displayCoords() {
        this.ctx.font = 20 + "px serif";
        this.ctx.fillStyle = "black";
        // this.ctx.textAlign = "center";
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(`x = ${parseInt(this.player.x)} | y = ${parseInt(this.player.y)}`, this.fontSize, this.canvas.height - this.fontSize);
    }
}