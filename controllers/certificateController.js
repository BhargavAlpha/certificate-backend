const { google } = require('googleapis');
const { PDFDocument } = require('pdf-lib');
const certificate = require('../models/certificate');
const fs = require('fs');
const {readFile, writeFile, unlink} = require('fs').promises;
const { join } = require('path');


const serviceAccount = require('./keys.json');
const auth = new google.auth.JWT(
  serviceAccount.client_email,
  null,
  serviceAccount.private_key,
  ['https://www.googleapis.com/auth/drive']
);



const getCertificates = async (req, res) => {
  try {
    const certificates = await certificate.find();
    res.status(200).json(certificates);
  } catch (error) {
    console.log('Error getting certificates:', error);
    res.status(500).json({ error: 'Error getting certificates' });
  }
};

const uploadToDrive = async (req, res) => {
    const { name, course, date, certificateId ,email} = req.body;
    async function createPdf(input,output){
      const pdfDoc = await PDFDocument.load(await readFile(input));
      const form = pdfDoc.getForm();
      
      form.getTextField('name').setText(name);
      form.getTextField('course').setText(course);
      form.getTextField('date').setText(date);
      form.getTextField('certificate').setText(certificateId);
      form.flatten();
  
      const filledPDFBytes = await pdfDoc.save();
      await writeFile(output, filledPDFBytes);
    }
      await createPdf('sample_certificate.pdf','output.pdf');
      const outputPath = join('output.pdf');
    try {
      
    
      const drive = google.drive({ version: 'v3', auth });
  
      const fileMetadata = {
        name: 'filled_certificate.pdf', 
        mimeType: 'application/pdf'
      };
  
      const media = {
        mimeType: 'application/pdf',
        body: fs.createReadStream(outputPath) 
      };
  
      const response = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, name, webViewLink' 
      });
      await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
            role: 'reader',
            type: 'anyone'
        }
    });
  
      console.log('File uploaded successfully. File ID:', response.data.id);
      console.log('File name:', response.data.name);
      console.log('File link:', response.data.webViewLink);
      const newCertificate = new certificate({
        email: email,
        link: response.data.webViewLink,
      });
      await newCertificate.save();
      console.log('Certificate saved successfully.');
      await fs.promises.unlink(outputPath);
      res.status(200).json({ message: 'File uploaded successfully', fileId: response.data.id });
    } catch (error) {
      console.log('Error uploading to Google Drive:', error);
      res.status(500).json({ error: 'Error uploading to Google Drive' });
    }
    
  };
  

module.exports = { getCertificates, uploadToDrive };
