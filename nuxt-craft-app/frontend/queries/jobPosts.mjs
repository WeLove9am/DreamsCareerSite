export const JOB_POSTS_QUERY = `
  query BlogPosts($slug: [String]) {

    # Job from the slug / Job Advert Page
    jobListEntries(slug: $slug) {
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
        person
        about
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
    
    # Job Advert Page Fixed Content
    entry(section: "jobs", limit: 1) {
    ... on jobs_Entry {

        jImages{
            url
            title
        }
        subHeading2
        subHeading3
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
        subTitle
        subTitle2
        subTitle3
        subTitle4
        caption2
      }    
    }
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

  
  retail: entry(section: "retail", limit: 1) {
    ... on retail_Entry {
      features {
        ... on features_Entry {
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
      promises {
        ... on promises_Entry {
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

  bedquarters: entry(section: "bedquarters", limit: 1) {
    ... on bedquarters_Entry {
      features {
        ... on features_Entry {
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
      promises {
        ... on promises_Entry {
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

  distribution: entry(section: "distribution", limit: 1) {
    ... on distribution_Entry {
      features {
        ... on features_Entry {
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
      promises {
        ... on promises_Entry {
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

  bedfactory: entry(section: "bedfactory", limit: 1) {
    ... on bedfactory_Entry {
      features {
        ... on features_Entry {
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
      promises {
        ... on promises_Entry {
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


  }
`;
