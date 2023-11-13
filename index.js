const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const bodyParser = require("body-parser");
const stripe = require("stripe")(
  "sk_test_51O6nYhItZ2KKNkEeqrZdPwNc98CMTUxs9I4F4kp8hE8VqP6IuqEe4mmFYM5y3EsxbVzozetZjkEeYFPcpYvw7W3v00xrRIHuPO"
);

app.use(cors("*"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/payments/intent", async (req, res) => {
  console.log(req.body);

  const customer = await stripe.customers.create({ email: req?.body?.email });
  const params = {
    amount: req.body.amount,
    currency: "usd",
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
    },
  };
  try {
    const paymentIntent = await stripe.paymentIntents.create(params);

    res.json({ paymentIntent: paymentIntent.client_secret });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
