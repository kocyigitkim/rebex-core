import moment from "moment";
import { mergeDeep } from "../utils";

export class DataFormat {
    constructor() { }
    format(value) {
        return value;
    }
}
export class NumberFormat extends DataFormat {
    constructor() {
        super();
        this.decimalSeparator = ".";
        this.thousandsSeparator = ",";
        this.decimalPlaces = 2;
    }
    format(value) {
        if (value === null || value === undefined) {
            return "";
        }
        if (isNaN(value)) {
            return value;
        }
        let isNegative = value < 0;
        let result = value.toFixed(this.decimalPlaces);
        if (this.thousandsSeparator) {
            result = result.replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandsSeparator);
        }
        if (this.decimalSeparator) {
            result = result.replace(".", this.decimalSeparator);
        }
        if (isNegative) {
            result = "-" + result;
        }
        return result;
    }
}
export class DateFormat extends DataFormat {
    constructor() {
        super();
        this.fmt = "YYYY-MM-DD HH:mm";
    }
    format(value) {
        if (value === null || value === undefined) {
            return "";
        }
        return moment(value).format(this.fmt);
    }
}
export class DataFormatRegistry {
    static register(name, format) {
        if (!DataFormatRegistry.formats) DataFormatRegistry.formats = {};
        DataFormatRegistry.formats[name] = format;
    }
    static get(name) {
        return {
            create: (options) => {
                return new (DataFormatRegistry.formats[name])(mergeDeep({}, options || {}));
            }
        };
    }
}

DataFormatRegistry.register("number", NumberFormat);
DataFormatRegistry.register("date", DateFormat);
