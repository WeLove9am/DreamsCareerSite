export const ABOUT_QUERY = `
  query About {
    entry(section: "about", limit: 1) {
      ... on about_Entry {
        id
        title

        #About Hero Fields

        subHeading
        caption
        vimeoVideoId
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

        #About Intro Fields

        subHeading2
        subHeading3
        caption2
        caption3

        #About History Fields
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

        #About Partner Fields
        subTitle
        copy
        copy2
        image {
            url
            alt
        }
        image2 {
            url
            alt
        }
        image3 {
            url
            alt
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
