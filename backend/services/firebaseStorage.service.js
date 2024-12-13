// controllers/documentController.js
const Document = require('../models/Document');
const User = require('../models/User');
const firebaseStorageService = require('../services/firebaseStorage.service');

exports.uploadDocument = async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    const file = req.file;

    // Upload to Firebase Storage
    const fileUrl = await firebaseStorageService.uploadFile(file);

    // Create document record in MongoDB
    const newDocument = new Document({
      filename: file.originalname,
      fileUrl: fileUrl,
      uploadedBy: userId,
      course: courseId,
      size: file.size,
      mimetype: file.mimetype
    });

    // Save document
    const savedDocument = await newDocument.save();

    // Update user's documents array
    await User.findByIdAndUpdate(userId, {
      $push: { documents: savedDocument._id }
    });

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: savedDocument
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error uploading document', 
      error: error.message 
    });
  }
};

exports.getUserDocuments = async (req, res) => {
  try {
    const { userId } = req.params;

    // Populate user's documents with full details
    const user = await User.findById(userId).populate({
      path: 'documents',
      populate: {
        path: 'uploadedBy',
        select: 'username email'
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      documents: user.documents
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching documents', 
      error: error.message 
    });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { userId } = req.body;

    // Find and delete document
    const document = await Document.findByIdAndDelete(documentId);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Remove document reference from user
    await User.findByIdAndUpdate(userId, {
      $pull: { documents: documentId }
    });

    // Delete from Firebase Storage
    await firebaseStorageService.deleteFile(document.fileUrl);

    res.status(200).json({ 
      message: 'Document deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting document', 
      error: error.message 
    });
  }
};