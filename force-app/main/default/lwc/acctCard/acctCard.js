import { LightningElement, api } from 'lwc';
import getContactList from '@salesforce/apex/ContactController.getContactList';
import creditCheckApi from '@salesforce/apexContinuation/CreditCheckContinuation.creditCheckApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AcctCard extends LightningElement {

    // public properties to hold the field values
    @api name;
    @api annualRevenue;
    @api phone;
    @api acctId;

    showContacts = false;
    loadingContacts = false;
    contacts;

    creditObj = {};

        // create a method to dispatch an event with selection information
        handleSelect() {
            // create a custom event, and pass the account Id and Name in the event detail
            const myEvent = new CustomEvent('selected', { detail: { 'prop1': this.acctId, 'prop2': this.name}});
            this.dispatchEvent(myEvent);
        }

        displayContacts(){
            if(this.showContacts){
                this.showContacts = false;
            }
            else {
                
                this.loadingContacts = true;

                getContactList({ accountId: this.acctId })
                    .then((data) => {
                        this.contacts = data;
                        this.showContacts = true;
                    })
                    .catch((error) => {
                        console.error('Error retrieving contacts...');
                        this.showContacts = false;
                    })
                    .finally(() => {
                        console.log('Contacts recieved and displaying...');
                        this.loadingContacts = false;
                    });

            }
        }

        checkCredit(){
            creditCheckApi({ accountId: this.acctId })
                .then( response => {
                    console.log(response);

                    this.creditObj = JSON.parse(response);
                    console.log(this.creditObj.Company_Name__c);

                    var toastMessage = 'Credit check approved for '+this.creditObj.Company_Name__c;

                    const toastEvent = new ShowToastEvent({
                        title: 'Credit Check Complete',
                        message: toastMessage,
                        variant: 'success',
                        mode: 'sticky'
                    });
                     this.dispatchEvent(toastEvent);
                })
                .catch( error => {
                    console.error(JSON.stringify(error));
                })
                .finally(() => {
                    console.log('Credit check all done finally');
                })
        }

 







}