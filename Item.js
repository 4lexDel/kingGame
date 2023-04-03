class Item {
    static items = [];

    static currentID = 0;

    constructor(name, x, y, size = 45) {
        this.id = Item.currentID;

        Item.currentID++;

        this.name = name;

        this.x = x;
        this.y = y;

        this.size = size;

        this.frameCount = 0;

        Item.addItem(this);
    }

    static addItem(item) {
        Item.items.push(item);
    }

    static removeItemByID(id) {
        Item.items = Item.items.filter((item) => {
            if (item.id != id) return item;
        });
    }

    // static getItemByID(socketID) {
    //     let player = this.items.find((player) => {
    //         if (player.socketID == socketID) return player;
    //     });

    //     return player;
    // }
}


module.exports = { Item }