import axios from 'axios';
import Config from "react-native-config";
export const sendMessageToGemini = async (message: string) => {
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${Config?.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        role: 'user',
                        parts: [
                            {
                                text: message,
                            },
                        ],
                    },
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error communicating with Gemini API:', error?.response);
        throw error;
    }
};


const GEMINI_IMAGE_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${Config?.GEMINI_API_KEY}`;

export const sendImageToGemini = async (base64Image: string): Promise<string> => {
    try {
        const requestBody = {
            contents: [
                {
                    parts: [
                        { text: "Describe the image in detail." },
                        { inline_data: { mime_type: "image/jpeg", data: base64Image } }
                    ]
                }
            ]
        };
        const response = await axios.post(GEMINI_IMAGE_API_URL, requestBody, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data.candidates[0]?.content?.parts[0]?.text || "No description available.";
    } catch (error) {
        console.error("Error describing image:", error);
        return "Failed to describe image.";
    }
};
export const compareFaces = async (base64Image1: string, base64Image2: string) => {
    try {
        const formData = new FormData();
        formData.append('api_key', Config?.YOUR_FACE_API_KEY);
        formData.append('api_secret', Config?.YOUR_FACE_API_SECRET);
        formData.append('image_base64_1', base64Image1);
        formData.append('image_base64_2', base64Image2);

        const response = await axios.post(
            'https://api-us.faceplusplus.com/facepp/v3/compare',
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
            }
        );
        return response.data.confidence; // Match percentage (0-100)
    } catch (error) {
        console.error('Face++ API Error:', error);
        throw error;
    }
};
