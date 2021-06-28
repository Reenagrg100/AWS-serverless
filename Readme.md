1. sls is shortcut for serverless.
2. VPC- Virtual Private Cloud
3. custom in serverless file means where we can declare the variables and can resuse them across the project.
4. plugins:- we define some dependencies under plugins. These dependencies get bundled with the lambda functions when we run serverless deploy cmd.
5. Lambda:- sync and async
6. Amazon eventBridge is for cron jobs. We can schedule any service like lambda, sns etc. using cron.

7. By default:- Lambda's timeout is 3secs and we can increase it upto 15mins
8. For storage lambda can use /tmp directory ( for non-persistent data) and S3 (for persistent data)
9. We normally set the timeout acc. to the function execution time.
10. cold start:- means when code is loaded, initialisation outside the lambda etc. So, generally the first request takes time
    To avoid cold start, we can use provisioned concurrency, this can be achived by auto scaling.
11. We can also set the reservedConcurrency for a lambda function, means no of concurrent request allowwe at a time.

12. Lambda can reference layers. We can have multiple layers where we can install or put common set of dependencies. So, that these can be accessed via multiple lambda functions. We have layer version as well.

Ques. In tuck backend, DB service has been made in layers. But we haven't exported DB service from there, we are simply exporting this into lambda functions. Not consuming as the layer.?

13. Lambda versions:-

-- we work on $LATEST (latest code )
-- versions are immutable (means we can only look at the code of say version1, 2 etc , test it but can't modify the code of these versions). Code modification is only permissisible on the latest version i.e $LATEST
-- each time when publish lambda, new version gets created
-- versions gets their own ARN (Amazon Resource name)

Que. when we deploy using serverless, each time new version of lambda gets created?

14. Lambda Aliases:-
    -- "pointers" to lambda function versions
    -- can define like "dev", "test", "prod" etc.
    -- aliases are mutable
    -- we can use 2 versions with single alias to divide the traffic on different versions
    Ques. How this thing actually works?
    Ques. CodeDeploy?

Best Practices of Lambda:

1. perform heavy duty task outside the function handler like connect to DB, intialise AWS SDK
2. Use Env variables for DB credentials, S3 bucket, they can be encrypted using KMS.
3. Put reusable libraries in the Layers
4. Avoid using recursive ocde, never have a lambda call fn itself --------------VERY Important

Ques. APIs name?
Ques. How integration response got added on Tuck apis in API gateway and also not lambda proxy is enabled ?

15. We have stage variables that can be passed from api gateway to dynamically invoke the lambda fns

16. API Gateway - canary deployment:- To divide the traffic at the time of deployment

17. API Gateway Integration types:-

    1. MOCK:- returns response without sending a req, can be used for dev purpose
    2. HTTP/AWS(Lambda and AWS sewrvices):-
       -- need to configure both integration request and response
       -- setup data mapping using templates for both request and response
    3. Lambda Proxy:-
       -- incoming req from the client directly goes to lambda and res back to the client. Here lambda needs to return the res in the specific format
       -- no mapping template
       -- API Gateway is here to only proxy the request, rest everything is handled by lambda

18. SOAP API vs REST API:- SOAP are XML based whereas REST are JSON based
19. We can use API Keys to protect our apis.
    -- craete api key(custom or auto generated), enable it on any method.
    -- send that api key in header as X-API-Key in request while acccessing this api.
20. Can create a usage plan, throttling etc to track the usage of our api.
21. Errors:-
    -- 4xx: client side
    --5xx: server side
22. CORS must be enabled when you recive API calls from another domain. CORS can be enabled directly from API gateway for any integration req type except lambda proxy. For lambda proxy, we can just return Access-Control-Allow-Origin:'\*' into the headers of lambda response.
23. API Gateway Security (Authentication and Authorization):-
    1. IAM Role and Policy
    2. Cognito user pool:- when using cognito to authenticate users
    3. Custom authorizer/lambda authorizer:-
       --when using 3rd party for auth
       -- pass 3rd party token through headers etc. in api
       -- retrive the token into lambda and then lambda will check for the authenticity of this token by communicating with that 3rd party api
       -- flexible
       -- need to write custom code
24. we can also add authroization using IAM Policy
25. Types of APIs:-

    1. HTTP API vs REST API:- HTTP has lesser feature than the REST
    2. Websocket APIs:- 2 way interactive comm b/w a user's browser and a server.

26. Cognito:-
    1. User Pool:- DB of users to login
    2. Identity Pool:- Provide users access to AWS Services
27. Cognito itself creates federated identities for the users of cognito user pool, federated identities, openId connect providers etc. But for custom login server, we can user developer auth identities. As if we don't use these then we need to create IAM roles for these user to access aws services but as these users will be too many. So this is not viable to do so.

Cloudformation:-

28. Cloudformation drift is a way to detect the changes done manually in any of the resources, we can view thoose changes and then fix our cfn accordingly.
29. CFN resources syntax: AWS::aws-product-name::data-type-name
30. Former2(Tool):- we can create cfn using existing resources
31. Deletion pOlicy; means even if we delete the cfn template still we don't want our resource to be deleted like db.
    It's of 3 types. We can consider this to care about our imp resources
32. Do not put credentials into your CFN, it should be either pass through params or KMS encrypted.
33. No need of auto scaling in serverless - Managed services
34. Serverless building block:- Faas ( Function as a service means AWS lambda, goggle cloud functions etc.)

35. Serverless plugins:-
    1. serverless-webpack:-bundle js application using webapck
    2. serverless-domain-manager:- craetes and assign domain to deployment
    3. serverless-offline:- helps to run lamnda functions locally using api gateway
    4. serverless-plugin-typescript:- provides ts support to lambas
       and there are many more.
36. Microservices vs Monolithic:- In monolithic, everything is under one hood.
    -- in microservices, we can scale independently of another services.
37. Commands:-

    1. sls create --name auction-service --template-url https://github.com/codingly-io/sls-base
    2. sls deploy -v --stage dev (Here, v stands for verbose means it will display the whole details of deployment)
    3. sls remove -v ( to delete the stack )
    4. sls deploy -f createAuction -v

38. .serverless folder gets created while deployment (sls deploy)
39. By Default,

    1. cfn stack name:- service name + stage name (dev/prod) and
    2. api name:- stage name + service name
    3. s3 bucket name:- service name + stage name + serverlessdeploymentbucket..

40. Each lambda get assigned an IAM role and this role actually defines what all permissions it has to access the other aws resources.

41. To see logs in the terminal just like cloudwatch, no need to go to cloudwatch
    1. sls logs --function func_name
    2. sls logs --function func_name --startTime 1m => means show the logs starting from 1m ago.
    3. sls logs --function func_name -t
    4. sls invoke --function func_mame -l =>invoke and view logs
42. Cron services gets stored in Amazon EventBridge.
