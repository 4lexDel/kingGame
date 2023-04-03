class Spritesheet {

    constructor(image, nbX, nbY) {
        this.image = image;

        this.nbX = nbX;
        this.nbY = nbY;

        this.width = image.width;
        this.height = image.height;

        this.frameWidth = this.width / nbX;
        this.frameHeight = this.height / nbY;
    }

    drawFrame(ctx, frameX, frameY, x, y, dx = this.frameWidth, dy = this.frameHeight) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.image, frameX * this.frameWidth, frameY * this.frameHeight, this.frameWidth, this.frameHeight, x - dx / 2, y - dy / 2, dx, dy);
    }
}