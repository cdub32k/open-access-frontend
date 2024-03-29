import React from "react";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    maxWidth: 888,
    padding: 12,
  },
}));

const Terms = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography variant="h4" style={{ marginBottom: 18 }}>
        Terms of Service
      </Typography>
      <Typography variant="body1">
        THE SOCIAL NETWORK IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
        EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
        ENJOYABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
        NO EVENT SHALL THE AUTHORS OR ADMINISTRATORS BE LIABLE FOR ANY CLAIM,
        DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
        OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THIS SOCIAL
        NETWORK OR THE USE OR OTHER DEALINGS IN THE SOCIAL NETWORK.
      </Typography>
      <br />
      <Typography variant="body1">
        ALL WORKS POSTED BY MEMBERS MUST BE THEIR OWN ORIGINAL CREATION. WE DO
        NOT CENSOR THE TYPE OF CONTENT POSTED TO THIS NETWORK, HOWEVER{" "}
        <b>
          WE WILL REPORT ANY CRIMINAL ACTIVITY WHICH INCLUDES COPYRIGHT
          VIOLATIONS AND PIRACY.
        </b>
      </Typography>
    </div>
  );
};

export default Terms;
