public with sharing class vfcontroller {
    public String displaySomething{get;set;}
    Integer count = 0;

    public vfcontroller() {
        displaySomething = 'Display This';
    }

    public void doSomething(){
        displaySomething = 'Something Happened';
        count += 1;
        Boolean isCountTooHigh = checkCount(count);

    }

    public void doSomethingElse(){
        displaySomething = 'Something Happened';
        count += 1;
        Boolean isCountTooHigh = checkCount(count);

    }

    private Boolean checkCount(Integer c){
        Boolean highCount = false;
        if (c>15){highCount = true;}
        return highCount;
    }
}