export class ItemMenu {
    private _name: string;
    private _callback: () => void;

    constructor(name: string, func: () => void) {
        this._name = name;
        this._callback = func;
    }

    get name() { 
        return this._name; 
    }
    get callback() {
        return this._callback; 
    }
}