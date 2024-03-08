import { LightningElement, wire } from 'lwc';
import getTopAccounts from '@salesforce/apex/AccountController.getTopAccounts';


export default class AcctList extends LightningElement {

    records;                // propety to hold the account records returned from the wire service


    // wire up the getTopAccounts and return the results into a method
    @wire(getTopAccounts)
    wiredAccounts({data, error}) {
        // check if data was returned
        if (data) {
            this.records = data;

       }

        // check if error was returned
        if (error) {
            console.error('Error occurred retrieving top accounts...');
        }
    }

}