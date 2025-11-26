export const BENEFITS_QUERY = `
  query Benefits {
    entry(section: "benefits", limit: 1) {
      ... on benefits_Entry {
        id
        title

        #Benefits Hero Fields

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

        #Benefits Intro Fields

        subHeading2
        subHeading3
        caption2

        #Benefits Promises & Perks Fields

        subTitle
        caption3
        caption4
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

        #Benefits Wellbeing Fields

        subHeading4
        subHeading5
        subHeading6
        wellbeing{
          ... on wellbeing_Entry{
            title
            image{
              url
              alt
            }
            subTitle
            copy
            list {
                ... on list_Entry
                {
                    title
                    caption
                }
            }
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
