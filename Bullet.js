class Bullet {
    static bullets = [];

    static currentID = 0;

    constructor(senderID, x, y, dx, dy, ttl = 5000, radius = 10) {
        this.id = Bullet.currentID;
        Bullet.currentID++;

        this.senderID = senderID;

        this.dx = dx;
        this.dy = dy;

        this.x = x;
        this.y = y;

        this.radius = radius;

        this.ttl = ttl; //time to live

        Bullet.addBullet(this);

        this.startLife();
    }

    static addBullet(bullet) {
        Bullet.bullets.push(bullet);
    }

    static removeBulletByID(id) {
        Bullet.bullets = Bullet.bullets.filter((bullet) => {
            if (bullet.id != id) return bullet;
        });
    }

    static getBulletBySocketID(socketID) {
        let bullet = Bullet.bullets.find((bullet) => {
            if (bullet.socketID == socketID) return bullet;
        });

        return bullet;
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;
    }

    startLife() {
        setTimeout(() => {
            Bullet.removeBulletByID(this.id);
        }, this.ttl);
    }
}


module.exports = { Bullet }