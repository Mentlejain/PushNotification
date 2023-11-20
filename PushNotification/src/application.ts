import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import * as admin from 'firebase-admin';
import { initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

import fs from 'node:fs';

export {ApplicationConfig};

export class PushNotificationApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);
    const ProjectConfig = JSON.parse(fs.readFileSync("./shastacloud-1337-firebase-adminsdk-8qzil-70c9b44014.json").toString())
    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Set up Firebase Admin
    
    const firebaseAdminConfig = {
      credential: admin.credential.cert(ProjectConfig),
    };

    const firebaseAdminApp = admin.initializeApp(firebaseAdminConfig);

    this.bind('firebaseAdmin').to(firebaseAdminApp);



  // Initialize Firebase Cloud Messaging and get a reference to the service
  const messaging = getMessaging(firebaseAdminApp);

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
