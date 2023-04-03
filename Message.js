class Message {
    static messages = [];

    constructor(player, content) {
        this.player = player;
        this.content = content;
    }

    static addMessage(message) {
        this.messages.push(message);
    }
}


module.exports = { Message }