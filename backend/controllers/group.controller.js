import AccountGroup from '../models/AccountGroup.js';

async function listGroups(req, res) {
  const groups = await AccountGroup.find({ company: req.company._id }).sort({ category: 1, groupName: 1 });
  return res.json({ groups });
}

async function createGroup(req, res) {
  const groupName = String(req.body.groupName || '').trim();
  const category = String(req.body.category || '').trim();
  const parentGroup = req.body.parentGroup != null ? String(req.body.parentGroup).trim() : null;

  if (!groupName || !category) {
    return res.status(400).json({ message: 'groupName and category are required' });
  }

  const group = await AccountGroup.create({
    company: req.company._id,
    groupName,
    category,
    parentGroup: parentGroup || null,
    isPredefined: false
  });
  return res.status(201).json({ group });
}

async function updateGroup(req, res) {
  const group = await AccountGroup.findOne({ _id: req.params.groupId, company: req.company._id });
  if (!group) return res.status(404).json({ message: 'Group not found' });

  if (req.body.groupName != null) group.groupName = String(req.body.groupName).trim();
  if (req.body.category != null) group.category = String(req.body.category).trim();
  if (req.body.parentGroup != null) group.parentGroup = String(req.body.parentGroup).trim() || null;

  await group.save();
  return res.json({ group });
}

async function deleteGroup(req, res) {
  const group = await AccountGroup.findOne({ _id: req.params.groupId, company: req.company._id });
  if (!group) return res.status(404).json({ message: 'Group not found' });
  if (group.isPredefined) return res.status(400).json({ message: 'Cannot delete predefined groups' });

  await group.deleteOne();
  return res.json({ ok: true });
}

export default { listGroups, createGroup, updateGroup, deleteGroup };
