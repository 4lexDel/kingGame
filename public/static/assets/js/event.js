// document.querySelector("#createRoom").addEventListener("click", () => {
//     initRoomEvent("create_room");
// }); //ACTION
document.querySelector("#display-content-info").addEventListener("click", () => {
    let content = document.querySelector(".content-info");
    let mode = content.style.display;

    // console.log(mode);
    if (mode != "block") content.style.display = "block";
    else content.style.display = "none";
});

document.querySelector("#joinGame").addEventListener("click", () => {
    initRoomEvent("join_game");
});

document.querySelector("#sendMessage").addEventListener("click", () => {
    let content = document.querySelector("#message").value;
    document.querySelector("#message").value = "";

    socket.emit("send_message", content)
});

function initRoomEvent(event) {
    let pseudo = document.querySelector("#pseudo").value;
    console.log(event + " => Pseudo : " + pseudo);
    socket.emit(event, pseudo);
}

socket.on("map_update", (players) => {
    // console.log(socket.id);
    // console.log(players);

    if (players != null) {
        canvasObject.players = players;

        canvasObject.player = players.find((p) => p.socketID == socket.id);
        // console.log(canvasObject.player);
    }
});

socket.on("players_list", (players) => {
    displayPlayerList(players)
});

function displayPlayerList(players) {
    let content = "<ul>";
    players.forEach(player => {
        content += '<li>' + player.pseudo + ' (' + player.status + ')' + '</li>';
    });
    content += "</ul>";
    document.querySelector(".player-content").innerHTML = content;
}

socket.on("text_message", (messages) => {
    displayMessages(messages);
});


function displayMessages(messages) {
    let element = document.querySelector("#message-content");
    element.innerHTML = "";

    messages.forEach(message => {
        let author = null;
        if (message.player.socketID == socket.id) author = "myMessage";
        else author = "otherMessage";

        let messageHTML = '<div class="message ' + author + '">' + message.player.pseudo + ' : ' + message.content + '</div>';

        element.innerHTML += messageHTML;

        element.scrollTop = element.scrollHeight;
    });
}

// document.querySelector("#display-content-info").addEventListener("click", () => {
//     let content = document.querySelector(".content-info");
//     let mode = content.style.display;

//     // console.log(mode);
//     if (mode != "block") content.style.display = "block";
//     else content.style.display = "none";
// });

// document.querySelectorAll(".leave-room").forEach((button) => button.addEventListener("click", () => {
//     // console.log("LEAVE");
//     socket.emit("leave_room");
// }));

// document.querySelector("#restartGame").addEventListener("click", () => {
//     socket.emit("restart_game");
// });



// socket.on("room_joined", (state, player, message) => {
//     if (player != null) {
//         displayRoomInformation(state, player.roomID);
//         playerInfo = player;
//     }
//     displayMessageInformation(state, message);
// });

// socket.on("room_created", (state, player, message) => {
//     if (player != null) {
//         displayRoomInformation(state, player.roomID);
//         playerInfo = player;
//     }
//     displayMessageInformation(state, message);
// });

// socket.on("room_left", () => {
//     resetAllInformations("Disconnected...");
//     canvasObject.mapPlayer.resetGrid();
// });

// socket.on("message", (data) => {
//     console.log("--------------------------------");
//     console.log("Message : " + data.message);
//     console.log("--------------------------------");
// });



// socket.on("grid_refresh", (grid) => {
//     if (grid != null) {
//         //console.log(playerInfo);
//         if (playerInfo != null) {
//             let gridMode = playerInfo.status == "Player2" ? true : false; //Reverse map ?

//             canvasObject.setPlayerMap(grid, gridMode);
//         }
//     }
// });

// socket.on("real_time_info", (message) => {
//     document.querySelector(".text-moving").innerHTML = message;
// });

// socket.on("end_game", () => {
//     // console.log("end");
//     document.querySelector("#endGameModal").style.display = "block";
// });


// /**------------------------------------------------------------------------------------------------------------------ */

// function displayRoomInformation(state, room) {
//     if (state == 1) {
//         document.querySelector(".status-content").innerHTML = '<span class="connected">Connected</span>';
//         document.querySelector(".room-content").innerHTML = '<span>' + room + '</span>';
//     } else if (state == -1) {
//         document.querySelector(".status-content").innerHTML = '<span class="disconnected">Disconnected</span>';
//         document.querySelector(".room-content").innerHTML = '<span>Undefined</span>';
//     }
// }

// function displayMessageInformation(state, message) { //dry
//     if (state == 1) {
//         document.querySelector(".info-content").innerHTML = '<span class="connected">' + message + '</span>';
//     } else if (state == -1) {
//         document.querySelector(".info-content").innerHTML = '<span class="disconnected">' + message + '</span>';
//     } else if (state == 0) {
//         document.querySelector(".info-content").innerHTML = '<span class="informal">' + message + '</span>';
//     }
// }



// function resetAllInformations(message) {
//     document.querySelector(".status-content").innerHTML = '<span class="disconnected">Disconnected</span>';
//     document.querySelector(".room-content").innerHTML = '<span>Undefined</span>';
//     document.querySelector(".player-content").innerHTML = '<span>Undefined</span>';
//     document.querySelector(".info-content").innerHTML = '<span class="informal">' + message + '</span>';
//     document.querySelector(".text-moving").innerHTML = "";
// }