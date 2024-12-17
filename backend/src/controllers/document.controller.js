const Document = require('../models/Document');

class DocumentController {
  // Tải lên tài liệu
  async uploadDocument(req, res) {
    try {
      const {
        title,
        description,
        course,
        accessRoles,
        fileType,
        tags
      } = req.body;
      const file = req.file;

      // Kiểm tra quyền tải lên
      if (!req.user.permissions.canUploadDocuments) {
        return res.status(403).json({
          message: 'Bạn không có quyền tải lên tài liệu'
        });
      }

      // Tải lên Firebase Storage
      const bucket = admin.storage().bucket();
      const fileName = `documents/${Date.now()}_${file.originalname}`;
      const fileUpload = bucket.file(fileName);

      await fileUpload.save(file.buffer, {
        metadata: {
          contentType: file.mimetype
        }
      });

      // Lấy URL công khai
      const [url] = await fileUpload.getSignedUrl({
        action: 'read',
        expires: '03-01-2500'
      });

      // Tạo bản ghi tài liệu trong MongoDB
      const document = new Document({
        title,
        description,
        fileUrl: url,
        course,
        uploadedBy: req.user._id,
        accessRoles: accessRoles || ['lecturer', 'admin'],
        fileType,
        tags
      });

      await document.save();

      res.status(201).json({
        message: 'Tải lên tài liệu thành công',
        document
      });
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi tải lên tài liệu',
        error: error.message
      });
    }
  }

  // Lấy danh sách tài liệu
  async getDocuments(req, res) {
    try {
      const { courseId, role } = req.query;

      // Xây dựng bộ lọc
      const filter = {
        ...(courseId && { course: courseId }),
        accessRoles: { $in: [role] }
      };

      const documents = await Document.find(filter)
        .populate('course', 'name')
        .populate('uploadedBy', 'name email');

      res.status(200).json(documents);
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi lấy danh sách tài liệu',
        error: error.message
      });
    }
  }
}

module.exports = new DocumentController();