
const enabled = true;

export default class  Logger {
    
    static log(...params: any[]) {

        if (enabled) {
            console.log(...params);
        }
    }
}