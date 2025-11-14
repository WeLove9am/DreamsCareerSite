export const FOOTER_QUERY = `
  query Footer {
    entries(section: "footer", level: 1) {
      ... on links_Entry {
            title
            pageLink
            children {
            ... on links_Entry {
                title
                pageLink
            }
            }
        }
    }
  }
`;
