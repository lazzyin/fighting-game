
//=============================================
//===============GLOBAL========================
//=============================================

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.8

const background= new Sprite({
    position:{
        x: 0,
        y: 0
    },
    imageSrc:'./assets/background.png',
   
})
const shop= new Sprite({
    position:{
        x: 600,
        y: 187
    },
    imageSrc: './assets/shop.png',
    scale: 2.3,
    framesMax:6,
})

//==============================================
//========OBJ PERSONAGEM E OPONENTE=============
//==============================================
const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0,
    
    },
    imageSrc: './assets/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2,
    offset: {
        x: 80,
        y: 93
    },
    sprites: {
        idle: {
          imageSrc: './assets/samuraiMack/Idle.png',
          framesMax: 8
        },
        run: {
          imageSrc: './assets/samuraiMack/Run.png',
          framesMax: 8
        },
        jump: {
          imageSrc: './assets/samuraiMack/Jump.png',
          framesMax: 2
        },
        fall: {
          imageSrc: './assets/samuraiMack/Fall.png',
          framesMax: 2
        },
        attack1: {
          imageSrc: './assets/samuraiMack/Attack1.png',
          framesMax: 6
        },
        takeHit: {
          imageSrc: './assets/samuraiMack/Take Hit - white silhouette.png',
          framesMax: 4
        },
        death: {
          imageSrc: './img/samuraiMack/Death.png',
          framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: -85,
            y:-80
        },
        width: 100,
        height:50
    }
})

const enemy = new Fighter({
    position:{
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y:0
    },
    offset: {
        x: 50,
        y: 0,
    
    },
    color: 'blue',
    imageSrc:'./assets/kenji/Idle.png',
    framesMax: 4,
    scale: 2,
    offset: {
        x:80,
        y:105
    },
    sprites: {
        idle: {
            imageSrc: './assets/kenji/Idle.png',
            framesMax: 4,
        },
        run: {
            imageSrc: './assets/kenji/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './assets/kenji/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './assets/kenji/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './assets/kenji/Attack1.png',
            framesMax: 4,
        },
        takeHit:{
            imageSrc: './assets/kenji/Take hit.png',
            framesMax:3,
        },
        death: {
            imageSrc: './assets/kenji/Death.png',
            framesMax:7,
        },
    },
    attackBox: {
        offset: {
            x: 110,
            y:-58
        },
        width: 150,
        height:50
    }
})

//=============================================
//=============CHECAR TECLAS===================
//=============================================
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed:false
    
    },
    ArrowLeft: {
        pressed:false
    
    },
    ArrowUp: {
        pressed:false
    }
}

let lastKey


decreaseTimer();

//=========================================================
//================MOVIMENTAÇÃO=============================
//=========================================================
function animate() {
    //Carrega o mapa e os personagens
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    
    
    //Movimentos Player
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')       
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }
    
    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }
    
    //Movimentos oponente
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
     }else {
        enemy.switchSprite('idle')
    }

    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }

    //COLISÃO
    //Player atacando | Acerta o ataque
    if (rectangularCollision({
        rectangle1: player,
        rectangle2:enemy
    }) && player.isAttacking && player.framesCurrent === 4) {
        enemy.takeHit()
        player.isAttacking = false
        //enemy.hp -= 20;
        document.querySelector('#enemyHP').style.width = enemy.hp +"%";
    }

    //Player erra o ataque
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }

    //Oponente atacando | Acerta o ataque
    if (rectangularCollision({
        rectangle1: enemy,
        rectangle2:player
    }) && enemy.isAttacking && enemy.framesCurrent === 2) {
        player.takeHit()
        enemy.isAttacking = false
       // player.hp -= 20;
        document.querySelector('#playerHP').style.width = player.hp +"%";
    }
    //oponente erra o ataque
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }

    //Terminar jogo por 0 de hp

    if (enemy.hp <= 0 || player.hp <= 0) {
        determinateWinner({ player, enemy, timerId });
    }

}
animate()

//================================================
//================MAPA TECLADO====================
//================================================
window.addEventListener('keydown', (event) => {
    //PERSONAGEM
    if (!player.dead) {
        switch (event.key) {
            case 'd':
                keys.d.pressed = true;
                player.lastKey = 'd'
                break
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break
            case 'w':
                player.velocity.y = -20
                break
            case ' ':
                player.attack();
                break
        }
    }
    //OPONENTE
    
if (!enemy.dead) { 
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -20
            break
        case 'ArrowDown':
            enemy.attack();
            break
        
    }
}
})

window.addEventListener('keyup', (event) => {
    //PERSONAGEM
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'w':
            keys.w.pressed = false;
            break
    }

    //OPONENTE
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
            break            
    }
})