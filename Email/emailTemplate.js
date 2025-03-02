function emailTemplate(email) {
    return ` <!DOCTYPE html>
  <html>
  <head>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              text-align: center;
              padding: 20px;
          }
          .container {
              background: white;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
              max-width: 500px;
              margin: auto;
          }
          h2 {
              color: #333;
          }
          p {
              font-size: 16px;
              color: #666;
          }
          .btn {
              display: inline-block;
              padding: 10px 20px;
              font-size: 16px;
              color: white;
              background: #28a745;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 10px;
          }
          .btn:hover {
              background: #218838;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h2>Email Verification</h2>
          <p>Hello <strong>welcome to my website</strong>,</p>
          <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
          <a href="http://localhost:3000/verify/${email}" class="btn">Verify Email</a>
          <p>If you didn't sign up, please ignore this email.</p>
      </div>
  </body>
  </html>
  `;
}

export default emailTemplate;