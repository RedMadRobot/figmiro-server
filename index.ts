import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {boardsController} from 'modules/boards';
import {authController} from 'modules/auth';
import {storage} from "utils/storage";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(boardsController.root, boardsController.ctx);
app.use(authController.root, authController.ctx);
app.listen(5000);
(async () => {
  await storage.set('lol', 'nyan');
  await storage.set('lol', 'ewf')
})();
