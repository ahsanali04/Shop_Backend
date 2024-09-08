import express from 'express';
const app = express()
import Stripe from 'stripe';
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.SECRET_KEY)



const port = process.env.PORT;


app.get('/payment/intents',async(req,res)=>{
    const customer =  await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
        {customer: customer.id},
        {apiVersion: '2023-10-16'}
    );
   try{
    const paymentIntent = await stripe.paymentIntents.create({
        amount:req.body.amount,
        currency:'usd',
        customer:customer.id,
        automatic_payment_methods:{
            enabled: true,
        },
    });
    res.json({
        paymentIntent:paymentIntent.client_secret,
        ephemeralKey:ephemeralKey.secret,
        customer:customer.id,
    })
   }catch(error){
    res.status(400).json({
        error:error.message,
    })
   }
})

app.listen(port,()=>{
    console.log(`App is listening on port ${port}`)
})