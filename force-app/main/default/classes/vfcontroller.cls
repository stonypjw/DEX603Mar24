public with sharing class vfcontroller {
    public String displaySomething{get;set;}

    public vfcontroller() {
        displaySomething = 'Display This';
    }

    public void doSomething(){
        displaySomething = 'Something Happened';
    }
}