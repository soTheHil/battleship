import { Ship, Gameboard} from './index.js'

let shipColor = "rgb(63, 57, 57)"
let seaColor = "rgb(0, 225, 255)"
let axis = "X"
let pBoard =  Gameboard()
let cpuBoard = Gameboard()

const btnAxis = document.querySelector("button")

const changeAxis = () => {
    if (axis == "X") {
        axis = "Y"
        btnAxis.innerText = "Y-Axis"
    }
    else if (axis == "Y"){
        axis = "X"
        btnAxis.innerText = "X-Axis"
    }
}


btnAxis.addEventListener("click", changeAxis)

const CreateBoard = () => {
    const board = document.createElement("div")
    board.classList.add("board")

    for (let j = 0; j < 10; j++) {
        for (let i = 0; i < 10; i++) {
            let block = document.createElement("div")
            block.classList.add("block")
            block.setAttribute("x",i.toString())
            block.setAttribute("y",j.toString())
            board.appendChild(block)
        }
        //let br = document.createElement("br")
       // board.appendChild(br)
    }

    return board
}

const addCo = (event) => {
    let block = event.target
    let co = { 
               x:parseInt(block.getAttribute("x")),
               y:parseInt(block.getAttribute("y"))
             }
    return co
}

const fleet = ["Boat", "Submarine", "Destroyer", "Battleship", "Carrier"]
let shipIndex = 0
const message = document.querySelector("#message")
message.innerText = `Place Your ${fleet[shipIndex]}`
const placeShip = (event) => {
    let co = addCo(event)
    if (isNaN(co.x)) return
    let shipName = fleet[shipIndex]
    let length = pBoard.ships[shipName].getLength() - 1
    console.log(length)
   
    let placed =  pBoard.place(fleet[shipIndex], co.x, co.y, axis)
    console.log(pBoard.ships, placed)

    if (placed == "Success") {
        shipIndex += 1;
        if (shipIndex < fleet.length) 
        message.innerText = `Place Your ${fleet[shipIndex]}`
    }
    
    if (shipIndex >= fleet.length) {
        message.innerText = ""
        player.removeEventListener("click", placeShip)
        player.removeEventListener("mouseover", mouseover)
        player.removeEventListener("mouseout", mouseout)
        initCP()
        cp.addEventListener("click", attackCp)
        cp.classList.add("enemy")
        //showStandingShips()
    }
}

const mouseover = (event) => {
    if (event.target == player) return
    let target = event.target;
    let shipName = fleet[shipIndex]
    let length = pBoard.ships[shipName].getLength()
    let x = parseInt(target.getAttribute("x"))
    let y = parseInt(target.getAttribute("y"))
    let ships = []
    for (let i = 0; i < length; i++) {
        if (axis === "X" && (!pBoard.isCodFree(x+i, y))) return
        if (axis === "Y" && (!pBoard.isCodFree(x, y+i))) return
        let s 
        if (axis == "X") s = player.querySelector(`[x="${x+i}"][y="${y}"]`)
        else s = player.querySelector(`[x="${x}"][y="${y+i}"]`)
        if (s === null) return
        ships.push(s)
        //s.style.backgroundColor = "red"
    }
    ships.forEach(s => s.style.backgroundColor = shipColor)
}

const mouseout = (event) => {
    if (event.target == player) return
    let target = event.target
    let shipName = fleet[shipIndex]
    let length = pBoard.ships[shipName].getLength()
    let x = parseInt(target.getAttribute("x"))
    let y = parseInt(target.getAttribute("y"))
    let ships = []
    for (let i = 0; i < length; i++) {
        if (axis === "X" && (!pBoard.isCodFree(x+i, y))) return
        if (axis === "Y" && (!pBoard.isCodFree(x, y+i))) return
        let s 
        if (axis == "X") s = player.querySelector(`[x="${x+i}"][y="${y}"]`)
        else s = player.querySelector(`[x="${x}"][y="${y+i}"]`)
        if (s === null) return
        ships.push(s)
    }
    ships.forEach(ship => ship.style.backgroundColor = seaColor)
}

