import { LightningElement, api } from 'lwc';

export default class OppRecordEditForm extends LightningElement {

     editMode = false;

     @api recordId;
     @api objectApiName;

     toggleMode(){
        this.editMode = !this.editMode;
     }

}