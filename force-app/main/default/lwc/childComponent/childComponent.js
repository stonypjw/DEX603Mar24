import { LightningElement, api } from 'lwc';

export default class ChildComponent extends LightningElement {

    // define two public properties
    @api childName;
    @api age;

    // private property to hold data from the input
    childSpeak;

    // create a method to dispatch a custom event to the parent
    respondToParent(event) {
        // create a custom event
        this.childSpeak = event.detail.value;
        const myEvent = new CustomEvent('crying', { detail: this.childSpeak });

        // dispatch my custom event
        this.dispatchEvent(myEvent);
    }

    // constructor lifecycle method
    constructor() {
        super();
        console.log('Child Component:  Constructor fired...');
    }

    // connected and disconnected callback lifecycle methods
    connectedCallback() {
        console.log('Child Component:  connectedCallback fired...');
    }

    disconnectedCallback() {
        console.log('Child Component:  disconnectedCallback fired...');
    }

    // rendered callback lifecycle method
    renderedCallback() {
        console.log('Child Component:  renderedCallback fired...');
    }

}