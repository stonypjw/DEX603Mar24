import { LightningElement } from 'lwc';

export default class ParentComponent extends LightningElement {

    childAge = 2;
    childTalking = 'Child';

    // private property to display a message on the parent component
    childSaid;

    addToAge(){
        this.childAge += 1;
    }

    // method to handle the event raised by the child component
    handleFit(evt) {
        this.childSaid = evt.detail.speak;
        this.childTalking = evt.detail.whoisit;
    }

    // constructor lifecycle method
    constructor() {
        super();
        console.log('Parent Component:  Constructor fired...');
    }

    // connected and disconnected callback lifecycle methods
    connectedCallback() {
        console.log('Parent Component:  connectedCallback fired...');
    }

    disconnectedCallback() {
        console.log('Parent Component:  disconnectedCallback fired...');
    }

    // rendered callback lifecycle method
    renderedCallback() {
        console.log('Parent Component:  renderedCallback fired...');
    }

    // error call back lifecycle method (only on Parent)
    errorCallback(error) {
        console.log('Parent Component: errorCallback fired...');
    }
}