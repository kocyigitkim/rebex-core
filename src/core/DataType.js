export class DataType {
    constructor(value) {
        this.value = value;
    }
    toString() {
        return this.value.toString();
    }
    parse(value){
        return this;
    }
    
}

export class DataTypeRegistry{
    static constructor(){
        this.types = {};
    }
    static register(name, type){
        this.types[name] = type;
    }
    static get(name){
        return this.types[name];
    }
}