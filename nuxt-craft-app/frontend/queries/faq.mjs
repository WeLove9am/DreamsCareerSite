export const FAQ_QUERY = `
  query FAQPage {
    entry(section: "faqs", limit: 1) {
      ... on faq_Entry {
        id
        title
        authorId

        #FAQ Hero Fields

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

        #FAQ Content Fields

        subTitle
        caption2
        copy
        qands {
            ... on titles_Entry
            {
                title
                items {
                    ... on qandas_Entry {
                         title
                         subTitle
                         copy
                         showEnquiryForm
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
