import { LightningElement,api } from 'lwc';

export default class ChildHelloWorld extends LightningElement {

    @api messageToDisplay;
}