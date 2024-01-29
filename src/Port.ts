import { coordinates, shipDockPareType } from "./types";
import { DOCK_SIZE, PORT_SIZE_LOCATION } from "./constants";
import Dock from "./Dock";
import Ship from "./Ship";
import * as PIXI from 'pixi.js';
import ShipQueue from "./ShipQueue";

export default class Port {
    docks: Dock[] = [];
    ships: Ship[] = [];
    gatesQueue: (ShipQueue | shipDockPareType)[] = [];
    gatesBusy: boolean = false
    private pixiApp: PIXI.Application<HTMLCanvasElement>;
  
    

    constructor(app: PIXI.Application<HTMLCanvasElement>) {
        this.pixiApp = app;
        this.drow();
        for (let i: number = 0; i < 4; i++ ) {
            const dock = new Dock({
                x: PORT_SIZE_LOCATION.portCoordinate.x + 10, 
                y: PORT_SIZE_LOCATION.portCoordinate.y + 5 + (DOCK_SIZE.height + 5) * i + 5 });
            this.pixiApp.stage.addChild(dock.getElement());
            this.docks.push(dock);
        }
    }

    getLoadedDock() {
        return  this.docks.find( (dock) => {
            return dock.isLoaded && !dock.isBusy;
        });
    }

    getUnloadedDock() {
        return  this.docks.find( (dock) => {
            return !dock.isLoaded && !dock.isBusy;
        });
    }

    drow() {
        const graphics = new PIXI.Graphics();

        graphics.beginFill(0x00ff00);
        graphics.drawRect(
            PORT_SIZE_LOCATION.portCoordinate.x, 
            PORT_SIZE_LOCATION.portCoordinate.y, 
            PORT_SIZE_LOCATION.cThickness, 
            PORT_SIZE_LOCATION.cHeight);
        graphics.endFill();
        
        graphics.beginFill(0x00ff00);
        graphics.drawRect(
            PORT_SIZE_LOCATION.portCoordinate.x, 
            PORT_SIZE_LOCATION.portCoordinate.y, 
            PORT_SIZE_LOCATION.cWidth, 
            PORT_SIZE_LOCATION.cThickness);
        graphics.endFill();
        
        graphics.beginFill(0x00ff00);
        graphics.drawRect(
            PORT_SIZE_LOCATION.portCoordinate.x, 
            PORT_SIZE_LOCATION.portCoordinate.y + PORT_SIZE_LOCATION.cHeight - PORT_SIZE_LOCATION.cThickness, 
            PORT_SIZE_LOCATION.cWidth, 
            PORT_SIZE_LOCATION.cThickness);
        graphics.endFill();


        graphics.beginFill(0x00ff00);
        graphics.drawRect(
            PORT_SIZE_LOCATION.portCoordinate.x + PORT_SIZE_LOCATION.cWidth,
            PORT_SIZE_LOCATION.portCoordinate.y, 
            PORT_SIZE_LOCATION.cThickness, 
            PORT_SIZE_LOCATION.cPartSicnes);
        graphics.endFill();

        graphics.beginFill(0x00ff00);
        graphics.drawRect(
            PORT_SIZE_LOCATION.portCoordinate.x + PORT_SIZE_LOCATION.cWidth, 
            PORT_SIZE_LOCATION.portCoordinate.y + PORT_SIZE_LOCATION.cHeight - PORT_SIZE_LOCATION.cPartSicnes, 
            PORT_SIZE_LOCATION.cThickness, 
            PORT_SIZE_LOCATION.cPartSicnes);
        graphics.endFill();
        this.pixiApp.stage.addChild(graphics);
    }

    addShip(ship: Ship, dock: Dock) {

        this.ships.push(ship);
        dock.isBusy = true;
        const roadMap: coordinates[] = dock.getRoadMap();
        ship.moveTo(roadMap[0], () => {
                ship.moveTo(roadMap[1], () => {
                    ship.moveTo(roadMap[2], () => {
                        ship.moveTo(roadMap[3], () => {
                                this.gatesBusy = false;
                                ship.portShipProcess(() => {
                                    dock.processShip();
                                    this.gatesQueue.push({ship, dock});
                                    console.log('on Ship unload  - ', this.gatesQueue, this.gatesQueue.length)
                                });
                        })
                    })
                })
            })
        
    }

    addToTheGatesQueue(queue: ShipQueue) {
        if (this.gatesQueue.indexOf(queue)+1) {
            return;
        }

        this.gatesQueue.push(queue);
    }


}