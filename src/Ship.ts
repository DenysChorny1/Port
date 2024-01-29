import { shipTypes, coordinates, size } from './types';
import * as PIXI from 'pixi.js';
import { SHIP_SIZE, SHIP_COLORS, LOADING_TIME, SHIP_SPEED } from './constants';
import * as TWEEN from '@tweenjs/tween.js';
import Logger from './Logger';

type UnknownProps = Record<string, any>;

// const tween = new TWEEN.Tween(elementPosition)
//   .to({ x: fieldSize.width - elementSize.width, y: fieldSize.height - elementSize.height }, 3000)
//   //.easing(TWEEN.Easing.Quintic.Out)
//   .onUpdate(() => {
//     updateElementPosition();
//   });

// function updateElementPosition() {
//   element.position.set(elementPosition.x, elementPosition.y);
// }

export default class Ship {
    shipType: shipTypes;
    private shiplocation: coordinates;
    private shipSize: size = SHIP_SIZE;
    private tweenElement: TWEEN.Tween<UnknownProps> | null = null;
    private element: PIXI.Graphics = new PIXI.Graphics();
    isShipLoaded: boolean = true;
    isMoveing: boolean = false;
    ID: number;

    constructor(shipType: shipTypes, shiplocation: coordinates = { x: 1, y: 1 }, ID: number = 1) {
        this.shipType = shipType;
        this.shiplocation = { x: shiplocation.x, y: shiplocation.y };
        this.ID = ID;

        if (shipType == 'import') {
            this.isShipLoaded = true;
        } else {
            this.isShipLoaded = false;
        }
        this.drow();
    }

    private drow() {
            this.element.clear();
        if (this.isShipLoaded) {
            this.element.beginFill(SHIP_COLORS[this.shipType]);
            this.element.drawRect(0, 0, this.shipSize.width, this.shipSize.height);
            this.element.endFill();
        } else {
            this.element.lineStyle(3, SHIP_COLORS[this.shipType]);
            this.element.drawRect(0, 0, this.shipSize.width, this.shipSize.height);
        }

        const text = new PIXI.Text(`${this.ID}`, { fill: 0xFFFFFF, fontSize: 12 });
        text.position.set(this.shipSize.width / 2, this.shipSize.height / 2);
        text.anchor.set(0.5);
        this.element.addChild(text);

        this.element.position.set(this.shiplocation.x, this.shiplocation.y);
    }

    getElement() {
        return this.element;
    }

    private updateElementPosition(udpatedValues: coordinates) {
        this.element.position.set(udpatedValues.x, udpatedValues.y);
    }

    private getTrevelTime(destination: coordinates): number { 
        const deltaX = destination.x - this.shiplocation.x;
        const deltaY = destination.y - this.shiplocation.y;
      
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
        return distance / SHIP_SPEED;
    }

    setLocation(location: coordinates) {
        this.shiplocation.x = location.x;
        this.shiplocation.y = location.y;
    }

    moveTo(destination: coordinates, callback?: () => void | {}) {
        this.isMoveing = true;
        if (this.tweenElement) {
            this.tweenElement.stop();
        }

        this.tweenElement = new TWEEN.Tween(this.shiplocation);
        this.tweenElement
            .to(destination, this.getTrevelTime(destination))
            .onUpdate((realCoordinates) => {     
                    this.updateElementPosition(realCoordinates as coordinates);
                    this.setLocation(realCoordinates as coordinates);
            })
            .onComplete(() => {
                this.isMoveing = false;
                this.updateElementPosition(destination);
                if (callback) {
                    callback.call(this);
                }
            })
            .start();

        function animate() {
            requestAnimationFrame(animate);
            TWEEN.update();
        }
        animate();
    }

    getLocataion(): coordinates {
        return this.shiplocation;
    }

    portShipProcess(callback: () => void) {
        setTimeout(() => {
            if (this.shipType === 'export') {
                this.isShipLoaded = true;
            } else {
                this.isShipLoaded = false;
            }
            this.drow();
            callback();
        }, LOADING_TIME);
    }

    delete() {
        this.element.removeFromParent();
    }

}


