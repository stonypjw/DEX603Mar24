import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import RecordModal from 'c/recordModal';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

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

    editOpp(){
        RecordModal.open({
            size: 'small',
            recordId: this.oppId,
            objectApiName: 'Opportunity',
            formMode: 'edit',
            layoutType: 'Compact',
            headerLabel: 'Edit Opportunity'
        })
        .then((result) => {
            console.log(result);

            if(result === 'modsuccess'){
                const myToast = new ShowToastEvent({
                    title: 'Opportunity Saved Succesfully',
                    message: 'The opportunity was updated successfully',
                    variant: 'success',
                    mode: 'dissmissible'
                });

                this.dispatchEvent(myToast);
            }
        })
    }
}