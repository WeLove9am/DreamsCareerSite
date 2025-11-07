export const STAFF_QUERY = `
  query Staff {
    entry(section: "staff", limit: 1) {
      ... on staff_Entry {
        id
        title

        #Staff Hero Fields

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

        #Staff Intro Fields

        subHeading
        copy
        image {
            url
            alt
        }

        #Staff Steps Fields
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

        #Staff Steps Fields
        images{
          ... on images_Entry {
            image {
                url
                alt
            }
            title
          }
        }
        images2{
          ... on images2_Entry {
            image {
                url
                alt
            }
            title
          }
        }
        subTitle
        copy2
        copy3
        list {
            ... on list_Entry
            {
                title
                caption
            }
        }
        copy4



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
