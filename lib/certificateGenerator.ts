import { jsPDF } from 'jspdf';
import { CertificateAPI } from '@/hooks/useCertificate';

// ============================================================================
// 🎨 KONFIGURASI DESAIN SERTIFIKAT PROFESIONAL
// Sesuaikan posisi (X, Y) dengan background gambar Anda
// ============================================================================
export const CERT_STYLE = {
  templatePath: '/assets/certificates/blank-template.jpg',
  signaturePath: '/assets/certificates/ttd.png',
  
  centerX: 148.5, // Titik tengah kertas A4 Landscape (297 / 2)

  name: {
    y: 110,                 
    font: 'times',          // Font klasik berwibawa
    style: 'bold',
    size: 42,               
    color: [30, 41, 59]     // Slate-800
  },

  achievement: {
    startY: 130,            
    lineHeight: 8,          
    font: 'helvetica',      // Font modern & bersih
    style: 'normal',
    size: 14,
    color: [100, 116, 139]  // Slate-500
  },

  date: {
    x: 40,                  // Pojok Kiri Bawah
    y: 175,
    font: 'helvetica',
    style: 'bold',
    size: 11,
    color: [71, 85, 105]    // Slate-600
  },

  signature: {
    x: 215,                 // Pojok Kanan Bawah
    y: 145,
    width: 45,              
    height: 25              
  },

  instructorText: {
    x: 237.5,               // Di tengah-tengah gambar TTD
    y: 175,
    font: 'helvetica',
    style: 'bold',
    size: 12,
    color: [30, 41, 59]
  },

  url: {
    y: 195,                 // Paling bawah tengah
    font: 'helvetica',
    style: 'italic',
    size: 10,
    color: [0, 188, 212]    // Cyan NgodingAI
  }
};

// Fungsi Helper untuk meload gambar ke memory browser
const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.crossOrigin = 'Anonymous';
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Gagal memuat gambar: ${url}`));
  });
};

// Fungsi Utama Generate PDF
export const generateCertificatePDF = async (data: CertificateAPI): Promise<jsPDF | null> => {
  try {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // 1. Load Aset Visual
    const templateImg = await loadImage(CERT_STYLE.templatePath);
    let signatureImg = null;
    try {
       signatureImg = await loadImage(CERT_STYLE.signaturePath);
    } catch (e) {
       console.warn("Gambar TTD tidak ditemukan, lanjut tanpa TTD.");
    }
    
    // 2. Render Background
    doc.addImage(templateImg, 'JPEG', 0, 0, width, height);

    // 3. Render Nama Peserta
    doc.setFont(CERT_STYLE.name.font, CERT_STYLE.name.style);
    doc.setFontSize(CERT_STYLE.name.size);
    doc.setTextColor(CERT_STYLE.name.color[0], CERT_STYLE.name.color[1], CERT_STYLE.name.color[2]);
    doc.text(data.full_name, CERT_STYLE.centerX, CERT_STYLE.name.y, { align: 'center' });

    // 4. Render Pencapaian (Pisahkan berdasarkan tag <br> dari API)
    const achievementLines = data.achievement.split('<br>');
    doc.setFont(CERT_STYLE.achievement.font, CERT_STYLE.achievement.style);
    doc.setFontSize(CERT_STYLE.achievement.size);
    doc.setTextColor(CERT_STYLE.achievement.color[0], CERT_STYLE.achievement.color[1], CERT_STYLE.achievement.color[2]);
    
    let currentY = CERT_STYLE.achievement.startY;
    achievementLines.forEach((line) => {
        const cleanLine = line.replace(/<[^>]*>?/gm, ''); // Hapus sisa tag HTML
        doc.text(cleanLine.trim(), CERT_STYLE.centerX, currentY, { align: 'center' });
        currentY += CERT_STYLE.achievement.lineHeight; 
    });

    // 5. Render Tanggal Terbit
    doc.setFont(CERT_STYLE.date.font, CERT_STYLE.date.style);
    doc.setFontSize(CERT_STYLE.date.size);
    doc.setTextColor(CERT_STYLE.date.color[0], CERT_STYLE.date.color[1], CERT_STYLE.date.color[2]);
    doc.text(`Issued: ${data.issued}`, CERT_STYLE.date.x, CERT_STYLE.date.y);

    // 6. Render Link Verifikasi
    doc.setFont(CERT_STYLE.url.font, CERT_STYLE.url.style);
    doc.setFontSize(CERT_STYLE.url.size);
    doc.setTextColor(CERT_STYLE.url.color[0], CERT_STYLE.url.color[1], CERT_STYLE.url.color[2]);
    doc.text(`Verify at: ${data.course_url}`, CERT_STYLE.centerX, CERT_STYLE.url.y, { align: 'center' });

    // 7. Render Tanda Tangan & Nama Instruktur
    if (signatureImg) {
      doc.addImage(
        signatureImg, 
        'PNG', 
        CERT_STYLE.signature.x, 
        CERT_STYLE.signature.y, 
        CERT_STYLE.signature.width, 
        CERT_STYLE.signature.height
      );
    }
    
    doc.setFont(CERT_STYLE.instructorText.font, CERT_STYLE.instructorText.style);
    doc.setFontSize(CERT_STYLE.instructorText.size);
    doc.setTextColor(CERT_STYLE.instructorText.color[0], CERT_STYLE.instructorText.color[1], CERT_STYLE.instructorText.color[2]);
    doc.text("Lead Instructor", CERT_STYLE.instructorText.x, CERT_STYLE.instructorText.y, { align: 'center' });
    
    // Garis Bawah TTD
    doc.setDrawColor(100, 116, 139);
    doc.setLineWidth(0.5);
    doc.line(
        CERT_STYLE.signature.x, 
        CERT_STYLE.instructorText.y - 5, 
        CERT_STYLE.signature.x + CERT_STYLE.signature.width, 
        CERT_STYLE.instructorText.y - 5
    ); 

    return doc;
  } catch (error) {
    console.error("Gagal menyusun dokumen PDF:", error);
    return null;
  }
};