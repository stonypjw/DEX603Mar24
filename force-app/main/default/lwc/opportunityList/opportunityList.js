import { LightningElement, api, wire, track } from 'lwc';
import getOpportunities from '@salesforce/apex/OpportunityController.getOpportunities';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';
import OPPNAME_FIELD from '@salesforce/schema/Opportunity.Name';
import OPPAMOUNT_FIELD from '@salesforce/schema/Opportunity.Amount';
import OPPCLOSEDATE_FIELD from '@salesforce/schema/Opportunity.CloseDate';
import { refreshApex } from '@salesforce/apex';
import { subscribe, unsubscribe } from 'lightning/empApi';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import RecordModal from 'c/recordModal';
import { NavigationMixin } from 'lightning/navigation';

const tableactions = [
    { label: 'Show Details', name: 'show_details' },
    { label: 'Quick Edit', name: 'quick_edit' },
];

export default class OpportunityList extends NavigationMixin(LightningElement) {

    @api recordId;
    results;

    recordsToDisplay = false;
    displayedOpps = [];
    allOpps = [];
    status = 'All';
    totalAmount;
    totalRecords;

    channelName = '/topic/Opportunities';
    subscription = {};

    tableMode = false;
    selectedMode = 'card';
    draftChanges = [];

    tableCols = [
        { label: 'Opp Name', fieldName: OPPNAME_FIELD.fieldApiName, type: 'text' },
        { label: 'Amount', fieldName: OPPAMOUNT_FIELD.fieldApiName, type: 'currency', editable: true },
        { label: 'Stage', fieldName: STAGE_FIELD.fieldApiName, type: 'text' },
        { label: 'Close Date', fieldName: OPPCLOSEDATE_FIELD.fieldApiName, type: 'date', editable: true },
        {
            type: 'action',
            typeAttributes: { rowActions: tableactions },
        }
    ];



    get modeOptions() {
        return [
            { label: 'Card', value: 'card' },
            { label: 'Table', value: 'table' },
        ];
    }

    modeChange(event){
        this.selectedMode = event.detail.value;
        if(this.selectedMode === 'card'){
            this.tableMode = false;
        }
        else {
            this.tableMode = true;
        }
    }


    @track comboOptions = [
        {value: 'All', label: 'All' },
        {value: 'Open', label: 'Open' },
        {value: 'Closed', label: 'Closed' },
        {value: 'ClosedWon', label: 'All Won' },
        {value: 'ClosedLost', label: 'All Lost' }
     ];

     //Life Cycle Event Handlers
    connectedCallback(){
        this.handleSubscribe();
    }

    disconnectedCallback(){
        this.handleUnSubscribe();
    }

     //Data Wires
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

    //Susbcription Management
    handleSubscribe(){
        const messageCallback = response => {
            //Check for deletion as a seperate event
            if( response.data.event.type === 'deleted'){
                console.log('Found a delete');
                if (this.allOpps.find(elem => { return elem.Id === response.data.sobject.Id})){
                    this.refreshWire();
                }
            } 
            else if (response.data.sobject.AccountId === this.recordId){
                this.refreshWire();
            }
        }

        subscribe(this.channelName, -1, messageCallback)
          .then(response => { this.subscription = response });
    }

    handleUnSubscribe(){
        unsubscribe(this.subscription, response => {console.log('OppList unsubscribed')});
    }

    handleTableSave(event) {
        this.draftChanges = event.detail.draftValues;
        console.log(this.draftChanges);

        const inputItems = this.draftChanges.slice().map(draft => {
            var fields = Object.assign({}, draft);
            return { fields };
        });

        console.log(JSON.stringify(inputItems));

        const promises = inputItems.map(recordInput => updateRecord(recordInput));

        Promise.all(promises)
           .then( result => {
              this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Records successfully updated!',
                    variant: 'success'
                })
              );
           })
           .catch( error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Records were NOT updated!',
                    variant: 'error'
                })
              );
           })
           .finally(() => {
            this.draftChanges = [];
           });
    }

    handleRowAction(event){
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'quick_edit':
                RecordModal.open({
                    size: 'small',
                    recordId: row.Id,
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
                            mode: 'dismissible'
                        });
        
                        this.dispatchEvent(myToast);
        
                        //passes success event up to opportunitylist so that data cache can be refreshed
                        const savedEvent = new CustomEvent('modsaved');
                        this.dispatchEvent(savedEvent);
                    }
                });
                break;
            case 'show_details':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        actionName: 'view'
                    }
                });
                break;
            default:
        }
    }
}