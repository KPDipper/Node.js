const stripe= require('stripe')(process.env.STRIPE_SECRET_KEY)


//payment process

exports.processPayment = async(req,res)=>{

    //paymentIntents/payment  is stripe function
    const paymentIntent= await stripe.paymentIntents.create({//paymenyt tai k ma accept garn bhanera//frontend bata collect garna ko lagi use bhuncha
        amount:req.body.amount,
        currency:"npr",
       metadata:{integration_check:"accept_a_payment"}//payment accept garna ko lagi//yo amount ra currency front bata aucha
    })//paymentIntent tai s tripe ko function
    //payment accept garna ko lagi

    res.status(200).json({//yo tai frontend ma pathune ho
        success:true,
        client_secret: paymentIntent.client_secret
        //payment scuees bhaye pachi pathune yedi payment sucess bhyo bhane yo jancha 
    })

}

//send stripe key to frontend to connect to frontend
//yedi pay success  bhyo bhane yo call huncha
exports.sendStripeKey= async( req,res)=>{

    res.status(200).json({
        success:true,
        stripeAPIKey: process.env.STRIPE_API_KEY
    })
}
