const envvar = require("envvar");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const moment = require("moment");
const plaid = require("plaid");

const APP_PORT = envvar.number("APP_PORT", 8000);
const PLAID_CLIENT_ID = envvar.string("PLAID_CLIENT_ID");
const PLAID_SECRET = envvar.string("PLAID_SECRET");
const PLAID_PUBLIC_KEY = envvar.string("PLAID_PUBLIC_KEY");
const PLAID_ENV = envvar.string("PLAID_ENV", "sandbox");

let ACCESS_TOKEN = null;
let PUBLIC_TOKEN = null;
let ITEM_ID = null;

// Initialize client

const client = new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  plaid.environments[PLAID_ENV]
);

const app = express();

app.use(cors());

app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

app.get("/", function(request, response, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  response.send("fooRoot", {
    PLAID_PUBLIC_KEY: PLAID_PUBLIC_KEY,
    PLAID_ENV: PLAID_ENV
  });
});

app.post("/get_access_token", function(request, response, next) {
  //response.header("Access-Control-Allow-Origin", "http://localhost:3000");
  PUBLIC_TOKEN = request.body.public_token;
  console.log("public token: ", PUBLIC_TOKEN);
  client.exchangePublicToken(PUBLIC_TOKEN, function(error, tokenResponse) {
    if (error != null) {
      console.error(error);
      var msg = "Could not exchange public_token!";
      console.log(msg + "\n" + error);
      return response.json({
        error: msg
      });
    }
    ACCESS_TOKEN = tokenResponse.access_token; // access token for this specific bank
    ITEM_ID = tokenResponse.item_id; // item corresponds to the bank
    console.log("Access Token: " + ACCESS_TOKEN);
    console.log("Item ID: " + ITEM_ID);
    response.json({
      error: false
    });
  });
});

app.get("/accounts", function(request, response, next) {
  // Retrieve high-level account information and account and routing numbers
  // for each account associated with the Item.
  console.log("requesting accounts");
  client.getAuth(ACCESS_TOKEN, function(error, authResponse) {
    if (error != null) {
      let msg = "Unable to pull accounts from the Plaid API.";
      console.log(error);
      console.log(msg + "\n" + error);
      return response.json({
        error: msg
      });
    }

    console.log(authResponse.accounts);
    response.json({
      error: false,
      accounts: authResponse.accounts,
      numbers: authResponse.numbers
    });
  });
});

app.post("/item/public_token/create", function(request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  client.createPublicToken(ACCESS_TOKEN, (err, result) => {
    if (err) {
      console.error(err);
    }
    //console.log(result);
    const publicToken = result.public_token;
  });
});
app.post("/item", function(request, response, next) {
  // Pull the Item - this includes information about available products,
  // billed products, webhook information, and more.
  client.getItem(ACCESS_TOKEN, function(error, itemResponse) {
    if (error != null) {
      console.log(JSON.stringify(error));
      return response.json({
        error: error
      });
    }
    console.log("itemResponse: ", itemResponse);

    // Also pull information about the institution
    client.getInstitutionById(itemResponse.item.institution_id, function(
      err,
      instRes
    ) {
      if (err != null) {
        let msg = "Unable to pull institution information from the Plaid API.";
        console.log(msg + "\n" + error);
        return response.json({
          error: msg
        });
      } else {
        response.json({
          item: itemResponse.item,
          institution: instRes.institution
        });
      }
    });
  });
});

app.post("/transactions", function(request, response, next) {
  // Pull transactions for the Item for the last 30 days
  let startDate = moment()
    .subtract(30, "days")
    .format("YYYY-MM-DD");
  let endDate = moment().format("YYYY-MM-DD");
  client.getTransactions(
    ACCESS_TOKEN,
    startDate,
    endDate,
    {
      count: 250,
      offset: 0
    },
    function(error, transactionsResponse) {
      if (error != null) {
        console.log(JSON.stringify(error));
        return response.json({
          error: error
        });
      }
      console.log(
        "pulled " + transactionsResponse.transactions.length + " transactions"
      );
      response.json(transactionsResponse);
    }
  );
});

const server = app.listen(APP_PORT, function() {
  console.log("Plaid server listening on port:  " + APP_PORT);
});
