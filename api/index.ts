/**
 * This file exports Express instance for specifically for the deployment of the app on Vercel.
 */

import { AppFactory } from '../src/AppFactory.js';

export default AppFactory.create().expressApp;