let player = CreateBoard()
player.addEventListener("click", placeShip)
player.addEventListener("mouseover", mouseover)
player.addEventListener("mouseout", mouseout)

let cp = CreateBoard()

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); 
    // The maximum is exclusive and the minimum is inclusive
}

const initCP = () => {
    let axis = "X"
    for (let name of fleet) {
        if (axis == "X") axis = "Y"
        else axis = "X"
       initCPRec(name, axis)
    }
    console.log(cpuBoard.ships)
}

const initCPRec = (name, axis) => {
    let x = getRandomInt(0, 10)
    let y = getRandomInt(0, 10)
    let placed = cpuBoard.place(name, x, y, axis)
    if (placed === "Failed") initCPRec(name, axis)
    //else showShip(name)
}

const showShip = (name) => {
    let location = cpuBoard.ships[name].location
    for (let co of location) {
        let ship = cp.querySelector(`[x="${co.x}"][y="${co.y}"]`)
        ship.style.backgroundColor = shipColor
    }
}


const attackCp = (event) => {
    let co = addCo(event)
    if (isNaN(co.x)) return
    let target = event.target
   // console.log(target)
    if (target.className == "block hit") return
    let x = parseInt(target.getAttribute("x"))
    let y = parseInt(target.getAttribute("y"))
    let result = cpuBoard.receiveAttack(x, y)
    target.classList.add("hit")
    console.log({x,y}, target)
    if (result) {
        target.innerHTML = '<img src ="shot.svg"> </img>'
        target.style.backgroundColor = "red"
    }
    else {
        target.innerHTML = '<img src ="dot.svg"> </img>'
        //target.style.backgroundColor = "green"
    }

    if (cpuBoard.fleetSunk()) {
        message.innerText = "You Won"
        console.log("You won. Game closed")
        cp.removeEventListener("click", attackCp)
        return
    }
    attackPlayer()
}

//show ships which have not been sunk
const showStandingShips = () => {
    let fleet = cpuBoard.ships
    for (let name in fleet) {
        let ship = fleet[name]
        if (!ship.isSunk()) {
            for (let co of ship.location){
                let block = cp.querySelector(`[x="${co.x}"][y="${co.y}"]`)
                block.style.backgroundColor = "green"
            }
        }
    }
}

const playerSea = []

for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++){
        playerSea.push({x, y})
    }
}

const randomShot = () => {
    let index = getRandomInt(0, playerSea.length)
    let shot =  playerSea[index];
    playerSea.splice(index, 1)
    shot.type = "random"
    return shot
}

//for testing game
// const randomShot = () => {
//     let x = parseInt(prompt("X"))
//     let y =  parseInt(prompt("Y"));
//     for (let i = 0; i < playerSea.length; i++) {
//         let shot = playerSea[i]
//         if (shot.x == x && shot.y == y) {
//             playerSea.splice(i, 1)
//             return shot
//         }
//     }
// }

const isFree = (shot) => {
    for (let i = 0; i < playerSea.length; i++) {
        let co = playerSea[i]
        if (co.x == shot.x && co.y == shot.y) {
            playerSea.splice(i, 1)
            return true
        }
    }
    return false
}

const hitShots = []

let offIndex = 0

const offset = [
    {d:'l', x:-1, y:0},
    {d:'u', x:0, y:-1},
    {d:'r', x:1, y:0},
    {d:'d', x:0, y:1}
]

const lastRandomShot = () => {
    for (let i = 0; i < hitShots.length; i++) {
        if (hitShots[i].type == "random") return hitShots[i]
    }
    throw "random shot errror"
}

const reverse = () => {
    if (offIndex == 0) offIndex = 2
    else if(offIndex == 2) offIndex = 0
    else if (offIndex == 1) offIndex = 3
    else if (offIndex == 3) offIndex = 1
}

