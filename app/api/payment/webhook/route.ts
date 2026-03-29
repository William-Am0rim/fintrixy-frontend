import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("Webhook received:", body);

    const eventType = body.event || body.type;
    const paymentId = body.id || body.paymentId || body.checkoutId;
    const status = body.status || body.paymentStatus;

    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: "Missing payment ID" },
        { status: 400 }
      );
    }

    if (eventType === "payment.completed" || status === "PAID" || status === "COMPLETED") {
      const apiResponse = await fetch(`${API_URL}/payment/webhook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId,
          status: "PAID",
          event: eventType,
        }),
      });

      const result = await apiResponse.json();
      console.log(`Payment ${paymentId} processed:`, result);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
