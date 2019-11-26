import express, {Request} from 'express';
import axios from 'axios';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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

type CreateRequest = {
  name: string;
};
app.post('/boards/create', (req: Request, res) => {
  const {name} = req.body as CreateRequest;
  axios({
    url: 'https://api.miro.com/v1/boards',
    method: 'POST',
    headers: {
      Authorization: 'Bearer d97e2da1-9e08-4abf-8d5e-72d970d1ddd8'
    },
    data: {
      name,
      sharingPolicy: {
        access: 'private',
        teamAccess: 'private'
      }
    }
  })
    .then(data => res.send(data.data.data))
    .catch(error => console.log(error));
});

app.listen(5000);
