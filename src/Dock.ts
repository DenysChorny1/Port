import { coordinates } from "./types";
import * as PIXI from 'pixi.js';
import { DOCK_SIZE, LOADING_TIME, SHIP_SIZE } from './constants';

export default class Dock {
    isLoaded: boolean = false;
    private element: PIXI.Graphics = new PIXI.Graphics();
    location: coordinates;
    parkLocation: coordinates;
    isBusy: boolean = false;

    constructor(location: coordinates) {
        this.element.position.set(location.x, location.y);
        this.drow();
        this.location = location;
        this.parkLocation = {
            x: location.x + DOCK_SIZE.width + 5,
            y: location.y + (DOCK_SIZE.height - SHIP_SIZE.height) / 2
        }
    }

    private drow() {
        this.element.clear();
        if (this.isLoaded) {
            this.element.beginFill(0xFFA500);
            this.element.drawRect(0, 0, DOCK_SIZE.width, DOCK_SIZE.height);
            this.element.endFill();
        } else {
            this.element.lineStyle(3, 0xFFA500);
            this.element.drawRect(0, 0, DOCK_SIZE.width, DOCK_SIZE.height);
        }
    }

    getElement() {
        return this.element;
    }

    processShip() {
        this.isLoaded  = this.isLoaded ? false : true;
        this.drow();
    }

    getRoadMap() {
        return [
            {x:200, y: 385},
            {x: 150, y: 385},
            {x: 150, y: this.parkLocation.y},
            this.parkLocation
        ]
    }

    getType() {
        return this.isLoaded ? 'export' : 'import';
    }
}