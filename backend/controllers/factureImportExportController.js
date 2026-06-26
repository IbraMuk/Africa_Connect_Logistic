const puppeteer = require('puppeteer');
const path = require('path');

// Générer une facture PDF pour import/export
exports.generateFacturePDF = async (req, res) => {
  try {
    const factureData = req.body;
    
    // Créer le HTML de la facture
    const html = generateFactureHTML(factureData);
    
    // Lancer Puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Définir le contenu HTML
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Générer le PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      }
    });
    
    await browser.close();
    
    // Envoyer le PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Facture-${factureData.numeroFacture}.pdf"`);
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération du PDF',
      error: error.message
    });
  }
};

// Fonction pour générer le HTML de la facture
function generateFactureHTML(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Facture ${data.numeroFacture}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: Arial, sans-serif;
          font-size: 12px;
          line-height: 1.4;
          color: #333;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          border-bottom: 2px solid #2563eb;
          padding-bottom: 20px;
        }
        
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
        }
        
        .company-info {
          text-align: right;
        }
        
        .facture-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        
        .facture-number {
          font-size: 18px;
          font-weight: bold;
          color: #2563eb;
        }
        
        .client-info, .facture-details {
          background: #f8fafc;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        
        .section-title {
          font-weight: bold;
          margin-bottom: 10px;
          color: #1e40af;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        
        th, td {
          border: 1px solid #e5e7eb;
          padding: 10px;
          text-align: left;
        }
        
        th {
          background: #f3f4f6;
          font-weight: bold;
        }
        
        .text-right {
          text-align: right;
        }
        
        .total-row {
          font-weight: bold;
          background: #f8fafc;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
        }
        
        .instructions {
          background: #fef3c7;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
          border-left: 4px solid #f59e0b;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">AFRICA CONNECT LOGISTIC</div>
          <div>Transport & Logistique Internationale</div>
          <div>Kinshasa, RDC</div>
          <div>Email: info@africaclick.com | Tel: +243 XXX XXX XXX</div>
        </div>
        <div class="company-info">
          <div class="facture-number">FACTURE</div>
          <div>N°: ${data.numeroFacture}</div>
          <div>Date: ${new Date(data.dateFacture).toLocaleDateString('fr-FR')}</div>
          ${data.dateEcheance ? `<div>Échéance: ${new Date(data.dateEcheance).toLocaleDateString('fr-FR')}</div>` : ''}
        </div>
      </div>
      
      <div class="facture-info">
        <div class="client-info">
          <div class="section-title">CLIENT</div>
          <div><strong>${data.clientNom}</strong></div>
          ${data.clientEmail ? `<div>Email: ${data.clientEmail}</div>` : ''}
          ${data.clientTelephone ? `<div>Tél: ${data.clientTelephone}</div>` : ''}
          ${data.clientAdresse ? `<div>Adresse: ${data.clientAdresse}</div>` : ''}
        </div>
        
        <div class="facture-details">
          <div class="section-title">DÉTAILS DE L'OPÉRATION</div>
          <div>Type: ${data.typeOperation === 'import' ? 'IMPORT' : 'EXPORT'}</div>
          <div>Date de génération: ${data.dateGeneration}</div>
          <div>Poids total: ${data.totalPoids.toFixed(2)} kg</div>
          <div>Volume total: ${data.totalVolume.toFixed(2)} m³</div>
        </div>
      </div>
      
      ${data.instructions ? `
        <div class="instructions">
          <div class="section-title">INSTRUCTIONS SPÉCIALES</div>
          <div>${data.instructions}</div>
        </div>
      ` : ''}
      
      <table>
        <thead>
          <tr>
            <th>Référence</th>
            <th>Désignation</th>
            <th>Catégorie</th>
            <th class="text-right">Quantité</th>
            <th class="text-right">Poids (kg)</th>
            <th class="text-right">Volume (m³)</th>
            <th class="text-right">Prix Unit. ($)</th>
            <th class="text-right">Total ($)</th>
          </tr>
        </thead>
        <tbody>
          ${data.marchandises.map(marchandise => `
            <tr>
              <td>${marchandise.reference}</td>
              <td>${marchandise.designation}</td>
              <td>${marchandise.categorie_nom || 'Non catégorisée'}</td>
              <td class="text-right">${marchandise.quantite}</td>
              <td class="text-right">${(marchandise.poids * marchandise.quantite).toFixed(2)}</td>
              <td class="text-right">${(marchandise.volume * marchandise.quantite).toFixed(3)}</td>
              <td class="text-right">${marchandise.prixUnitaire.toFixed(2)}</td>
              <td class="text-right">${marchandise.montantTotal.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr class="total-row">
            <td colspan="7" class="text-right">Total HT:</td>
            <td class="text-right">${data.totalHT.toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="7" class="text-right">TVA (18%):</td>
            <td class="text-right">${data.totalTVA.toFixed(2)}</td>
          </tr>
          <tr class="total-row">
            <td colspan="7" class="text-right">Total TTC:</td>
            <td class="text-right">${data.totalTTC.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      
      <div class="footer">
        <div>Merci pour votre confiance!</div>
        <div>Africa Connect Logistic - Votre partenaire logistique de confiance</div>
        <div>Page générée le ${data.dateGeneration}</div>
      </div>
    </body>
    </html>
  `;
}
