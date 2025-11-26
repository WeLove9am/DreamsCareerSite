export const VALUES_QUERY = `
  query Values {
    entry(section: "values", limit: 1) {
      ... on values_Entry {
        id
        title

        #Values Hero Fields

        subHeading
        caption
        mobileImage {
          url
          alt
        }
        desktopImage {
          url
          alt
        }
        heroImage {
            url
            alt
        }

        #Values Fields
        mobileImage2 {
          url
          alt
        }
        desktopImage2 {
          url
          alt
        }

        history{
          ... on history_Entry {
            title
            caption
            copy
            image {
                url
                alt
            }
          }
        }

        #Values Features Fields

        subHeading2
        subHeading3
        features {
            ... on features_Entry
            {
                title
                image {
                    url
                    alt
                }
                copy
                fullName
                jobTitle
            }
        }
        url        
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
        subTitle2
        subTitle3
        copy2
        buttonCaption
        information
        information2
        subTitle5
        subTitle4
        copy3
        buttonCaption2
        buttonLink
        metaTitle
        metaDescription
        defaultRobots
        sharingTitle
        sharingDescription
        sharingImage {
          url
          alt
        }
        quiz{
          ... on quiz_Entry {
            title
            firstOption
            image {
                url
                alt
            }
            secondOption
            image2 {
                url
                alt
            }
          }
        }
      }
    }
  }
`;
