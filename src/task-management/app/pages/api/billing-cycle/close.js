export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      const response = await fetch('http://localhost:3003/billing-cycle/close', { method: 'post' });
      const body = await response.json();

      res.status(200).json(body);
      break;
  }
}
