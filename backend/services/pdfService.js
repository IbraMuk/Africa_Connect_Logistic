const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

class PDFService {
  getLogoPath() {
    try {
      const logoPaths = [
        path.join(__dirname, "..", "..", "frontend", "public", "images", "logo.png"),
        path.join(__dirname, "..", "..", "frontend", "public", "images", "logo.jpg"),
        path.join(__dirname, "..", "..", "frontend", "public", "images", "logo.jpeg"),
        path.join(__dirname, "..", "public", "images", "logo.png"),
      ];
      for (const logoPath of logoPaths) {
        if (fs.existsSync(logoPath)) {
          return "file:///" + logoPath.replace(/\\/g, "/");
        }
      }
      return null;
    } catch (error) {
      console.warn("Logo non trouvé:", error.message);
      return null;
    }
  }

  async generateFacturePDF(facture) {
    try {
      const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--allow-file-access-from-files", "--disable-web-security"],
      });
      const page = await browser.newPage();
      const html = this.generateFactureHTML(facture);
      await page.setContent(html, { waitUntil: "networkidle0" });
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
      });
      await browser.close();
      return pdfBuffer;
    } catch (error) {
      console.error("Erreur génération PDF:", error);
      throw error;
    }
  }

  generateFactureHTML(facture) {
    const logoSrc = this.getLogoPath();

    const logoBlock = logoSrc
      ? `<img src="${logoSrc}" alt="Africa Connect Logistic" style="height:56px;width:auto;object-fit:contain;display:block;" />`
      : `<div style="width:48px;height:48px;background:linear-gradient(135deg,#2563eb,#4f46e5);border-radius:12px;display:table-cell;vertical-align:middle;text-align:center;">
             <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
             </svg>
           </div>`;

    const safeDate = (d) => {
      try { return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }); }
      catch { return d || "—"; }
    };

    const dateFacture = safeDate(facture.datefacture || facture.dateFacture);
    const dateEcheance = safeDate(facture.dateecheance || facture.dateEcheance);
    const montant = parseFloat(facture.montant) || 0;

    const services = Array.isArray(facture.services) ? facture.services : [];

    const statutConfig = {
      "Payée":     { bg: "#d1fae5", color: "#065f46", label: "PAYÉE",      dot: "#10b981" },
      "En attente":{ bg: "#fef3c7", color: "#92400e", label: "EN ATTENTE", dot: "#f59e0b" },
      "En retard": { bg: "#fee2e2", color: "#991b1b", label: "EN RETARD",  dot: "#ef4444" },
      "Annulée":   { bg: "#f3f4f6", color: "#374151", label: "ANNULÉE",    dot: "#6b7280" },
    };
    const st = statutConfig[facture.statut] || statutConfig["En attente"];

    const watermark = facture.statut === "Payée"
      ? `<div style="position:absolute;top:40%;left:50%;transform:translate(-50%,-50%) rotate(-35deg);font-size:120px;font-weight:900;color:rgba(16,185,129,0.06);letter-spacing:4px;white-space:nowrap;z-index:0;pointer-events:none;font-family:Arial,sans-serif;">PAYEE</div>`
      : "";

    let rowsHTML = "";
    services.forEach((s, i) => {
      const total = (parseFloat(s.quantite) || 0) * (parseFloat(s.prix) || 0);
      const bg = i % 2 === 0 ? "#ffffff" : "#f8fafc";
      rowsHTML += `
        <tr style="background:${bg};">
          <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#1e293b;">${s.description || "—"}</td>
          <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;font-size:13px;text-align:center;color:#475569;">${s.quantite || 1}</td>
          <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;font-size:13px;text-align:right;color:#475569;">${(parseFloat(s.prix) || 0).toFixed(2)} $</td>
          <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;font-size:13px;text-align:right;font-weight:600;color:#1e293b;">${total.toFixed(2)} $</td>
        </tr>`;
    });

    const clientNom = `${facture.client_prenom || facture.clientPrenom || ""} ${facture.client_nom || facture.clientNom || ""}`.trim() || "Client";

    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Facture ${facture.id}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:'Helvetica Neue',Arial,sans-serif;background:#ffffff;color:#334155;font-size:13px;line-height:1.5;}
    @page{size:A4;margin:0;}
  </style>
