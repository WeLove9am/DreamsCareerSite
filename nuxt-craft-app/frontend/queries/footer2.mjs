export const FOOTER2_QUERY = `
  query Footer2 {
    entries(section: "footer2") {
      ... on links_Entry {
            title
            pageLink
            
        }
    }
  }
`;
