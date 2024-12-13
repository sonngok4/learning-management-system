router.post('/upload', 
  authMiddleware, 
  upload.single('document'), 
  documentController.uploadDocument
);