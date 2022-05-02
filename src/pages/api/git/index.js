import db from "../../../../db.json"

import { Octokit } from "@octokit/rest"

export default function handler(req, res) {
  if (req.method === 'POST') {
    const octokit = new Octokit({ auth: db.auth });

    octokit.rest.repos.getContent({
      owner: db.owner,
      repo: db.repo,
      path: req.body.path
    })
    .then(({ data }) => {
      const list = data.map((item) => {
        return {
          name: item.name,
          path: item.path,
          type: item.type,
          downloadUrl: item.download_url,
          list: []
        }
      })
      res.status(200).json({list})
    })
    .catch((e) => {
      res.status(500).send(e)
    })
  }
}
