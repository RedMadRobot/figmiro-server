import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {boardsController} from 'modules/boards';
import {authController} from 'modules/auth';
import {picturesController} from 'modules/pictures';
import {mediaController} from 'modules/media';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(picturesController.root, picturesController.ctx);
app.use(authController.root, authController.ctx);
app.use(boardsController.root, boardsController.ctx);
app.use(mediaController.root, mediaController.ctx);
app.listen(5000);
