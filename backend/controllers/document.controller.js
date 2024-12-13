// backend/controllers/documentController.js
const FirebaseStorageService = require('../services/firebaseStorage.service');
const Document = require('../models/Document');

class DocumentController {
  async uploadDocument(req, res) {
    try {
      const file = req.file;
      const uploadResult = await FirebaseStorageService.uploadFile(file, 'assignments');
      
      const newDocument = await Document.create({
        fileName: uploadResult.fileName,
        url: uploadResult.url,
        userId: req.user.id,
        courseId: req.body.courseId,
        type: 'assignment'
      });

      res.status(200).json({
        message: 'Upload thành công',
        document: newDocument
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Lỗi upload file', 
        error: error.message 
      });
    }
  }

  async deleteDocument(req, res) {
    try {
      const document = await Document.findById(req.params.id);
      
      // Xóa file trên Firebase
      await FirebaseStorageService.deleteFile(document.fileName);
      
      // Xóa record trong database
      await Document.findByIdAndDelete(req.params.id);

      res.status(200).json({ message: 'Xóa file thành công' });
    } catch (error) {
      res.status(500).json({ 
        message: 'Lỗi xóa file', 
        error: error.message 
      });
    }
  }
}

module.exports = new DocumentController();