import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {boardsController} from 'modules/boards';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(boardsController.root, boardsController.ctx);

app.get('/oauth', async (req, res) => {
  res.send(`${req.query.code}, ${req.query.client_id}`);
});

app.listen(5000);
