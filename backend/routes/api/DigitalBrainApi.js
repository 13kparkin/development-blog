const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

router.post("/", async (req, res) => {
  
  try {
    const { data, question } = req.body;

    const digitalBrainApiKey = process.env.DIGITAL_BRAIN_API_KEY;


    const response = await fetch(
      "https://your-digital-brain-production.up.railway.app/api/mainAnswer/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data,
          question,
          digitalBrainApiKey,
        }),
      }
    );
    const data1 = await response.json();

    if (response.ok) {
      return res.status(200).json(data1);
    } else {
      res.status(400);
      console.log("error", data1);
      return new Error(
        "There was a problem with the network",
        res.status(400).json(data1)
      );
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
