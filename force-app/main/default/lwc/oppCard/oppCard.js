import { LightningElement, api } from 'lwc';

export default class OppCard extends LightningElement {

    //public properties to store opp field values
    @api name;
    @api amount;
    @api stage;
    @api closedate
    @api oppId;


}