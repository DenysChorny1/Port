import { size, shipTypes, coordinates } from './types';

const SHIP_CREATING_INTERVAL: number = 8000;
const SHIP_SIZE: size = { height: 20, width: 40 }
const SHIP_COLORS: Record<shipTypes, number> = { export: 0x00FF00, import: 0xFF0000 };
const FIELD_SIZE: size = { width: 800, height: 800 };
const DOCK_SIZE: size = { width: 30, height: 40 };
const EXPORT_QUEUE: coordinates = { x: 250, y: 350 };
const IMPORT_QUEUE: coordinates = { x: 250, y: 450 };
const LOADING_TIME: number = 2500; //5000
const SHIP_SPEED:number = 0.05;
const PORT_QUEUE_BOOFER = {
    IMPORT:  {
        x: 500,
        y: 450
    }, 
    EXPORT: {
        x: 500,
        y: 350
    }
}

const PORT_SIZE_LOCATION = {
    cWidth: 150,
    cHeight: 195,
    cThickness: 5,
    cPartSicnes: 75, 
    portCoordinate: {x: 50, y: 302 }
}

export {
    SHIP_SIZE, 
    SHIP_COLORS,
    FIELD_SIZE, 
    IMPORT_QUEUE, 
    EXPORT_QUEUE, 
    PORT_QUEUE_BOOFER, 
    SHIP_CREATING_INTERVAL, 
    DOCK_SIZE, 
    LOADING_TIME, 
    PORT_SIZE_LOCATION,
    SHIP_SPEED
}
