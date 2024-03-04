import { LightningElement, api } from 'lwc';
import GenWattStyle from '@salesforce/resourceUrl/GenWattStyle';
import { loadStyle } from 'lightning/platformResourceLoader';

export default class HelloWorld extends LightningElement {

    @api firstName = 'World';
    showExt = false;
    showAlt = false;

    constructor() {
        super();
        loadStyle(this, GenWattStyle)
            .then(() => {console.log('Style sheet loaded')})
            .catch((error) => {console.error('Error occurred loading style sheet')});
    }

    connectedCallback() {
        if(this.firstName === "John") {this.showExt = true;}
        if(this.firstName === "Dagny") {this.showAlt = true;}
    }
}