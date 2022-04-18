import { CheckBoxField, RadioListField, TextInput } from './TextInput';
import { DateInput } from './DateInput';
import { DateRangeInput } from './DateRangeInput';
import { DateTimeInput } from './DateTimeInput';
import { TimeInput} from './TimeInput';

export class FormElementRegistry {
    constructor() {
        this.renderers = {};
    }
    static register(name, renderer) {
        if (!FormElementRegistry.renderers) FormElementRegistry.renderers = {};
        FormElementRegistry.renderers[name] = renderer;
    }
    static registerMany(names, renderer) {
        for (var name of names) {
            FormElementRegistry.register(name, renderer);
        }
    }
    static get(name) {
        return this.renderers[name];
    }
}

FormElementRegistry.registerMany(['text', 'password', 'number', 'file', 'tel', 'email', 'url', 'hidden'], TextInput);
FormElementRegistry.register('date', DateInput);
FormElementRegistry.register('datetime', DateTimeInput);
FormElementRegistry.register('daterange', DateRangeInput);
FormElementRegistry.register('time', TimeInput);
FormElementRegistry.register('checkbox', CheckBoxField);
FormElementRegistry.register('radiolist', RadioListField);
