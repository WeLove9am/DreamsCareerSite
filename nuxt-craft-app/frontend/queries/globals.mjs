export const GLOBALS_QUERY = `
  query Globals {
    globalEntries(limit: 1) {
      ... on global_Entry {
        id
        title
        logo {
          url
          alt
        }
        address {
          addressLine1
          addressLine2
          addressLine3
          countryCode
          locality
          postalCode
          title
        }
      }
    }
    pagesEntries(level: 1) {
      ... on page_Entry {
        id
        title
        uri
      }
    }
    headerEntries(level: 1) { 
      ... on header_Entry { # <--- Querying fields ONLY inside the fragment
        id                  # <--- Now valid
        title
        pageLink
        image {
          url
          alt
        }
        # Recursive fragment for children is also correct
        children {
          ... on header_Entry {
            id
            title
            pageLink
            image {
              url
              alt
            }
          }
        }
      }
    }
   
}
`
