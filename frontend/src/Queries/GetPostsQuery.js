import gql from 'graphql-tag';

export default gql`
query GetPosts {
    getPosts {
        title
        url
        published_at
    }
}`;