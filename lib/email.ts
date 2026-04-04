import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendConfirmationEmailParams {
  to: string;
  prenom: string;
  nom: string;
  lotNom: string;
  lotReference: string;
  ticketNumbers: number[];
  quantite: number;
  prixTotal: number;
}

export async function sendConfirmationEmail({
  to,
  prenom,
  nom,
  lotNom,
  lotReference,
  ticketNumbers,
  quantite,
  prixTotal,
}: SendConfirmationEmailParams) {
  const ticketList = ticketNumbers
    .map((n) => `<span style="display:inline-block;background:#7c3aed;color:white;padding:2px 10px;border-radius:20px;margin:3px;font-weight:bold;">#${n}</span>`)
    .join(" ");

  const subject = `Vos tickets pour ${lotNom} - Référence ${lotReference}`;

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f3ff;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f3ff;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.07);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:40px;text-align:center;">
              <h1 style="color:white;margin:0;font-size:28px;letter-spacing:-0.5px;">Tirage</h1>
              <p style="color:#ddd6fe;margin:8px 0 0;font-size:15px;">Confirmation de participation</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="color:#374151;font-size:16px;margin:0 0 20px;">Bonjour <strong>${prenom} ${nom}</strong>,</p>

              <p style="color:#374151;font-size:16px;margin:0 0 24px;">
                Votre participation au tirage a bien été enregistrée. Voici le récapitulatif de votre achat :
              </p>

              <!-- Lot Info Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ff;border-radius:8px;margin-bottom:28px;">
                <tr>
                  <td style="padding:24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;">
                          <span style="color:#6b7280;font-size:14px;">Lot</span><br>
                          <strong style="color:#111827;font-size:16px;">${lotNom}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;border-top:1px solid #e5e7eb;">
                          <span style="color:#6b7280;font-size:14px;">Référence du lot</span><br>
                          <strong style="color:#7c3aed;font-size:16px;font-family:monospace;">${lotReference}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;border-top:1px solid #e5e7eb;">
                          <span style="color:#6b7280;font-size:14px;">Nombre de tickets</span><br>
                          <strong style="color:#111827;font-size:16px;">${quantite} ticket${quantite > 1 ? "s" : ""}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;border-top:1px solid #e5e7eb;">
                          <span style="color:#6b7280;font-size:14px;">Montant total payé</span><br>
                          <strong style="color:#111827;font-size:16px;">${prixTotal.toFixed(2)} €</strong>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Ticket Numbers -->
              <div style="margin-bottom:28px;">
                <h3 style="color:#111827;font-size:18px;margin:0 0 16px;">Vos numéros de tickets</h3>
                <div style="background:#f9fafb;border:2px dashed #c4b5fd;border-radius:8px;padding:20px;text-align:center;">
                  ${ticketList}
                </div>
              </div>

              <p style="color:#374151;font-size:15px;margin:0 0 24px;">
                Conservez bien cet email, il vous servira de preuve de participation lors du tirage.
              </p>

              <!-- Legal Notice -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef3c7;border-left:4px solid #f59e0b;border-radius:4px;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px;">
                    <p style="color:#92400e;font-size:13px;margin:0;line-height:1.6;">
                      <strong>Mention légale :</strong> Le tirage sera effectué par un organisme externe indépendant.
                      Les résultats seront communiqués par email aux participants.
                      Toute participation est définitive et non remboursable sauf annulation de l'événement.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="color:#6b7280;font-size:14px;margin:0;">
                Bonne chance !<br>
                <strong style="color:#7c3aed;">L'équipe Tirage</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:24px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="color:#9ca3af;font-size:12px;margin:0;">
                Cet email a été envoyé automatiquement suite à votre achat.
                Merci de ne pas y répondre directement.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
Bonjour ${prenom} ${nom},

Votre participation au tirage a bien été enregistrée.

Lot : ${lotNom}
Référence : ${lotReference}
Nombre de tickets : ${quantite}
Montant total : ${prixTotal.toFixed(2)} €

Vos numéros de tickets : ${ticketNumbers.map((n) => `#${n}`).join(", ")}

Conservez bien cet email, il vous servira de preuve de participation lors du tirage.

Mention légale : Le tirage sera effectué par un organisme externe indépendant.

Bonne chance !
L'équipe Tirage
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: "Tirage <noreply@tirage.fr>",
      to,
      subject,
      html,
      text,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return data;
  } catch (err) {
    console.error("Email send failed:", err);
    throw err;
  }
}
