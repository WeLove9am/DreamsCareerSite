export const JOB_POSTS_QUERY = `
  query Jobs($limit: Int!, $offset: Int!) {
    entry(section: "jobs", limit: 1) {
        ... on jobs_Entry {
            id
            title

            #Jobs Hero Fields

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
    jobListEntries(limit: $limit, offset: $offset) {
      ... on jobList_Entry {
        id
        slug
        title
        uri
        jobId
        jobLink
        location
        postCode
        salary
        postDate @formatDateTime(format: "F j, Y")
        jobDescription
        postcodesCat {
          ... on postcodesCat_Category {
            id
            title
            longitude
            latitude
          }
        }
        sector {
          ... on sector_Category {
            id
            title
          }
        }
        contractType {
          ... on contractType_Category {
            id
            title
          }
        }
        contractHours {
          ... on contractHours_Category {
            id
            title
          }
        }
      }
    }
    entryCount(section: "jobList")
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
`;