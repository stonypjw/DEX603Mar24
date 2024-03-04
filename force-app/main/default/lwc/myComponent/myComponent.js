import { LightningElement } from 'lwc';

export default class MyComponent extends LightningElement {

    //boolean variable to determine if contacts display
    showContacts = false;

    //array hardcoded with some contacts
    contacts = [
        { Id: '111', Name: 'John', Title: 'VP' },
        { Id: '222', Name: 'Dagny', Title: 'SVP' },
        { Id: '333', Name: 'Henry', Title: 'President' }
    ];

    toggleView() {
        this.showContacts = !this.showContacts;
    }


}