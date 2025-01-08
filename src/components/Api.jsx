import axios from "axios";
import forge from "node-forge";



// Function to handle login
export const loginApi = async (url, credentials) => {
        const response = await axios.post(`https://localhost:7031/api/${url}`, credentials);
        return response.data; // Return the response data if needed
};

// Function to handle adding a student
export const addApi = async (url, credentials) => {
     const accesstoken = localStorage.getItem("accesstoken");
    const response = await axios.post(
        `https://localhost:7031/api/${url}`,
        credentials,
        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${accesstoken}`,
            },
        }
    );
    //console.log(response.data);  // Log the response for debugging
    return response.data;// Return the response data
};

// Function to handle getting a student
export const getApi = async (url) => {
    const accesstoken = localStorage.getItem("accesstoken");
        const response = await axios.get(`https://localhost:7031/api/${url}`, {
            headers: {
                Authorization: `Bearer ${accesstoken}`,
            },
        });
        //console.log(response);
        return response.data;
};

export const deleteApi = async (url, credentials) => {
    const accesstoken = localStorage.getItem("accesstoken");
    const response = await axios.delete(`https://localhost:7031/api/${url}`, {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${accesstoken}`,
        },
        data: credentials, // Pass the credentials in the `data` property
    });
    //console.log("API response:", response.data);
    return response.data;
};

export const registerApi = async (url, credentials) => {
   const response = await axios.post(
       `https://localhost:7031/api/${url}`,
       credentials,
       {
           headers: {
               "Content-Type": "application/json",
               Accept: "application/json",
           },
       }
   );
    //console.log(response.data);  // Log the response for debugging
   return response.data;// Return the response data
};

export const generateOtpApi = async (url, credentials) => {
    const response = await axios.post(
        `https://localhost:7031/api/${url}`,
        credentials,
        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        }
    );

    const encryptedData = response.data.encryptedOtp.result; // Accessing result
    const privatekey1 = formatKeyToPem(response.data.encryptedKey); // Format the key to PEM
    const decryptedOtp = decryptMessage(encryptedData, privatekey1); 
    response.data.decryptedOtp = decryptedOtp;
    return response.data; // Return the response data
};

function formatKeyToPem(key) {
    return `-----BEGIN PRIVATE KEY-----\n${key}\n-----END PRIVATE KEY-----`;
}

function decryptMessage(encryptedMessage, key) {
    const privateKey = forge.pki.privateKeyFromPem(key); // Convert PEM to private key
    return forge.util.decodeUtf8(
        privateKey.decrypt(forge.util.decode64(encryptedMessage), "RSA-OAEP", {
            md: forge.md.sha256.create(),
        })
    );
}