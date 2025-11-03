export const APPLICATION_QUERY = `
  query ApplicationProcessPage {
    entry(section: "applicationProcess", limit: 1) {
      ... on application_Entry {
        id
        title

        #Application Process Hero Fields

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

        #Application Process Steps

        subTitle
        application {
            ... on applicationprocess_Entry
            {
                title
                subTitle
                copy
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
