import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Attachment from '../models/Attachment.js';
import Task from '../models/Task.js';

// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: false, message: 'No file uploaded' });
    }

    const { taskId, projectId } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;

    const attachment = await Attachment.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: fileUrl,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user._id,
      task: taskId || null,
      project: projectId || null,
    });

    if (taskId) {
      await Task.findByIdAndUpdate(taskId, { $push: { attachments: attachment._id } });
    }

    return res.status(201).json({ status: true, data: attachment });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const getAttachments = async (req, res) => {
  try {
    const { taskId, projectId } = req.query;
    const filter = {};
    if (taskId) filter.task = taskId;
    if (projectId) filter.project = projectId;

    const attachments = await Attachment.find(filter).populate('uploadedBy', 'name avatar');
    return res.json({ status: true, data: attachments });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
