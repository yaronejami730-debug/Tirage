/** @jsxRuntime classic */
/** @jsx React.createElement */
import React from "react";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { renderToBuffer, Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#F8F9FF",
    fontFamily: "Helvetica",
  },
  header: {
    backgroundColor: "#6C5CE7",
    padding: "36 40 28 40",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  brandName: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  badge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.5,
  },
  headerSub: {
    fontSize: 10,
    color: "rgba(255,255,255,0.75)",
  },
  body: {
    padding: "24 40 36 40",
  },
  statusBar: {
    backgroundColor: "#00B894",
    borderRadius: 8,
    padding: "10 16",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 8,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#ffffff",
  },
  statusText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    letterSpacing: 0.3,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: "18 22",
    marginBottom: 12,
  },
  cardAccent: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: "18 22",
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#6C5CE7",
    borderLeftStyle: "solid",
  },
  cardLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.5,
    marginBottom: 5,
    textTransform: "uppercase",
  },
  cardTitle: {
    fontSize: 17,
    fontFamily: "Helvetica-Bold",
    color: "#2D3436",
    marginBottom: 2,
  },
  cardSub: {
    fontSize: 9,
    color: "#636E72",
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  halfCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: "16 18",
  },
  ticketSection: {
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    padding: "18 22",
    marginBottom: 12,
  },
  ticketLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#B45309",
    letterSpacing: 1.5,
    marginBottom: 12,
    textTransform: "uppercase",
  },
  ticketGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  ticketBadge: {
    backgroundColor: "#FDCB6E",
    borderRadius: 10,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  ticketNum: {
    fontSize: 17,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  legalBox: {
    backgroundColor: "#f0eeff",
    borderRadius: 10,
    padding: "12 16",
    marginBottom: 20,
  },
  legalTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#6C5CE7",
    letterSpacing: 1,
    marginBottom: 4,
  },
  legalText: {
    fontSize: 7,
    color: "#636E72",
    lineHeight: 1.5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e0d9ff",
    borderTopStyle: "solid",
    paddingTop: 12,
  },
  footerText: {
    fontSize: 7,
    color: "#b2bec3",
  },
  footerBrand: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#6C5CE7",
  },
});

function TicketPDF({
  prenom, nom, email, quantite, ticketNumbers, createdAt,
  lotNom, lotReference, prixTicket,
}: {
  prenom: string; nom: string; email: string; quantite: number;
  ticketNumbers: number[]; createdAt: string;
  lotNom: string; lotReference: string; prixTicket: number;
}) {
  const dateAchat = new Date(createdAt).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
  const total = (prixTicket * quantite).toFixed(2);

  return (
    <Document title={`GoWinGo - Ticket ${lotReference}`} author="GoWinGo">
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.brandName}>GoWinGo</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>TICKET OFFICIEL</Text>
            </View>
          </View>
          <Text style={styles.headerSub}>Participation confirmée • {dateAchat}</Text>
        </View>

        <View style={styles.body}>

          {/* Status */}
          <View style={styles.statusBar}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Participation validée — Paiement confirmé par Stripe</Text>
          </View>

          {/* Lot */}
          <View style={styles.cardAccent}>
            <Text style={[styles.cardLabel, { color: "#6C5CE7" }]}>Lot à remporter</Text>
            <Text style={styles.cardTitle}>{lotNom}</Text>
            <Text style={styles.cardSub}>Référence : {lotReference}</Text>
          </View>

          {/* Participant + Date */}
          <View style={styles.row}>
            <View style={styles.halfCard}>
              <Text style={[styles.cardLabel, { color: "#6C5CE7" }]}>Participant</Text>
              <Text style={[styles.cardTitle, { fontSize: 14 }]}>{prenom} {nom}</Text>
              <Text style={styles.cardSub}>{email}</Text>
            </View>
            <View style={styles.halfCard}>
              <Text style={[styles.cardLabel, { color: "#E17055" }]}>Achat</Text>
              <Text style={[styles.cardTitle, { fontSize: 14 }]}>{dateAchat}</Text>
              <Text style={styles.cardSub}>{quantite} ticket{quantite > 1 ? "s" : ""} × {prixTicket.toFixed(2)} € = {total} €</Text>
            </View>
          </View>

          {/* Ticket numbers */}
          <View style={styles.ticketSection}>
            <Text style={styles.ticketLabel}>
              Vos {ticketNumbers.length} numéro{ticketNumbers.length > 1 ? "s" : ""} de ticket{ticketNumbers.length > 1 ? "s" : ""} officiels
            </Text>
            <View style={styles.ticketGrid}>
              {ticketNumbers.map((n) => (
                <View key={n} style={styles.ticketBadge}>
                  <Text style={styles.ticketNum}>{n}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Legal */}
          <View style={styles.legalBox}>
            <Text style={styles.legalTitle}>MENTION LÉGALE</Text>
            <Text style={styles.legalText}>
              Le tirage au sort sera effectué par un organisme externe indépendant (huissier de justice).
              Conservez ce document comme preuve de participation. Les résultats vous seront communiqués par email.
              Jeu ouvert aux personnes majeures. Toute participation est définitive.
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Généré le {dateAchat}</Text>
            <Text style={styles.footerBrand}>gowingo.fr</Text>
            <Text style={styles.footerText}>Paiement sécurisé Stripe</Text>
          </View>

        </View>
      </Page>
    </Document>
  );
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "session_id requis" }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const { data: participation, error } = await supabase
    .from("participations")
    .select("*, lots(nom, reference_lot, prix_ticket)")
    .eq("stripe_session_id", sessionId)
    .eq("statut", "confirme")
    .single();

  if (error || !participation) {
    return NextResponse.json({ error: "Participation introuvable" }, { status: 404 });
  }

  const lot = participation.lots as { nom: string; reference_lot: string; prix_ticket: number };

  try {
    const buffer = await renderToBuffer(
      <TicketPDF
        prenom={participation.prenom}
        nom={participation.nom}
        email={participation.email}
        quantite={participation.quantite}
        ticketNumbers={participation.ticket_numbers ?? []}
        createdAt={participation.created_at}
        lotNom={lot.nom}
        lotReference={lot.reference_lot}
        prixTicket={Number(lot.prix_ticket)}
      />
    );

    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="GoWinGo-Ticket-${lot.reference_lot}.pdf"`,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("PDF render error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
