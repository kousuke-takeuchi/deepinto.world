import 'babel-polyfill';


export const graphqlHandler = (event, context, callback) => {
  const result = [{
    title: 'hello',
    url: 'https://example.com',
    published_at: 123456
  }]
  callback(null, result);
};
