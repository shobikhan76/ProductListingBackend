import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY;
let stripe = null;

if (stripeKey) {
  stripe = new Stripe(stripeKey, {
    apiVersion: "2022-11-15",
  });
} else {
  // Don't throw at import time — log a warning so serverless functions
  // that don't use Stripe can still start. Ensure you set the key in
  // Vercel dashboard (`STRIPE_SECRET_KEY`) for production.
  console.warn("STRIPE_SECRET_KEY is not set. Stripe features are disabled.");
}

export default stripe;
