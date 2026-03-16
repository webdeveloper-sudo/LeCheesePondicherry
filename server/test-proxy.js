const axios = require('axios');
require('dotenv').config();

const testProxy = async () => {
    const url = process.env.GOOGLE_APPS_SCRIPT_URL;
    console.log(`Testing URL: ${url}`);
    
    try {
        const response = await axios.post(url, {
            action: "SEND_EMAIL",
            to: "test@example.com",
            subject: "Test",
            html: "Test"
        });
        
        console.log("Response Data:", JSON.stringify(response.data, null, 2));
        
        if (response.data.success) {
            console.log("✅ SUCCESS: Your Apps Script is correctly updated and deployed!");
        } else if (response.data.message && response.data.message.includes("Invalid action")) {
            console.log("❌ FAILURE: Your Apps Script is still running an OLD VERSION.");
            console.log("FIX: In Google Apps Script Editor, go to Deploy > New Deployment, set to 'Anyone', and click Deploy.");
        } else {
            console.log("❓ UNKNOWN RESPONSE: Check the message above.");
        }
    } catch (error) {
        console.error("❌ CONNECTION ERROR:", error.message);
    }
};

testProxy();
