import { LightningElement, wire } from 'lwc';
import getTopAccounts from '@salesforce/apex/AccountController.getTopAccounts';
import RecordModal from 'c/recordModal';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

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

  // create a method to create a new Account Record
  createAcct() {
    // use our RecordModal component
    RecordModal.open({
        size: 'small',
        objectApiName: 'Account',
        formMode: 'edit',
        layoutType: 'Full',
        headerLabel: 'Create New Account'
    })
        .then((result) => {
            if (result === 'modsuccess') {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Account Created',
                    message: 'Account created successfully!',
                    variant: 'success',
                    mode: 'dismissible'
                }));
            }
        });
}
}