const aws = require('aws-sdk');

// Configure Amazon SES
const SES_CONFIG = {
  accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  region: 'us-east-2',
};

const ses = new aws.SES(SES_CONFIG);

exports.handler = async (event, context) => {
  try {
    const formData = JSON.parse(event.body);

    const params = {
      Destination: {
        ToAddresses: ['sales@winart.ca'],  // Replace with your email
      },
      Message: {
        Body: {
          Text: {
            Charset: 'UTF-8',
            Data: `New message from ${formData.name} (${formData.email}):\n\nSubject: ${formData.subject}\n\nMessage: ${formData.message}`,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: `Contact Form Submission: ${formData.subject}`,
        },
      },
      Source: 'sales@winart.ca',  // Replace with your verified SES email
    };

    await ses.sendEmail(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Your message has been sent successfully!' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
