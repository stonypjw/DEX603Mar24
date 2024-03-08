import { LightningElement, wire } from 'lwc';
import getTopAccounts from '@salesforce/apex/AccountController.getTopAccounts';
import RecordModal from 'c/recordModal';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import AccountMC from '@salesforce/messageChannel/AccountMessageChannel__c';
import { publish, MessageContext } from 'lightning/messageService';

export default class AcctList extends LightningElement {

    records;                // propety to hold the account records returned from the wire service
    selectedId;
    selectedName;

    // use the wire service to create the MessageContext object required by the publish method
    @wire(MessageContext)
    messageContext;

    // wire up the getTopAccounts and return the results into a method
    @wire(getTopAccounts)
    wiredAccounts({data, error}) {
        // check if data was returned
        if (data) {
            this.records = data;
            // publish to the message channel when records first load
            this.selectedId = this.records[0].Id;
            this.selectedName = this.records[0].Name;
            this.sendMessageService(this.selectedId, this.selectedName);
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

    // create a method to handle the selected event from acct card
    handleSelection(event) {
        this.selectedId = event.detail.prop1;
        this.selectedName = event.detail.prop2;
        console.log('acctList: event received with: ' + this.selectedId + ' ' + this.selectedName);
        // invoke method to publish to the message channel
        this.sendMessageService(this.selectedId, this.selectedName);
    }

    // create a method to publish the account ID and Name to the message channel
    sendMessageService(accountId, accountName) {
        // invoke the publish method to publish the account info to the message channel
        publish(this.messageContext, AccountMC, { recordId: accountId, accountName: accountName });
        console.log('acctList: Published a message with : ' + accountId + ' ' + accountName);
    }
}