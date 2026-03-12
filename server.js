const express = require("express");
const bodyParser = require("body-parser");
const { ElevenLabsClient } = require("elevenlabs");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const elevenlabs = new ElevenLabsClient({
  apiKey: "d57ed36c45110623212ad8e71de28f8790b76f2f9b362f03bf4bd65cf66da1de"
});

// Agent routing table
const AGENT_IDS = {
  "1": "agent_9501khzsgfhtfqdb4hfmxsaxnq9k",
  "2": "agent_3601khzhq94re87848e4p0j7p3b9"
};

app.post("/ivr-handler", async (req, res) => {

  const digitPressed = req.body.Digits;
  const fromNumber = req.body.From;
  const toNumber = req.body.To;

  const agentId = AGENT_IDS[digitPressed];

  if (!agentId) {
    return res.send(`
<Response>
<Say>Invalid option. Please try again.</Say>
</Response>
`);
  }

  try {

    const twiml = await elevenlabs.conversational_ai.registerCall({
      agent_id: agentId,
      from_number: fromNumber,
      to_number: toNumber
    });

    res.set("Content-Type", "text/xml");
    res.send(twiml);

  } catch (error) {

    res.send(`
<Response>
<Say>Sorry, something went wrong.</Say>
</Response>
`);

  }

});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});