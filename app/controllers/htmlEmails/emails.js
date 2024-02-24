/*
 * File: c:\Users\tonyw\Desktop\WoRTool API\wortool-api\app\controllers\htmlEmails\emails.js
 * Project: c:\Users\tonyw\Desktop\WoRTool API\wortool-api
 * Created Date: Friday February 23rd 2024
 * Author: Tony Wiedman
 * -----
 * Last Modified: Fri February 23rd 2024 7:13:51 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2024 MolexWorks / Tone Web Design
 */

/**
 * HTML Email for Welcome Email
 * @param {*} username 
 * @returns 
 */
function welcomeEmail(username) {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to WoRTool!</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #1f2937; color: #88887b;">
    
    <div style="width: 100%; max-width: 600px; margin: 5px auto; padding: 1em; box-sizing: border-box;">
      <img src="https://wortool.com/app-icon-wortool.png" style="margin:auto;display:block;height:100px;width:auto;">
      
      <div style="background:#7d7e73;color: #1f2937;width:100%;max-width:600px;padding:0.5em;font-weight:700;font-size:15px;text-align:center;">Welcome to WoRTool!</div>
      
      <p style="margin-bottom: 20px;margin-left: 8px;color: #e5e5e5 !important;">Hello ${username},</p>
      <p style="margin-bottom: 20px;margin-left: 8px;color: #e5e5e5 !important;">Congratulations! Your WoRTool account has been successfully created.</p>
      <p style="margin-bottom: 20px;margin-left: 8px;color: #e5e5e5 !important;">You can now log in and start exploring the features of WoRTool.</p>
      <p style="margin-bottom: 20px;margin-left: 8px;">Login to your account <a href="https://wortool.com/home" target="_blank" style="color: #88887b;">here</a>.</p>
      <p style="margin-bottom: 20px;margin-left: 8px;color: #e5e5e5 !important">If you have any questions or need assistance, feel free to contact us at support@wortool.com.</p>
    </div>
    
  </body>
  </html>
    `;
  }
  
  /**
   * HTML Email for Password Reset Request
   * @param {*} username 
   * @param {*} resetUrl 
   * @returns 
   */
  function passwordResetEmail(username, resetUrl) {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #1f2937; color: #88887b;">
  
    <div style="width: 100%; max-width: 600px; margin: 5px auto; padding: 1em; box-sizing: border-box;">
      <img src="https://wortool.com/app-icon-wortool.png" style="margin:auto;display:block;height:100px;width:auto;">
  
      <div style="background:#7d7e73;color: #1f2937;width:100%;max-width:600px;padding:0.5em;font-weight:700;font-size:15px;text-align:center;">Password Reset Request</div>
  
      <p style="margin-bottom: 20px;margin-left: 8px;color: #e5e5e5 !important;">Hello ${username},</p>
      <p style="margin-bottom: 20px;margin-left: 8px;color: #e5e5e5 !important;">You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
      <p style="margin-bottom: 20px;margin-left: 8px;color: #e5e5e5 !important;">Please click on the following link, or paste this into your browser to complete the process:</p>
      <p style="margin-bottom: 20px;margin-left: 8px;"><a href="${resetUrl}" target="_blank" style="color: #88887b;">${resetUrl}</a></p>
      <p style="margin-bottom: 20px;margin-left: 8px;color: #e5e5e5 !important">If you did not request this, please ignore this email and your password will remain unchanged.</p>
    </div>
  
  </body>
  </html>
    `;
  }
  
  module.exports = {
    welcomeEmail,
    passwordResetEmail
  };
  