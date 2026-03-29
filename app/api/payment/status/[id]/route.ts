import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Payment ID required" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.ABACATEPAY_WEBHOOK_URL || "https://pix.abacatepay.com/v1";
    const apiKey = process.env.ABACATEPAY_API_KEY;

    const response = await fetch(`${baseUrl}/checkout/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Api-Key ${apiKey}`,
      },
    });

    const data = await response.json();

    const status = data.status || data.paymentStatus;
    
    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        status: status,
        amount: data.value ? data.value / 100 : data.amount,
        paidAt: data.paidAt || data.paymentDate,
      },
    });

  } catch (error) {
    console.error("Error checking payment status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check payment status" },
      { status: 500 }
    );
  }
}
