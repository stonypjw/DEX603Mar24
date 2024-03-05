import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/Contact.Name';
import TITLE_FIELD from '@salesforce/schema/Contact.Title';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';

export default class GetRecordForm extends LightningElement {

    @api recordId;

    @wire(getRecord, { recordId: '$recordId',
                        fields: [NAME_FIELD, TITLE_FIELD, PHONE_FIELD, EMAIL_FIELD]})
    contact;

    // @wire(getRecord, { recordId: '$recordId' , fields: [NAME_FIELD, TITLE_FIELD, PHONE_FIELD, EMAIL_FIELD]}) 
    // wiredContact({data, error}){
    //     if (data) {
    //         this.contact = data;
    //         this.error = undefined;
    //         console.log(this.contact);
    //     }

    //     if (error) {
    //         this.contact = undefined;
    //         this.error = error;
    //         console.error(this.error);
    //     }
    // };


}