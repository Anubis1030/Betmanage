import Report from '../models/report.js';

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private
export const createReport = async (req, res) => {
  try {
    const report = new Report({
      userId: req.user._id,
      type: req.body.type,
      description: req.body.description
    });
    
    const createdReport = await report.save();
    res.status(201).json(createdReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private/Admin
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('userId', 'name phone');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update report status
// @route   PUT /api/reports/:id
// @access  Private/Admin
export const updateReportStatus = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if(report) {
      report.status = req.body.status;
      const updatedReport = await report.save();
      res.json(updatedReport);
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};