const reverseShot = () => {
    let preShot = lastRandomShot()
    reverse()
    let shot = {     //directedshot      
                 x: preShot.x + offset[offIndex].x, 
                 y: preShot.y + offset[offIndex].y
                } 
    shot.type = "directed"
    return shot
}

const smartShot = () => {
    let shot
    let preShot = hitShots[0]

    if (hitShots.length === 0) {
        shot = randomShot()
        shot.type = "random"
        return shot
    }
    //random shot
    if (preShot.type == "random") {
        if (preShot.result) {
            if (offIndex == 4) {
                offIndex = 0 
                return randomShot()  //randomshot
            }
            shot = {     //smartshot            
                x: preShot.x + offset[offIndex].x, 
                y: preShot.y + offset[offIndex].y
               }   
            shot.type = "smart"
            if (isFree(shot)) return shot
            else{
                offIndex += 1
                return smartShot()
            }
        }
        else if (!preShot.result) return randomShot()
    }
    //smartshot
    if (preShot.type == "smart"){
        if (!preShot.result) {
            offIndex += 1
            if (offIndex == 4) {
                offIndex = 0
               return randomShot()
            }
            preShot = lastRandomShot()
            shot = {     //smartshot            
                x: preShot.x + offset[offIndex].x, 
                y: preShot.y + offset[offIndex].y
               } 
            shot.type = "smart"  
            if (isFree(shot)) return shot 
            else {
                return smartShot()
            }
        }
        else if(preShot.result){
            shot = {     //directedshot      
                x: preShot.x + offset[offIndex].x, 
                y: preShot.y + offset[offIndex].y
               } 
            shot.type = "directed"
            if (isFree(shot)) return shot
            else {  //reverse Shot
                shot = reverseShot()
                if (isFree(shot)) return shot
                else {
                    offIndex = 0
                   return randomShot()
                }
            }
        }
    }                    //directed
     if (preShot.type == "directed") {
        if (preShot.result) {
            shot = {     //directedshot      
                x: preShot.x + offset[offIndex].x, 
                y: preShot.y + offset[offIndex].y
               } 
            shot.type = "directed"
            if (isFree(shot)) return shot
            else {
                preShot = lastRandomShot()
                reverse()
                shot = {     //directedshot      
                    x: preShot.x + offset[offIndex].x, 
                    y: preShot.y + offset[offIndex].y
                   } 
                   shot.type = "directed"
                if (isFree(shot)) return shot
                else {
                    offIndex = 0
                    return randomShot()
                }
            }
        }
        else if(!preShot.result) {
                shot = reverseShot()
                if (isFree(shot)) return shot
                else {
                    offIndex = 0
                    return randomShot()
                }
        }
    }

    
    
}


const attackPlayer = () => {
    let shot  = smartShot()
    console.log("CP Shot",shot)
    let result = pBoard.receiveAttack(shot.x, shot.y)
    shot.result = result
    hitShots.unshift(shot)
    //console.log(shot.x, result)
    let target = player.querySelector(`[x="${shot.x}"][y="${shot.y}"]`)
    if (result) {
        target.innerHTML = '<img src ="shot.svg"> </img>'
        target.style.backgroundColor = "red"
    }
    else {
        target.innerHTML = '<img src ="dot.svg"> </img>'
    }
    if (pBoard.fleetSunk()) {
        message.innerText = "Computer Won"
        console.log("Computer Won. Game closed")
        cp.removeEventListener("click", attackCp)
        showStandingShips()
        return
    }
}

let game = document.createElement("div")
let playerName = document.createElement("p")
playerName.innerText = "Player"
let comName = document.createElement("p")
comName.innerText = "Computer"
game.classList.add("game")
game.appendChild(playerName)
game.appendChild(comName)
game.appendChild(player)

game.appendChild(cp)
document.body.appendChild(game)

