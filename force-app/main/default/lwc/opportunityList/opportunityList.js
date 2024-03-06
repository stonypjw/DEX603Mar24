import { LightningElement, api, wire } from 'lwc';
import getOpportunities from '@salesforce/apex/OpportunityController.getOpportunities';

export default class OpportunityList extends LightningElement {

    @api recordId;
    results;

    recordsToDisplay = false;
    displayedOpps = [];
    allOpps = [];
    status = 'All';

    @wire(getOpportunities, { accountId: '$recordId' })
    wiredOpps(oppRecords){
        this.results = oppRecords;
        console.log(this.results);
        if(this.results.data){
            console.log('Data Returned');
            console.log(this.results.data);
            this.allOpps = this.results.data;
            this.updateList();
        }
        if(this.results.error){
            console.error('Error occured retrieving opp records');
            this.recordsToDisplay = false;
        }
    }

    updateList(){
        this.displayedOpps = [];

        // Will need to add filtering logic
        this.displayedOpps = this.allOpps;
        this.recordsToDisplay = true;
    }

}