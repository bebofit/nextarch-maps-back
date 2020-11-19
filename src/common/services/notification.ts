import admin from '../../lib/firbase-admin';

const sendMsg = async (title: string, body: string, topic = 'general') => {
  try {
    const response = await admin.messaging().sendToTopic(topic, {
      notification: {
        title,
        body
      }
    });
    console.log('Successfully sent message:', response);
  } catch (error) {
    console.log('Error sending message:', error);
  }
};

const sentToDevice = async (
  registrationToken: string,
  title: string,
  body: string
) => {
  try {
    const response = await admin.messaging().sendToDevice(
      registrationToken,
      {
        notification: {
          title,
          body
        }
      },
      {
        priority: 'high',
        timeToLive: 60 * 60 * 24
      }
    );
    console.log('Successfully sent message:', response);
  } catch (error) {
    console.log('Error sending message:', error);
  }
};

const registerUser = async (registrationToken: string) => {
  try {
    const response = await admin
      .messaging()
      .subscribeToTopic(registrationToken, 'general');
    console.log('Successfully registered:', response);
  } catch (error) {
    console.log('Error registering:', error);
  }
};

export { sendMsg, sentToDevice, registerUser };
