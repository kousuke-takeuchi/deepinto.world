import AWSAppSyncClient from "aws-appsync";
import { AUTH_TYPE } from "aws-appsync/lib/link/auth-link";
import * as AWS from 'aws-sdk';


const AppSync = {
    "graphqlEndpoint": ENV.APPSYNC_API_URL,
    "region": "ap-northeast-1",
    "authenticationType": "API_KEY",
    "apiKey": ENV.APPSYNC_API_KEY
}

export default new AWSAppSyncClient({
    url: AppSync.graphqlEndpoint,
    region: AppSync.region,
    auth: {
        type: AUTH_TYPE.API_KEY,
        apiKey: AppSync.apiKey,
    },
});