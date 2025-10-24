export const RETAIL_QUERY = `
  query Retail {
    entry(section: "retail", limit: 1) {
      ... on retail_Entry {
        id
        title

        #Retail Hero Fields

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

        #Retail Intro Fields

        subHeading2
        subHeading3
        caption2
        caption3
        image {
            url
            alt
        }

        #Retail Features Fields

        subHeading4
        subHeading5
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

        #Retail Promises & Perks Fields

        subHeading6
        subHeading7
        promises {
            ... on promises_Entry
            {
                title
                copy
                subTitle
                caption
                copy2
                copy3
                copy4
                image {
                    url
                    alt
                }
            }
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
