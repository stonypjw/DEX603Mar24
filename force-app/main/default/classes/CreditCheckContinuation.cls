public with sharing class CreditCheckContinuation {

    @AuraEnabled(continuation=true cacheable=true)
    public static Object creditCheckApi(String accountId){
        Continuation con = new Continuation(60);
        con.continuationMethod = 'processResponse';
        con.state = 'Good';

        String url = 'https://splx201-developer-edition.na124.force.com/creditcheck';

        Account acct = [SELECT Id, Name, Owner.Email, Owner.Name FROM Account
                        WHERE ID = :accountId LIMIT 1];

        url += '?name=' +EncodingUtil.urlEncode(acct.Name,'UTF-8')
            +  '&email=' + acct.Owner.Email
            +  '&requestor=' + EncodingUtil.urlEncode(acct.Owner.Name, 'UTF-8');

        HttpRequest req = new HttpRequest();
        req.setEndpoint(url);
        req.setMethod('GET');

        con.addHttpRequest(req);
        return con;
    }

    @AuraEnabled(cacheable=true)
    public static Object processResponse(List<String> labels, Object state){
        HttpResponse response = Continuation.getResponse(labels[0]);
        return response.getBody();
    }
}