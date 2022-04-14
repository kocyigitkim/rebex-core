import axios from 'axios';
import { EventEmitter } from 'events'
import { chooseIfNotUndefined, mergeDeep } from '../utils';

export class DataProvider {
    create(options) {
        return new DataSource(options);
    }
}

export class AxiosDataProvider extends DataProvider {
    constructor(options) {
        super();
        this.options = chooseIfNotUndefined(options, {});
    }
    create(options) {
        return new AxiosDataSource(mergeDeep(this.options, options));
    }
}

export class DataSource {
    constructor(options) {
        this.options = options;
        this.isChecked = false;
        this.isSuccess = false;
    }
    get success() {
        return this.isSuccess;
    }
    get checked() {
        return this.isChecked;
    }
    async retrieve() {
        return this.options.data;
    }
}

export class AxiosDataSource extends DataSource {
    constructor(options) {
        super(options);
        this.path = options.path;
        this.method = options.method;
        this.data = options.data;
        this.headers = options.headers;
    }
    async retrieve() {
        this.ischecked = true;
        var result = await axios({
            method: this.method,
            url: this.options.url + this.path,
            data: this.data,
            headers: this.headers
        }).then(r => {
            this.isSuccess = true;
            return r.data;
        }).catch(e => {
            console.error(e);
            this.isSuccess = false;
            return null;
        });
        this.data = result;
        return result;
    }
    get checked() {
        return Boolean(this.ischecked);
    }
    get success() {
        return Boolean(this.isSuccess);
    }
}