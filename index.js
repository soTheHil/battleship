const Ship = (length) => {

    let hits = 0
    let sunk = false

    const hit = () => {
        hits += 1
        if (hits == length) sunk = true
    }
    const isSunk = () => sunk

    const getLength = () => length

    let location = []
    
    const getLocation = () => location

    return {hit, isSunk, getLength, location}
}

const Gameboard = () => {
    const fleetMap = new Map()

    let ships = {
        "Destroyer": Ship(5),
        "Submarine": Ship(4),
        "Boat": Ship(1),
        "Battleship": Ship(3),
        "Carrier": Ship(4)
    }
    const isCodFree = (x,y) => {
        if (x > 9 || y > 9) return false
        return (fleetMap.get(`${x},${y}`) === undefined) 
    }

    const place = (name, x, y, axis) => {
        let ship = ships[name]
        ship.location = []
        for (let i = 0; i < ship.getLength(); i++) {
            if (isCodFree(x + i,y) && axis === "X") {
                ship.location.push({x: x + i, y})
            } 
            else if(isCodFree(x, y + i) && axis === "Y") {
                ship.location.push({x, y: y + i})
            }
            else {
                ship.location = []
                return "Failed"
            }
        }
        ship.location.forEach(co => fleetMap.set(`${co.x},${co.y}`, co))
        return "Success" //ship.location
    }

    const receiveAttack = (x, y) => {
        let attacked = false

        for (let name in ships) {
            let ship = ships[name]
            for (let ord of ship.location) {
                if (x == ord.x && y == ord.y ) {
                    attacked = true
                    ship.hit()
                    return attacked
                }
            }
        }
        return attacked
    }

    const fleetSunk = () => {
        for (let name in ships) {
            if (!ships[name].isSunk()) return false
        }
        return true
    }
    return {place, receiveAttack, fleetSunk, ships, isCodFree}
}



  
  export { Ship, Gameboard}