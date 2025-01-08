import axios from "axios";

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
                "Content-Type": "multipart/form-data",
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

    const encryptedData = response.data.encryptedOtp; // Access the encrypted OTP
    const key = encryptedData.substring(0, 32); // Extract the key (first 32 characters)
    const encryptedText = encryptedData.substring(32); // Extract the encrypted text
    const decryptedOtp = decryptToString(encryptedText, key); // Decrypt the OTP
    response.data.decryptedOtp = decryptedOtp;
    return response.data; // Return the response data
};

// Function to decrypt a string
const decryptToString = (encryptedText, key) => {
    try {
        const encryptedBytes = Uint8Array.from(atob(encryptedText), (char) =>
            char.charCodeAt(0)
        ); // Decode Base64 into a byte array
        const decryptedBytes = xorCipher(encryptedBytes, new TextEncoder().encode(key));
        return new TextDecoder().decode(decryptedBytes).replace(/\0+$/, ""); // Decode bytes to string and trim null characters
    } catch (error) {
        console.error("Error during decryption:", error);
        throw new Error("Failed to decrypt text.");
    }
};

// XOR cipher function
const xorCipher = (inputBytes, keyBytes) => {
    const result = new Uint8Array(inputBytes.length);
    for (let i = 0; i < inputBytes.length; i++) {
        result[i] = inputBytes[i] ^ keyBytes[i % keyBytes.length]; // XOR operation
    }
    return result;
};

{/*function formatKeyToPem(key) {
    return `-----BEGIN PRIVATE KEY-----\n${key}\n-----END PRIVATE KEY-----`;
}

function decryptMessage(encryptedMessage, key) {
    const privateKey = forge.pki.privateKeyFromPem(key); // Convert PEM to private key
    return forge.util.decodeUtf8(
        privateKey.decrypt(forge.util.decode64(encryptedMessage), "RSA-OAEP", {
            md: forge.md.sha256.create(),
        })
    );
}*/}