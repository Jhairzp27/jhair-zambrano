import { NextResponse } from "next/server";
import { Resend } from "resend";


export async function POST(request: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    // 1. Extraemos los datos que el usuario llenó en el formulario
    const body = await request.json();
    const { name, email, message } = body;

    // 2. Validación básica de seguridad
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 },
      );
    }

    const data = await resend.emails.send({
      from: "Portafolio Contacto <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL as string, //Correo
      subject: `Nuevo mensaje de portafolio de: ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2>Tienes un nuevo mensaje de tu Portafolio (Jhair Zambrano)</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email del contacto:</strong> ${email}</p>
          <hr />
          <h3>Mensaje:</h3>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error enviando el correo:", error);
    return NextResponse.json(
      { error: "Hubo un error al enviar el mensaje" },
      { status: 500 },
    );
  }
}
