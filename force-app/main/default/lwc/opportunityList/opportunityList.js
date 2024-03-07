import { LightningElement, api, wire, track } from 'lwc';
import getOpportunities from '@salesforce/apex/OpportunityController.getOpportunities';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';
import { refreshApex } from '@salesforce/apex';

export default class OpportunityList extends LightningElement {

    @api recordId;
    results;

    recordsToDisplay = false;
    displayedOpps = [];
    allOpps = [];
    status = 'All';
    totalAmount;
    totalRecords;

    @track comboOptions = [
        {value: 'All', label: 'All' },
        {value: 'Open', label: 'Open' },
        {value: 'Closed', label: 'Closed' },
        {value: 'ClosedWon', label: 'All Won' },
        {value: 'ClosedLost', label: 'All Lost' }
     ];

     @wire(getPicklistValues, { recordTypeId: '012000000000000AAA' , fieldApiName: STAGE_FIELD })
     wirePicklist({ data, error }) {
        if(data) {
            for (let item of data.values){
                this.comboOptions.push({value: item.value, label: item.label});
            }
            this.comboOptions = this.comboOptions.slice();
        }
        if(error){
            console.error('Error retrieving picklist values from StageName');
        }
     }

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
        else {  //Need to add logic to match to stage names
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
                else if ( this.status === currentRecord.StageName ){
                    this.displayedOpps.push(currentRecord);
                }
            }
        }
        this.recordsToDisplay = this.displayedOpps.length > 0 ? true : false;
        this.totalRecords = this.displayedOpps.length;
        this.totalAmount = this.displayedOpps.reduce((prev, curr) => prev + (isNaN(curr.Amount) ? 0 : curr.Amount), 0);
    }

    handleChange(event){
        this.status = event.detail.value;
        this.updateList();
    }

    refreshWire(){
        refreshApex(this.results);
    }
}