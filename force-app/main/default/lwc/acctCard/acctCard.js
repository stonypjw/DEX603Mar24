import { LightningElement, api } from 'lwc';


export default class AcctCard extends LightningElement {

    // public properties to hold the field values
    @api name;
    @api annualRevenue;
    @api phone;
    @api acctId;

        // create a method to dispatch an event with selection information
        handleSelect() {
            // create a custom event, and pass the account Id and Name in the event detail
            const myEvent = new CustomEvent('selected', { detail: { 'prop1': this.acctId, 'prop2': this.name}});
            this.dispatchEvent(myEvent);
        }

 







}