export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      const response = await fetch('http://localhost:3003/balance');
      const body = await response.json();

      res.status(200).json(body);
      break;
  }
}
