import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

/**
 * Cloudflare Pages Function to handle POST requests at /sendEmail
 */
export const onRequestPost = async ({ request, env }) => {
  try {
    // 1. Parse the incoming JSON from the request body
    const formData = await request.json();
    // formData should include:
    // {
    //   name: ...,
    //   phoneNumber: ...,
    //   email: ...,
    //   projectBudget: ...,
    //   project_type: ...,
    //   subject: ...,
    //   message: ...
    // }

    // 2. Create a new SES client using your environment variables
    const client = new SESClient({
      region: 'us-east-2', // Adjust to your SES region
      credentials: {
        accessKeyId: env.MY_AWS_ACCESS_KEY_ID,
        secretAccessKey: env.MY_AWS_SECRET_ACCESS_KEY,
      },
    });

    // 3. Construct the email body text with all form fields
    const emailBody = `
New message from ${formData.name}:

Phone Number: ${formData.phoneNumber}
Email: ${formData.email}
Project Budget: ${formData.projectBudget}
Project Type(s): ${formData.project_type.join(', ')} 
Subject: ${formData.subject}

Message:
${formData.message}
    `.trim();

    // 4. Prepare the parameters for sending the email
    const params = {
      Destination: {
        ToAddresses: ['info@atbcon.com'], // Replace or add your recipient
      },
      Message: {
        Body: {
          Text: {
            Charset: 'UTF-8',
            Data: emailBody,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: `Contact Form Submission: ${formData.subject}`,
        },
      },
      Source: 'info@atbcon.com', // Must be a verified "From" address in SES
    };

    // 5. Send the email
    const command = new SendEmailCommand(params);
    await client.send(command);

    // 6. Return a success response
    return new Response(
      JSON.stringify({ message: 'Your message has been sent successfully!' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    // Return error response
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
