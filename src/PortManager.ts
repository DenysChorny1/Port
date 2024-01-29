import Port from "./Port";
import Queue from "./ShipQueue";
import Dock from "./Dock";
import Ship from "./Ship";
import { shipTypes, coordinates, shipDockPareType } from "./types";
import * as PIXI from 'pixi.js';
import ShipQueue from "./ShipQueue";

export default class PortManager {
    
    importQueue: ShipQueue;
    exportQueue: ShipQueue;
    port: Port;
    onShipLeavePort: (ship?: Ship) => void = () => {};

    constructor(importQueue: coordinates, exportQueue: coordinates, app: PIXI.Application<HTMLCanvasElement>) {
        
        this.importQueue = new ShipQueue(importQueue, 'import');
        this.exportQueue = new ShipQueue(exportQueue, 'export');
        this.port = new Port(app);
    }

    onShipAvailable(ship: Ship) {
        if ( ship.shipType == 'import' ) {
            this.importQueue.addEletement(ship, () => {
                this.port.addToTheGatesQueue(this.importQueue);
            });
        } else {
            this.exportQueue.addEletement(ship, () => {
                this.port.addToTheGatesQueue(this.exportQueue);
            });
        }
    };

    processPort(dock: Dock, queue: ShipQueue): void {
  
        const ship = queue.getElement();
        if (!ship) {
            return;
        }
        queue.rebuildQueue();
        this.port.gatesBusy = true;
        this.port.addShip(ship, dock);
    }

    moveShipOut(shipDockpPare: shipDockPareType) {
        const ship = shipDockpPare.ship;
        const dock = shipDockpPare.dock;
        this.port.gatesBusy = true;
        const shipLocation = ship.getLocataion();
        const pass = [
            {x: 150, y: shipLocation.y},
            {x: 150, y: 385},
            {x: 220, y: 385}, 
            {x: 800, y: 385}, 
        ];

        ship.moveTo(pass[0], () => {
                ship.moveTo(pass[1], () => {
                    ship.moveTo(pass[2], () => {
                        this.port.gatesBusy = false;
                        this.port.ships.splice(this.port.ships.indexOf(ship), 1);       
                        dock.isBusy = false;
                        ship.moveTo(pass[3], () => { this.onShipLeavePort(ship) });
                    })
                })
            })

    }

    manage() {
        setInterval( () => {
            if (!this.port.gatesBusy && this.port.gatesQueue.length) {
                    for(let i = 0; i < this.port.gatesQueue.length; i++) {
                        const el = this.port.gatesQueue[i];
                        if (el instanceof ShipQueue) {
                            if (this.port.ships.length < 4) {
                                if (el.type === 'import') {
                                    const dock = this.port.getUnloadedDock();
                                    if (dock) {
                                        this.processPort(dock, el);
                                        this.port.gatesQueue.splice(i, 1);
                                        break;
                                    }
                                } else {
                                    const dock = this.port.getLoadedDock();
                                    if (dock) {
                                        this.processPort(dock, el);
                                        this.port.gatesQueue.splice(i, 1);
                                        break;
                                    }
                                }
                            }
                        } else {
                            this.port.gatesQueue.splice(i, 1);
                            this.moveShipOut(el);
                            break;
                        }
                    }
                }
        }, 200)
    }

    addOnShipLeavePort(func: (ship?:Ship)=>void): void {
        this.onShipLeavePort = func;
    }
}