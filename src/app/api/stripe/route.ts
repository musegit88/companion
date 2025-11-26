import { auth, currentUser } from "@clerk/nextjs";
import db from "@/lib/prismaDb";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = auth();
    const user = await currentUser();
    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // If user have active subscription redirect to billing portal

    const userSubscription = await db.userSubscription.findUnique({
      where: {
        userId: userId,
      },
    });

    if (userSubscription && userSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: `${process.env.NEXT_PUBLIC_URL}`,
      });
      return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    }

    // First time subscribing

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: `${process.env.NEXT_PUBLIC_URL}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}`,
      payment_method_types: ["card", "amazon_pay", "cashapp", "wechat_pay"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "Companion Plus",
              description: "Create Custom AI companions",
            },
            unit_amount: 1299,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
    });
    return new NextResponse(JSON.stringify({ url: stripeSession.url }));
  } catch (error) {
    console.log("STRIPE_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
