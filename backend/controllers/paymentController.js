require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  try {
    const { items, paymentMethod } = req.body;  

    const formattedItems = items.map((item) => {
      let itemPrice = Math.round(item.price * 100); 

      return {
        price_data: {
          currency: 'brl',
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: itemPrice,
        },
        quantity: item.quantity,
      };
    });


    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'boleto'],  
      line_items: formattedItems,
      mode: 'payment',
      success_url: 'http://localhost:4200/success',
      cancel_url: 'http://localhost:4200/cancel',
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Erro ao criar a sessão de pagamento:', error.message);
    console.error(error.stack); 
    res.status(500).send('Houve um problema ao criar a sessão de pagamento.');
  }
};

module.exports = {
  createCheckoutSession,
};
