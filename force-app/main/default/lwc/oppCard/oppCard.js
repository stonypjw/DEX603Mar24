import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class OppCard extends NavigationMixin(LightningElement) {

    //public properties to store opp field values
    @api name;
    @api amount;
    @api stage;
    @api closedate
    @api oppId;

    
    viewRecord(){
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.oppId,
                actionName: 'view'
            }
        });
    }

}