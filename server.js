const express = require("express");
const bodyParser = require("body-parser");
const { ElevenLabsClient } = require("elevenlabs");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

// Use environment variable for API key (set this in Render)
const elevenlabs = new ElevenLabsClient({
  apiKey: "d57ed36c45110623212ad8e71de28f8790b76f2f9b362f03bf4bd65cf66da1de"
});

// Agent routing
const AGENT_IDS = {
  "1": "agent_9501khzsgfhtfqdb4hfmxsaxnq9k",
  "2": "agent_3601khzhq94re87848e4p0j7p3b9"
};

// Test route
app.get("/", (req, res) => {
  res.send("Korvage IVR server running");
});

// IVR handler
app.post("/ivr-handler", async (req, res) => {
  try {
    const digitPressed = req.body.Digits;
    const fromNumber = req.body.From;
    const toNumber = req.body.To;

    console.log("Digit pressed:", digitPressed);
    console.log("From:", fromNumber);
    console.log("To:", toNumber);

    const agentId = AGENT_IDS[digitPressed];

    if (!agentId) {
      console.log("Invalid digit pressed");
      return res.type('text/xml').send(`
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Invalid option. Please try again.</Say>
</Response>
`);
    }

    console.log("Registering call with agent:", agentId);

    const twiml = await elevenlabs.conversationalAi.registerCall({
      agent_id: agentId,
      from_number: fromNumber,
      to_number: toNumber
    });

    console.log("TwiML received:", twiml);
    res.type('text/xml').send(twiml);

  } catch (error) {
    console.error("Error details:", error);
    console.error("Error message:", error.message);
    console.error("Error response:", error.response?.data);

    res.type('text/xml').send(`
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Sorry, something went wrong connecting the assistant.</Say>
</Response>
`);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
