const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const Document = require('../models/Document');

class DocumentController {
  // Tải lên tài liệu vào thư mục 'documents'
  async uploadDocument(req, res) {
    try {
      const { title, description, course, accessRoles, fileType, tags } = req.body;
      const file = req.file;

      // Kiểm tra xem tệp có tồn tại hay không
      if (!file) {
        return res.status(400).json({
          message: 'Vui lòng tải lên một tệp tài liệu'
        });
      }

      // Kiểm tra tính hợp lệ của các tham số
      if (!title || !description || !course) {
        return res.status(400).json({
          message: 'Thiếu thông tin bắt buộc: title, description, course'
        });
      }

      // Kiểm tra tính hợp lệ của course ID (sử dụng MongoDB ObjectId)
      if (!mongoose.Types.ObjectId.isValid(course)) {
        return res.status(400).json({
          message: 'ID khóa học không hợp lệ'
        });
      }

      // Tải lên Cloudinary vào thư mục 'lms-assets/documents'
      const uploadResponse = await cloudinary.uploader.upload(file.path, {
        folder: 'lms-assets/documents',
        resource_type: 'auto',
        public_id: `document_${Date.now()}`,
      });

      const fileUrl = uploadResponse.secure_url;

      // Tạo bản ghi tài liệu trong MongoDB
      const document = await Document.create({
        title,
        description,
        fileUrl,
        course,
        uploadedBy: req.user._id,
        accessRoles: accessRoles || ['instructor', 'admin'],
        fileType,
        tags
      });

      await document.save();

      res.status(201).json({
        message: 'Tải lên tài liệu thành công',
        document
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Lỗi tải lên tài liệu',
        error: error.message || 'Có lỗi xảy ra trong quá trình tải lên'
      });
    }
  }


  // Lấy danh sách tài liệu
  async getDocuments(req, res) {
    try {
      const { courseId, role } = req.query;
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


  // Lấy tài liệu theo ID
  async getDocumentById(req, res) {
    try {
      const { id } = req.params;

      // Lấy tài liệu từ database
      const document = await Document.findById(id)
        .populate('course', 'name')
        .populate('uploadedBy', 'name email');

      // Kiểm tra quyền truy cập tài liệu
      const user = req.user;
      if (!user.canAccessDocument(document)) {
        return res.status(403).json({
          message: 'Bạn không có quyền truy cập tài liệu này'
        });
      }

      res.status(200).json(document);
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi lấy tài liệu',
        error: error.message
      });
    }
  }

  // Cập nhật tài liệu
  async updateDocument(req, res) {
    try {
      const { id } = req.params;
      const { title, description } = req.body;

      const document = await Document.findById(id);

      // Kiểm tra quyền truy cập tài liệu
      const user = req.user;
      if (!user.canAccessDocument(document)) {
        return res.status(403).json({
          message: 'Bạn không có quyền cập nhật tài liệu này'
        });
      }

      // Cập nhật tài liệu
      const updatedDocument = await Document.findByIdAndUpdate(
        id,
        { title, description },
        { new: true }
      );

      res.status(200).json({
        message: 'Cập nhật tài liệu thành công',
        document: updatedDocument
      });
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi cập nhật tài liệu',
        error: error.message
      });
    }
  }



  // Xóa tài liệu
  async deleteDocument(req, res) {
    try {
      const { id } = req.params;

      // Lấy tài liệu
      const document = await Document.findById(id);

      // Kiểm tra quyền truy cập tài liệu
      const user = req.user;
      if (!user.canAccessDocument(document)) {
        return res.status(403).json({
          message: 'Bạn không có quyền xóa tài liệu này'
        });
      }

      // Xóa tài liệu
      await Document.findByIdAndDelete(id);

      res.status(200).json({
        message: 'Xóa tài liệu thành công'
      });
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi xóa tài liệu',
        error: error.message
      });
    }
  }

  // Tìm kiếm tài liệu
  async searchDocuments(req, res) {
    try {
      const { query } = req.query;
      const documents = await Document.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      });
      res.status(200).json(documents);
    } catch (error) {
      res.status(500).json({
        message: 'Loi tim kiem tai lieu',
        error: error.message
      });
    }
  }

}

module.exports = new DocumentController();
