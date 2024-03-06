import { LightningElement, api, wire, track } from 'lwc';
import getOpportunities from '@salesforce/apex/OpportunityController.getOpportunities';

export default class OpportunityList extends LightningElement {

    @api recordId;
    results;

    recordsToDisplay = false;
    displayedOpps = [];
    allOpps = [];
    status = 'All';

    @track comboOptions = [
        {value: 'All', label: 'All' },
        {value: 'Open', label: 'Open' },
        {value: 'Closed', label: 'Closed' },
        {value: 'ClosedWon', label: 'Closed Won' },
        {value: 'ClosedLost', label: 'Closed Lost' }
     ];

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

        let currentRecord = {};

        if(this.status === 'All'){
            this.displayedOpps = this.allOpps;
        }
        else {
            for (let i=0; i < this.allOpps.length; i++){
                currentRecord = this.allOpps[i];
                if( this.status === 'Open'){
                    if(!currentRecord.IsClosed) {
                        this.displayedOpps.push(currentRecord);
                    }
                }
                else if (this.status === 'Closed'){
                    if(currentRecord.IsClosed) {
                        this.displayedOpps.push(currentRecord);
                    }
                }
                else if (this.status === 'ClosedWon'){
                    if(currentRecord.IsWon) {
                        this.displayedOpps.push(currentRecord);
                    }
                }
                else if (this.status === 'ClosedLost'){
                    if(!currentRecord.IsWon && currentRecord.isClosed) {
                        this.displayedOpps.push(currentRecord);
                    }
                }
            }
        }

        this.recordsToDisplay = this.displayedOpps.length > 0 ? true : false;
    }

    handleChange(event){
        this.status = event.detail.value;
        this.updateList();
    }
}