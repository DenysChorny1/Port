import { shipTypes, coordinates, size } from './types';
import Ship from './Ship';
import { EXPORT_QUEUE, FIELD_SIZE, IMPORT_QUEUE, PORT_QUEUE_BOOFER } from './constants'
import * as TWEEN from '@tweenjs/tween.js';
import * as PIXI from 'pixi.js';
import ShipManager from './ShipManager';
import PortManager from './PortManager';

const app = new PIXI.Application<HTMLCanvasElement>({
    width: FIELD_SIZE.width,
    height: FIELD_SIZE.height,
    backgroundColor: 0xCCCCCC,
});

document.body.appendChild(app.view);

const field = new PIXI.Graphics();
field.beginFill(0x00aaff);
field.drawRect(0, 0, FIELD_SIZE.width, FIELD_SIZE.height);
field.endFill();
app.stage.addChild(field);

const shipManager = new ShipManager(4, app);
const portManager = new PortManager(EXPORT_QUEUE, IMPORT_QUEUE, app);
shipManager.addPortFunciton(portManager.onShipAvailable.bind(portManager));
portManager.addOnShipLeavePort(shipManager.onShipLeavePort.bind(shipManager));
shipManager.manage();
portManager.manage();
