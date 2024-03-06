import { api } from 'lwc';
import LightningModal from 'lightning/modal';


export default class RecordModal extends LightningModal {

    @api recordId;
    @api objectApiName;
    @api formMode;
    @api layoutType;
    @api headerLabel;


}