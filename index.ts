import express, {Request, Response} from 'express';
import axios from 'axios';

const app = express();

app.use((_: Request, res: Response, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});

app.get('/oauth', async (req, res) => {
  res.send(`${req.query.code}, ${req.query.client_id}`);
});

app.get('/boards', (_, res) => {
  axios.get('https://api.miro.com/v1/accounts/3074457347044577000/boards', {
    headers: {
      Authorization: 'Bearer d97e2da1-9e08-4abf-8d5e-72d970d1ddd8'
    }
  })
    .then(data => res.send(data.data.data))
    .catch(error => console.log(error));
});

app.listen(5000);
