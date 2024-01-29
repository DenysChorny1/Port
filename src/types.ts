import Dock from "./Dock";
import Ship from "./Ship";

export type shipTypes = 'export' | 'import';

export type coordinates = {
    x: number;
    y: number;
};

export type size = {
    width: number;
    height: number;
};

export type shipDockPareType = {
    ship: Ship, 
    dock: Dock
}
