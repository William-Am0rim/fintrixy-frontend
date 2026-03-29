import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { amount, plan } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid amount" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.ABACATEPAY_WEBHOOK_URL || "https://pix.abacatepay.com/v1";
    const apiKey = process.env.ABACATEPAY_API_KEY;
    
    const webhookUrl = `${request.nextUrl.origin}/api/payment/webhook`;
    const returnUrl = `${request.nextUrl.origin}/payment/success?session_id={checkoutId}`;

    const response = await fetch(`${baseUrl}/checkout/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Api-Key ${apiKey}`,
      },
      body: JSON.stringify({
        name: "Fintrixy Pro",
        description: `Plano Pro - Assinatura Mensal - R$ ${amount.toFixed(2)}`,
        value: amount * 100,
        callbackUrl: webhookUrl,
        returnUrl: returnUrl,
        customer: {
          email: session.user.email,
          name: session.user.name || session.user.email,
        },
        items: [
          {
            name: "Plano Pro Fintrixy",
            value: amount * 100,
            amount: 1,
          }
        ],
        paymentMethods: ["PIX"],
        maxInstallments: 1,
      }),
    });

    const data = await response.json();

    if (data.id) {
      const checkoutUrl = data.url || `https://pix.abacatepay.com/checkout/${data.id}`;
      
      return NextResponse.json({
        success: true,
        data: {
          id: data.id,
          url: checkoutUrl,
          brCode: data.brCode,
        },
      });
    }

    return NextResponse.json({
      success: false,
      error: data.message || "Failed to create payment",
    }, { status: 400 });

  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
