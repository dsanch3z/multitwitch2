import { NextApiRequest, NextApiResponse } from "next";
import { GraphQLClient } from "graphql-request";

const { GITHUB_TOKEN } = process.env;

const GITHUB_API = "https://api.github.com/graphql";
const GITHUB_REPO_ID = "MDEwOlJlcG9zaXRvcnkyMTIxNjE3Nzg=";
const GITHUB_FEEDBACK_LABEL_IDS = ["MDU6TGFiZWwxNTg5ODE5NjA1"];

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req;
  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  const graphQLClient = new GraphQLClient(GITHUB_API, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`
    }
  });

  const query = /* GraphQL */ `
    mutation createIssue(
      $repositoryId: ID!
      $title: String!
      $body: String
      $labelsIds: [ID!]
    ) {
      createIssue(
        input: {
          repositoryId: $repositoryId
          title: $title
          body: $body
          labelIds: $labelsIds
        }
      ) {
        issue {
          title
          body
          repository {
            name
            owner {
              login
            }
          }
          author {
            login
          }
        }
      }
    }
  `;

  const { feedback, rating } = body;
  const variables = {
    repositoryId: GITHUB_REPO_ID,
    title: `Feedback`,
    body: rating ? `${rating} - ${feedback}` : feedback,
    labelIds: GITHUB_FEEDBACK_LABEL_IDS
  };

  try {
    const data = await graphQLClient.request(query, variables);
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ data: err });
  }
};
