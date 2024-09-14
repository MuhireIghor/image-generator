const express = require("express");
const multer = require("multer");
const axios = require("axios");
const cors = require("cors");
const FormData = require("form-data");
const fs = require("fs");

const app = express();
const port = 5000;
app.use(express.json());
app.use(cors({ origin: "*" }))

// Set up Multer for file handling
const upload = multer({ dest: "uploads/" });

// POST route to handle file upload and expression generation
app.post("/generate-expression", upload.single("file"), async (req, res) => {
    const { file } = req;
    const { expression } = req.body;

    // Create a form data object
    const formData = new FormData();
    formData.append("file", fs.createReadStream(file.path));
    formData.append("expression", expression);

    try {
        // Call your Python service to interact with OpenAI API here
        const response = await axios.post("http://localhost:8000/generate-expression", formData, {
            headers: formData.getHeaders(),
        });

        // Clean up uploaded file
        fs.unlinkSync(file.path);

        // Send the generated image URL back to the React frontend
        res.json({ imageUrl: response.data.imageUrl });
    } catch (error) {
        console.log('error occured',error);
        res.status(500).send("Error generating image");
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