</head>
<body style="width:210mm;min-height:297mm;position:relative;">

  ${watermark}

  <!-- TOP ACCENT BAR -->
  <div style="height:6px;background:linear-gradient(90deg,#1e40af 0%,#2563eb 40%,#4f46e5 70%,#7c3aed 100%);"></div>

  <!-- MAIN CONTENT WRAPPER -->
  <div style="padding:36px 44px 32px 44px;position:relative;z-index:1;">

    <!-- ===== HEADER ===== -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
      <tr>
        <!-- Logo + Company -->
        <td style="vertical-align:top;width:55%;">
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:10px;">
            ${logoBlock}
            <div>
              <div style="font-size:17px;font-weight:800;color:#1e293b;letter-spacing:-0.3px;">Africa Connect Logistic</div>
              <div style="font-size:11px;color:#64748b;margin-top:1px;">Transport & Logistique Internationale</div>
            </div>
          </div>
          <div style="margin-top:10px;font-size:11.5px;color:#64748b;line-height:1.8;">
            <div>Lubumbashi / Kinshasa, Republique Democratique du Congo</div>
            <div>contact@africaconnect-logistic.com</div>
            <div>+243 XXX XXX XXX</div>
            <div>www.africaconnect-logistic.com</div>
          </div>
        </td>

        <!-- Invoice Title + Meta -->
        <td style="vertical-align:top;text-align:right;">
          <div style="font-size:38px;font-weight:900;color:#1e293b;letter-spacing:-1px;line-height:1;">FACTURE</div>
          <div style="margin-top:8px;display:inline-flex;align-items:center;gap:6px;background:${st.bg};color:${st.color};padding:4px 14px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:0.5px;">
            <span style="width:7px;height:7px;border-radius:50%;background:${st.dot};display:inline-block;"></span>
            ${st.label}
          </div>
          <div style="margin-top:14px;font-size:12px;color:#475569;line-height:2.2;">
            <div><span style="color:#94a3b8;font-weight:500;min-width:80px;display:inline-block;">Numéro</span> <strong style="color:#1e293b;">${facture.id}</strong></div>
            <div><span style="color:#94a3b8;font-weight:500;min-width:80px;display:inline-block;">Émise le</span> <span>${dateFacture}</span></div>
            <div><span style="color:#94a3b8;font-weight:500;min-width:80px;display:inline-block;">Échéance</span> <span style="color:#dc2626;font-weight:600;">${dateEcheance}</span></div>
          </div>
        </td>
      </tr>
    </table>

    <!-- ===== DIVIDER ===== -->
    <div style="height:1px;background:linear-gradient(90deg,#2563eb,#e2e8f0);margin-bottom:28px;"></div>

    <!-- ===== FROM / TO ===== -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
      <tr>
        <!-- DE: Africa Connect -->
        <td style="width:48%;vertical-align:top;">
          <div style="background:#f0f7ff;border:1px solid #bfdbfe;border-left:4px solid #2563eb;border-radius:8px;padding:18px 20px;">
            <div style="font-size:10px;font-weight:700;color:#2563eb;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;">De</div>
            <div style="font-size:14px;font-weight:700;color:#1e293b;margin-bottom:6px;">Africa Connect Logistic SARL</div>
            <div style="font-size:12px;color:#475569;line-height:1.9;">
              <div>Lubumbashi, Katanga, RDC</div>
              <div>contact@africaconnect-logistic.com</div>
              <div>+243 XXX XXX XXX</div>
              <div>RCCM: CD/LUB/RCCM/XX-XXXX</div>
            </div>
          </div>
        </td>
        <td style="width:4%;"></td>
        <!-- À: Client -->
        <td style="width:48%;vertical-align:top;">
          <div style="background:#fafafa;border:1px solid #e2e8f0;border-left:4px solid #64748b;border-radius:8px;padding:18px 20px;">
            <div style="font-size:10px;font-weight:700;color:#64748b;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;">Facturé à</div>
            <div style="font-size:14px;font-weight:700;color:#1e293b;margin-bottom:6px;">${clientNom}</div>
            <div style="font-size:12px;color:#475569;line-height:1.9;">
              ${facture.email ? `<div>Email: ${facture.email}</div>` : ""}
              ${facture.telephone ? `<div>Tel: ${facture.telephone}</div>` : ""}
              ${facture.adresse ? `<div>Adresse: ${facture.adresse}</div>` : ""}
              <div style="margin-top:6px;font-size:11px;color:#94a3b8;">Réf. Client #${facture.clientId || facture.client_id || "—"}</div>
            </div>
          </div>
        </td>
      </tr>
    </table>

    <!-- ===== SERVICES TABLE ===== -->
    <div style="margin-bottom:28px;">
      <div style="font-size:11px;font-weight:700;color:#2563eb;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;">Détail des prestations</div>
      <table style="width:100%;border-collapse:collapse;border-radius:10px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
        <thead>
          <tr style="background:linear-gradient(90deg,#1e40af,#2563eb);">
            <th style="padding:13px 16px;text-align:left;font-size:12px;font-weight:600;color:#ffffff;letter-spacing:0.3px;width:52%;">Description</th>
            <th style="padding:13px 16px;text-align:center;font-size:12px;font-weight:600;color:#bfdbfe;width:12%;">Qté</th>
            <th style="padding:13px 16px;text-align:right;font-size:12px;font-weight:600;color:#bfdbfe;width:18%;">Prix unitaire</th>
            <th style="padding:13px 16px;text-align:right;font-size:12px;font-weight:600;color:#ffffff;width:18%;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHTML || `<tr><td colspan="4" style="padding:20px 16px;text-align:center;color:#94a3b8;font-style:italic;">Aucune prestation enregistrée</td></tr>`}
        </tbody>
      </table>
    </div>

    <!-- ===== TOTAUX ===== -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
      <tr>
        <!-- Notes -->
        <td style="width:55%;vertical-align:top;padding-right:20px;">
          ${facture.notes ? `
          <div style="background:#fffbeb;border:1px solid #fde68a;border-left:4px solid #f59e0b;border-radius:8px;padding:14px 16px;">
            <div style="font-size:10px;font-weight:700;color:#92400e;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;">Notes & Conditions</div>
            <div style="font-size:12px;color:#78350f;line-height:1.6;">${facture.notes}</div>
          </div>` : `
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px 16px;">
            <div style="font-size:11px;color:#166534;line-height:1.7;">
              <div style="font-weight:700;margin-bottom:6px;">Modalités de paiement</div>
              <div>• Virement bancaire ou Mobile Money</div>
              <div>• Paiement dû avant la date d'échéance</div>
              <div>• Tout retard entraîne des pénalités de 2%/mois</div>
            </div>
          </div>`}
        </td>
        <!-- Totaux -->
        <td style="width:45%;vertical-align:top;">
          <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
            <tr>
              <td style="padding:10px 16px;font-size:13px;color:#64748b;">Sous-total HT</td>
              <td style="padding:10px 16px;font-size:13px;font-weight:500;color:#1e293b;text-align:right;">${montant.toFixed(2)} USD</td>
            </tr>
            <tr>
              <td style="padding:10px 16px;font-size:13px;color:#64748b;border-top:1px solid #e2e8f0;">TVA (0%)</td>
              <td style="padding:10px 16px;font-size:13px;font-weight:500;color:#1e293b;text-align:right;border-top:1px solid #e2e8f0;">0.00 USD</td>
            </tr>
            <tr style="background:linear-gradient(135deg,#1e40af,#2563eb);">
              <td style="padding:14px 16px;font-size:14px;font-weight:700;color:#bfdbfe;">Total TTC</td>
              <td style="padding:14px 16px;font-size:18px;font-weight:800;color:#ffffff;text-align:right;">${montant.toFixed(2)} USD</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- ===== THANK YOU BANNER ===== -->
    <table style="width:100%;border-collapse:collapse;background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);border-radius:10px;margin-bottom:20px;"><tr>
    <td style="padding:18px 28px;border-radius:10px 0 0 10px;">
        <div style="font-size:15px;font-weight:700;color:#ffffff;margin-bottom:4px;">Merci pour votre confiance !</div>
        <div style="font-size:11px;color:#94a3b8;">Africa Connect Logistic — Votre partenaire logistique de confiance en RDC</div>
      </td>
      <td style="padding:18px 28px;text-align:right;font-size:11px;color:#64748b;line-height:1.8;border-radius:0 10px 10px 0;">
        <div style="color:#3b82f6;font-weight:600;">www.africaconnect-logistic.com</div>
        <div>contact@africaconnect-logistic.com</div>
        <div>+243 XXX XXX XXX</div>
      </td>
    </tr></table>

    <!-- ===== FOOTER ===== -->
    <div style="text-align:center;font-size:10px;color:#94a3b8;padding-top:12px;border-top:1px solid #f1f5f9;">
      <span>Facture générée le ${new Date().toLocaleDateString("fr-FR")} • Africa Connect Logistic SARL • RCCM: CD/LUB/RCCM/XX-XXXX</span>
    </div>

  </div><!-- /MAIN CONTENT -->

  <!-- BOTTOM ACCENT BAR -->
  <div style="height:4px;background:linear-gradient(90deg,#7c3aed 0%,#2563eb 50%,#1e40af 100%);"></div>

</body>
</html>`;
  }
}

module.exports = new PDFService();
