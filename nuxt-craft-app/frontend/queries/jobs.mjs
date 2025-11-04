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
        postDate @formatDateTime(format: "F j, Y")
        jobDescription
      }
    }
    entryCount(section: "jobList")
  }
`;