export const STORES_QUERY = `
  query Stores($postCode: [QueryArgument]){
    storesEntries(postCode: $postCode) { 
      ... on stores_Entry {
        id
        title
        fullAddressLine
        postCode
      }
    }
  }
`;