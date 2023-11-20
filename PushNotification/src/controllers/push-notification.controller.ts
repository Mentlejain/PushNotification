import {inject} from '@loopback/core';
import {
  Request,
  RestBindings,
  get,
  post,
  response,
  requestBody,
  ResponseObject,
} from '@loopback/rest';
import * as admin from 'firebase-admin';

export class PushNotificationController {
    constructor(@inject('firebaseAdmin') private firebaseAdmin: admin.app.App) {}
  
    @post('/push-notification')
    @response(200, {
        description: 'Send push notification',
        content: {
            'application/json': {
            schema: {
                type: 'object',
                title: 'PushNotificationResponse',
                properties: {
                success: {type: 'boolean'},
                response: {type: 'object'},
                },
            },
            },
        },
        })
    async sendPushNotification(
      @requestBody() notification: any,
    ): Promise<any> {
      // Use the FCM SDK to send push notifications
      const messaging = this.firebaseAdmin.messaging();
      
      // Assuming 'token' is the device token you want to send the notification to
      const targetToken = 'fF-vLd7BgGSBYir7165GlJ:APA91bGXSsBt5OVmI9GBtw6O2-bsXjzypYrBdmhQifYlWDfclYKeKVWuldulKkwn93o9rUKmo7N2iPWH6F09wfCCnn4CJhjW9N3De8QTsfLdxwpkkQUhPXZZfQSzme2QNzWgUxUPwCO5';
  
      const payload: admin.messaging.Message = {
        notification: {
          title: notification.title,
          body: notification.body,
        },
        token: targetToken,
      };
  
      const options: admin.messaging.MessagingOptions = {
        priority: 'high',
      };
  
      const response = await messaging.send(payload);
  
      return {
        success: true,
        response,
      };
    }
  }