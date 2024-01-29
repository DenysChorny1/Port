import { coordinates, shipTypes } from "./types";
import Ship from "./Ship";
import { SHIP_SIZE } from "./constants";
import AQueue from "./AQueue";
import Logger from "./Logger";

export default class ShipQueue extends AQueue<Ship> {
    start: coordinates;
    type: shipTypes;

    constructor(start: coordinates, type: shipTypes) {
        super();
        this.type = type;
        this.start = start;
    }

    addEletement(ship: Ship, callback?: () => void) {
        const destination: coordinates = { x: this.start.x + (SHIP_SIZE.width + 5) * this.queue.length + 5 , y: this.start.y }
        ship.moveTo(destination, callback);
        super.addEletement(ship);
    } 

    rebuildQueue() {

        for (let i = 0; i < this.queue.length; i++) {
            console.log('i ', i);
            let ship = this.queue[i];
            console.log('forEach ', ship.ID, { x: this.start.x + (SHIP_SIZE.width + 5) * i + 5 , y: this.start.y });
            ship.moveTo({ x: this.start.x + (SHIP_SIZE.width + 5) * i + 5 , y: this.start.y })
        }
    }
}