import axios from 'axios';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'; // Replace with the actual API endpoint
const API_KEY = 'AIzaSyDiKFjhUxxecysS4s9DpVXy9915Nbm8UIw'; // Replace with your API key
const YOUR_FACE_API_KEY = 'H7NEi0SQZdOfzTnvkSG5nGR1Z-awpahc';
const YOUR_FACE_API_SECRET = 'W_bIL8hNls2Sa44c_2RhnJITgVQVI2x9';
const OPENAI_API_KEY = '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'

export const sendMessageToGemini = async (message: string) => {
    try {
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${API_KEY}`,
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
        console.error('Error communicating with Gemini API:', error);
        throw error;
    }
};


const GEMINI_IMAGE_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

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
        formData.append('api_key', YOUR_FACE_API_KEY);
        formData.append('api_secret', YOUR_FACE_API_SECRET);
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
