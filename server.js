/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT } = process.env;

// Store user session states in memory for flow control (this is just for demo purposes)
const userSession = {};

// Handle incoming WhatsApp webhook events
app.post("/webhook", async (req, res) => {
  const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
  const userMessage = message?.text?.body; // Get the user's message

  const userId = message?.from; // The user's WhatsApp ID
  let templateName = ""; // This will hold the template name
  let templateParams = []; // Ensure this is always an array
  
  // Log the incoming message for debugging
  console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));
  console.log("Incoming message:", userMessage);

  // Handle flow logic based on user's session state
  if (!userSession[userId]) {
    userSession[userId] = { step: 0 }; // Initialize user session
  }

  // Get the user's current step in the flow
  const userStep = userSession[userId].step;

  // Conditional template selection based on flow and user response
  switch (userStep) {
    case 0:
      // Step 0: Greeting or initial user input
      if (userMessage?.includes('hi') || userMessage?.includes('hello')) {
        templateName = "ace_main_menu_final"; // Main menu template
        userSession[userId].step = 1; // Move to next step after greeting
      } else {
        templateName = "invalid_input_selected";
        userSession[userId].step = 0;// Handle invalid greeting
      }
      break;

      case 1:
      // Step 1: User selects an option from the main menu (e.g., "Products" or "Services")
      if (userMessage === '1') {
        templateName = "ace_sub_menu_final";
        //templateParams = [{ type: "text", text: userMessage }]; // Ensure this is an array with text
        userSession[userId].step = 2; // Move to next step
      } else if (userMessage === '2') {
        templateName = "purpose_of_visit_template_final";
        //templateParams = [{ type: "text", text: userMessage }]; // Ensure this is an array with text
        userSession[userId].step = 2; // Move to next step
      } else {
        templateName = "invalid_input_selected";
        userSession[userId].step = 0;// Handle invalid input
      }
      console.log("templateName for case 1:", templateName);
      break;

      
      case 2:
      // Step 1: User selects an option from the main menu (e.g., "Products" or "Services")
      //console.log('test1', templateName)
      //console.log('test2', typeof(templateName))
     // console.log("templateName for before  case 2:", templateName);
      if(userSession[userId].lastTemplate === 'ace_sub_menu_final'){
        if (userMessage === '1') {
        templateName = "appointments_next_template_final";
        //templateParams = [{ type: "text", text: userMessage }]; // Ensure this is an array with text
        userSession[userId].step = 3; // Move to next step
      } else if (userMessage === '2') {
        templateName = "appointments_past_template";
        //templateParams = [{ type: "text", text: userMessage }]; // Ensure this is an array with text
        userSession[userId].step = 3; // Move to next step
      } else if (userMessage === '3') {
        templateName = "purpose_of_visit_template_final";
        templateParams = [{ type: "text", text: userMessage }]; // Ensure this is an array with text
        userSession[userId].step = 3; // Move to next step
      }
        console.log("templateName for case 2:", templateName);
      }
      
      else if(userSession[userId].lastTemplate === 'purpose_of_visit_template_final'){
        if (userMessage === '1') {
        templateName = "confirmation_purpose_of_visit_template";
        //templateParams = [{ type: "text", text: userMessage }]; // Ensure this is an array with text
        userSession[userId].step = 3; // Move to next step
      } 
        if (userMessage === '2') {
        templateName = "confirmation_purpose_of_visit_template";
        //templateParams = [{ type: "text", text: userMessage }]; // Ensure this is an array with text
        userSession[userId].step = 3; // Move to next step
      } 
        if (userMessage === '3') {
        templateName = "confirmation_purpose_of_visit_template";
        //templateParams = [{ type: "text", text: userMessage }]; // Ensure this is an array with text
        userSession[userId].step = 3; // Move to next step
      } 
        if (userMessage === '4') {
        templateName = "confirmation_purpose_of_visit_template";
       // templateParams = [{ type: "text", text: userMessage }]; // Ensure this is an array with text
        userSession[userId].step = 3; // Move to next step
      }  
        
      } 
      else {
        templateName = "invalid_input_selected";
        userSession[userId].step = 0;// Handle invalid input
      }
      
      break;
      

       case 3:
       if(userSession[userId].lastTemplate === 'confirmation_purpose_of_visit_template'){
      
        templateName = "date_reply_template_final";
        templateParams = [{ type: "text", text: userMessage }]; // Ensure this is an array with text
        userSession[userId].step = 4; // Move to next step
      
       }
        else {
        templateName = "invalid_input_selected";
          userSession[userId].step = 0;// Handle invalid input
       }
       break;
      
       case 4:
      // Step 1: User selects an option from the main menu (e.g., "Products" or "Services")
      //console.log('test1', templateName)
      //console.log('test2', typeof(templateName))
      console.log("templateName for before  case 3:", templateName);
      if(userSession[userId].lastTemplate === 'purpose_of_visit_template'){
        if (userMessage === '1') {
        templateName = "purpose_of_visit_confirmation_template";
        templateParams = [{ type: "text", text: userMessage }]; // Ensure this is an array with text
        userSession[userId].step = 4; // Move to next step
      } 
        if (userMessage === '2') {
        templateName = "purpose_of_visit_confirmation_template";
        templateParams = [{ type: "text", text: userMessage }]; // Ensure this is an array with text
        userSession[userId].step = 4; // Move to next step
      } 
        if (userMessage === '3') {
        templateName = "purpose_of_visit_confirmation_template";
        templateParams = [{ type: "text", text: userMessage }]; // Ensure this is an array with text
        userSession[userId].step = 4; // Move to next step
      } 
        if (userMessage === '4') {
        templateName = "purpose_of_visit_confirmation_template";
        templateParams = [{ type: "text", text: userMessage }]; // Ensure this is an array with text
        userSession[userId].step = 4; // Move to next step
      }    
    }
      
     else {
        templateName = "invalid_input_selected";
       userSession[userId].step = 0;// Handle invalid input
     }
     console.log("templateName for after  case 3:", templateName);
      
      break;
    
    case 5:
       if(userSession[userId].lastTemplate === 'purpose_of_visit_confirmation_template'){
        if (userMessage === '2') {
        templateName = "select_date_template_1";
        //templateParams = [{ type: "text", text: userMessage }]; // Ensure this is an array with text
        userSession[userId].step = 5; // Move to next step
      }
     }
      else {
        templateName = "invalid_input_selected";
        userSession[userId].step = 0;// Handle invalid input
     }
    break;
      
     case 6:
       if(userSession[userId].lastTemplate === 'select_date_template_1'){
      
        templateName = "reply_date_template";
        templateParams = [{ type: "text", text: userMessage }]; // Ensure this is an array with text
        userSession[userId].step = 6; // Move to next step
      
     }
      else {
        templateName = "invalid_input_selected"; 
        userSession[userId].step = 0;// Handle invalid input
     }
    break;

    default:
      templateName = "invalid_input_selected"; // Fallback for unrecognized input
      userSession[userId].step = 0; // Reset user flow
      break;
      console.log("templateName final:", templateName);
  }

  userSession[userId].lastTemplate = templateName;
  
  
  // Send the appropriate template message via the WhatsApp API
  if (message?.type === "text") {
    const business_phone_number_id =
      req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
      headers: {
        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        to: userId,
        type: "template",
        template: {
          name: templateName,
          language: {
            code: "en", // Language code for the template
          },
          components: [
            {
              type: "body",
              parameters: templateParams // This should always be an array
            }
          ]
        }
      }
    });

    // Mark the incoming message as read
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
      headers: {
        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        status: "read",
        message_id: message.id,
      },
    });
  }

  res.sendStatus(200);
});

// Webhook verification endpoint (for the initial setup)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    res.status(200).send(challenge);
    console.log("Webhook verified successfully!");
  } else {
    res.sendStatus(403);
  }
});

// Default route
app.get("/", (req, res) => {
  res.send(`<pre>Nothing to see here. Checkout README.md to start.</pre>`);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
