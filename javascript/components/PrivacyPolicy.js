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

const PrivacyPolicy = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography variant="h4" style={{ marginBottom: 18 }}>
        Privacy Policy
      </Typography>
      <Typography variant="h6">DATA COLLECTION:</Typography>
      <Typography variant="body1" style={{ marginBottom: 18 }}>
        {" "}
        OPEN ACCESS DOES NOT COLLECT ANY USER DATA FOR THE PURPOSE OF SELLING
        THAT DATA TO ADVERTISERS. ALL DATA COLLECTED ARE EXPLICITLY VISIBLE ON
        THE SITE. THE SERVER MAY BE ABLE TO DETERMINE A VAGUE LOCATION SUCH AS
        YOUR COUNTRY BASED OFF OF YOU IP ADDRESS, BUT THAT IS OF NO INTEREST TO
        US AND WE DO NOT LOG IT. WHEN YOU DELETE YOUR ACCOUNT, ALL ASSOCIATED
        DATA IS DELETED PERMANENTLY AND CANNOT BE RETRIEVED.
      </Typography>
      <Typography variant="h6">COOKIES:</Typography>
      <Typography variant="body1" style={{ marginBottom: 18 }}>
        THIS SITE USES LOCAL STORAGE AND HTTP HEADERS TO AUTHENTICATE YOU AS A
        USER. DATA IS NOT STORED IN COOKIES, BUT STORED IN LOCAL BROSWER
        STORAGE.
      </Typography>
      <Typography variant="h6">EMAIL ADDRESS:</Typography>
      <Typography variant="body1" style={{ marginBottom: 18 }}>
        YOU DO NOT NEED TO VERIFY YOU EMAIL ADDRESS TO USE THIS NETWORK. YOU CAN
        RECEIVE PAYMENT RECEIPTS AND PASSWORD RESET FORMS VIA EMAIL, BUT IF THIS
        IS NOT SOMETHING YOU ARE INTERESTED IN THEN ENTER A FAKE ONE. IT WILL
        NOT BE PUBLICLY VISIBLE ANYWAYS
      </Typography>
      <Typography variant="h6">CREDIT CARD:</Typography>
      <Typography variant="body1">
        WE NEVER INTERACT DIRECTLY WITH ANY OF YOUR CREDIT CARD INFORMATION,
        BECAUSE WE USE THE TRUSTED 3RD PARTY PAYMENT PROVIDER <b>© STRIPE</b>.
      </Typography>
    </div>
  );
};

export default PrivacyPolicy;
