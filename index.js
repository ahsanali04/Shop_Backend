import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const customer = await stripe.customers.create();
      const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: '2023-10-16' }
      );
      const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'usd',
        customer: customer.id,
        automatic_payment_methods: {
          enabled: true,
        },
      });
      res.json({
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}