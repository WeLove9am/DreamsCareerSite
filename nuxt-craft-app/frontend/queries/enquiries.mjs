export const CREATE_ENQUIRY_MUTATION = `
  mutation CreateEnquiry(
    $title: String!,
    $firstName: String!,
    $lastName: String!,
    $emailAddress: String!,
    $question: String!,
    $authorId: ID!
  ) {
    save_enquiries_enquiry_Entry(
      title: $title,
      firstName: $firstName,
      lastName: $lastName,
      emailAddress: $emailAddress,
      question: $question,
      authorId: $authorId
    ) {
      id
      title
      dateCreated @formatDateTime(format: "Y-MM-dd HH:mm:ss")
    }
  }
`
