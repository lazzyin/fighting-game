//=======================================
//=========FUNCTION COLISÃO==============
//=======================================
function rectangularCollision({
    rectangle1,
    rectangle2
}) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}



//====================================================
//===================VENCEDOR=========================
//====================================================



function determinateWinner({ player, enemy, timerId }) {
    clearTimeout(timerId)
    document.querySelector("#displayText").style.display = "flex";
//Empate   
    if (player.hp === enemy.hp ) {
        document.querySelector("#displayText").innerHTML = "Empate"
    }
//Vitoria player 1
    else if (player.hp > enemy.hp) {
        document.querySelector("#displayText").innerHTML = "Player 1 venceu!!!"
    }
//Vitoria player 2
    else  {
        document.querySelector("#displayText").innerHTML = "Player 2 venceu!!!"
        
    }
}


//====================================================
//=====================TIMER==========================
//====================================================
let timer = 60
let timerId
function decreaseTimer() {
    if (timer > 0) {
       timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector("#timer").innerHTML = timer
    }

    if (timer <= 0) {
        determinateWinner({ player, enemy, timerId });        
    }
}
