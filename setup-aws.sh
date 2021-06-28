# 1. Install serverless globally
npm install -g serverless 

# 2. Setup serverless
serverless config credentials --provider aws --key XXX --secret YYY --profile serverless-admin 

# 3. Craete a lambda functiona
sls create --template aws-nodejs --path hello-world

# 4. Deploy the lambda function
cd hello-world
sls deploy -v  # (deploy the entire stack, will take a long as deploying whole stack )

#5. Test lambda
sls invoke -f hello -l

#6. Deploy only a single function
sls deploy function -f hello  #(only deploy a single function as only one fn deploy, can be used if changing a single lambda)

#7. Get the logs through CLI
sls logs -f hello -t

#8. To remove everything which is deployed
sls remove

serverless config --autoupdate
