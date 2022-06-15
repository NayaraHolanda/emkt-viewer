import axios from 'axios'

export default function handler(req, res) {
  if (req.method === 'POST') {
    axios.get(req.body.email)
      .then(({ data }) => {
        res.status(200).json(data)
      })
      .catch((e) => res.status(404).send(e))
  }
}