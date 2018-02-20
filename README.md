# WallET

### What is the purpose of this application?

More than half of American's have less than $10,000 in savings, and a large portion of those would not be able to come up with $2,000 if there was an emergency. Despite this, we still continue to consume at a high rate, often financing this consumption through debt.

This application couples your spending habits with your savings habits! Every time you make a purchase, we round it up to the nearest dollar and save the money in a separate account!

### Whats on the roadmap?

Eventually, users will be able to set up recurring deposits, and set up "buckets" that each respective addition to the overall pool is distributed amongst. You can then set "withdrawl" dates that lock the funds until a set date. If you take money out early, you lose a portion of it - so remember to save responsibly. 

PRs welcome.

# How to Start Server

Navigate to root directory, then:

APP_PORT=8000 /\
PLAID_CLIENT_ID=#### /\
PLAID_SECRET=#### /\
PLAID_PUBLIC_KEY=#### /\
PLAID_ENV=sandbox /\
node server.js
