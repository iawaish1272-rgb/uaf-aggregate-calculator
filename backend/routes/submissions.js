const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');

// Password for the admin dashboard.
// Prefer setting ADMIN_PASSWORD as an environment variable on Railway instead
// of leaving it hardcoded here — see the README for how.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '421806';

// ---------- PUBLIC: called by the calculator every time someone submits ----------
router.post('/submissions', async (req, res) => {
  try {
    const {
      type, name, matricObtained, matricTotal,
      fscObtained, fscTotal, entryTest,
      targetAggregate, requiredEntryTest, aggregate
    } = req.body;

    if (type !== 'calculator' && type !== 'reverse') {
      return res.status(400).json({ error: 'Invalid submission type' });
    }

    const submission = new Submission({
      type, name, matricObtained, matricTotal,
      fscObtained, fscTotal, entryTest,
      targetAggregate, requiredEntryTest, aggregate
    });

    await submission.save();
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Error saving submission:', err);
    res.status(500).json({ error: 'Failed to save submission' });
  }
});

// ---------- helper: checks the admin password sent in a header ----------
function checkAdminPassword(req, res, next) {
  const password = req.headers['x-admin-password'];
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  next();
}

// ---------- ADMIN: fetch all submissions (password required) ----------
router.get('/admin/submissions', checkAdminPassword, async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 });
    res.json({ submissions });
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// ---------- ADMIN: delete a single submission (password required) ----------
router.delete('/admin/submissions/:id', checkAdminPassword, async (req, res) => {
  try {
    await Submission.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting submission:', err);
    res.status(500).json({ error: 'Failed to delete submission' });
  }
});

module.exports = router;
