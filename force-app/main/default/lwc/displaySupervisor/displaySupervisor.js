import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import REPORTID_FIELD from '@salesforce/schema/Contact.ReportsToId';

export default class DisplaySupervisor extends LightningElement {
    @api recordId;

    @wire(getRecord, { recordId: '$recordId' ,
                        fields: [ REPORTID_FIELD ]})
    contact;

    get superId(){
        console.log('Contact return');
        console.log(this.contact.error);
        console.log(this.contact.data);
        let contactId = this.contact.data.fields.ReportsToId.value;
        return contactId;
    }
}