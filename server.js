const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

// Agent routing
const AGENT_IDS = {
  "1": "agent_9501khzsgfhtfqdb4hfmxsaxnq9k",
  "2": "agent_3601khzhq94re87848e4p0j7p3b9"
};

// health route
app.get("/", (req, res) => {
  res.send("Korvage IVR server running");
});

app.post("/ivr-handler", (req, res) => {

  const digit = req.body.Digits;

  const agent = AGENT_IDS[digit];

  if (!agent) {
    return res.type("text/xml").send(`
<Response>
<Say>Invalid option. Please try again.</Say>
</Response>
`);
  }

  res.type("text/xml").send(`
<Response>
<Dial callerId="+14753236519">
<Sip>sip:${agent}@sip.rtc.elevenlabs.io</Sip>
</Dial>
</Response>
`);

});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
