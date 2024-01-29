import Ship from "./Ship";
import { shipTypes, coordinates } from './types';
import { FIELD_SIZE, IMPORT_QUEUE, SHIP_SIZE, PORT_QUEUE_BOOFER, SHIP_CREATING_INTERVAL } from './constants';
import * as PIXI from 'pixi.js';

export default class ShipManage {

    private ships: Ship[] = [];
    private interval: number = SHIP_CREATING_INTERVAL;
    private pixiApp: PIXI.Application<HTMLCanvasElement>;
    private shipCount: number = 0;

    portTransaction: ((ship: Ship) => void) | undefined = undefined; // TODO
 
    constructor(countOfShips: number = 2, app: PIXI.Application<HTMLCanvasElement>) {
        this.pixiApp = app;
    }

    manage() {
        setInterval(() => {
            this.createShip();
        }, this.interval);
    }

    createShip(type?: shipTypes): Ship {
        let shipType: shipTypes;
        const mathRandonm = Math.random();
        const shipLocation: coordinates = { x: (FIELD_SIZE.width - SHIP_SIZE.width), y: (FIELD_SIZE.height - SHIP_SIZE.height) * mathRandonm};
        if (!type) {
            if ( mathRandonm <= 0.5) {
                shipType = 'import';
            } else {
                shipType = 'export'
            }
        } else {
            shipType = type;
        }

        const newShip = new Ship(shipType, shipLocation, this.counter());
        const shipDestination: coordinates = {x: PORT_QUEUE_BOOFER.IMPORT.x,
            y: newShip.shipType == 'export' ? PORT_QUEUE_BOOFER.IMPORT.y: PORT_QUEUE_BOOFER.EXPORT.y};
        newShip.moveTo(shipDestination, () => {
            if (this.portTransaction) {
                this.portTransaction(newShip);
            };
        });
        this.ships.push(newShip);
        this.pixiApp.stage.addChild(newShip.getElement())
        return newShip;
    }

    addPortFunciton(func: (el: Ship) => void) {
        this.portTransaction = func;
    }

    onShipLeavePort(ship?: Ship) {
        if(!ship) {
            return;
        }
        const shipIndex: number = this.ships.indexOf(ship);
        ship.delete();
        if (shipIndex +1) {
            this.ships.splice(shipIndex, 1);
        }    
    }

    counter() {
        return this.shipCount += 1;
    }
}