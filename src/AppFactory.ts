import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import express, { Request, Response } from 'express';
import { Express } from 'express';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module.js';

export class AppFactory {
  static create(): {
    appPromise: Promise<INestApplication<any>>;
    expressApp: Express;
  } {
    const expressApp = express();
    const adapter = new ExpressAdapter(expressApp);
    const appPromise = NestFactory.create(AppModule, adapter);

    appPromise
      .then((app) => {
        // You can add all required app configurations here

        /**
         * Enable cross-origin resource sharing (CORS) to allow resources to be requested from another domain.
         * @see {@link https://docs.nestjs.com/security/cors}
         */
        app.enableCors({
          exposedHeaders: '*',
        });

        app.init();
      })
      .catch((err) => {
        throw err;
      });

    // IMPORTANT This express application-level middleware makes sure the NestJS app is fully initialized
    expressApp.use((req: Request, res: Response, next) => {
      appPromise
        .then(async (app) => {
          await app.init();
          next();
        })
        .catch((err) => next(err));
    });

    return { appPromise, expressApp };
  }
}
