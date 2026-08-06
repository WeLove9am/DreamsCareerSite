export const SOCIAL_GRAPHIC_GENERATOR_QUERY = `
  query SocialGraphicGenerator {
    entry(section: "socialGraphicGenerator", limit: 1) {
      ... on graphicGenerator_Entry {
        id
        title

        #Branded Graphic Images
        images{
          ... on images_Entry {
            id
            image {
                url
                alt
            }
            title
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
