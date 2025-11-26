export const HOME_QUERY = `
  query Home {
    entry(section: "home", limit: 1) {
      ... on page_Entry {
        id
        title
        url
        pageSubheading
        pageSubheading2
        pageContent
        image {
          url @transform(handle: "hero")
          alt
        }
        metaTitle
        metaDescription
        defaultRobots
        sharingTitle
        sharingDescription
        sharingImage {
          url
          alt
        }
      }
    }
    globalEntries(limit: 1) {
      ... on global_Entry {
        metaTitle
        metaDescription
        defaultRobots
        sharingTitle
        sharingDescription
        sharingImage {
          url
          alt
        }
      }
    }

  }
`
