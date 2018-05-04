import AWSAppSyncClient from 'aws-appsync';
import { AUTH_TYPE } from 'aws-appsync/lib/link/auth-link';


export default new AWSAppSyncClient({
    url: ENV.APPSYNC_API_URL,
    region: 'ap-northeast-1',
    auth: {
        type: AUTH_TYPE.API_KEY,
        apiKey: ENV.APPSYNC_API_KEY,
    },
});
