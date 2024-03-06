public with sharing class OpportunityController {

    @AuraEnabled
    public static List<Opportunity> getOpportunities(String accountId){

        List<Opportunity> opps = new List<Opportunity>();

        opps = [SELECT Id, Name, Amount, StageName, CloseDate,
                       IsWon, IsClosed
                FROM Opportunity
                WHERE AccountId = :accountId WITH SECURITY_ENFORCED];
        return opps;
    }
}