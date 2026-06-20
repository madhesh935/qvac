const { randomUUID } = require('crypto');
const mongoose = require('mongoose');
const EmergencyReport = require('../models/EmergencyReport');

let mode = 'memory';
const memoryStore = new Map();

async function init() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/resqmesh';

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    mode = 'mongodb';
    console.log('[DB] MongoDB connected');
    return mode;
  } catch (err) {
    mode = 'memory';
    console.warn('[DB] MongoDB unavailable:', err.message);
    console.warn('[DB] Using in-memory store for this session (data resets on restart).');
    console.warn('[DB] For persistence, start MongoDB: mongod');
    return mode;
  }
}

function getMode() {
  return mode;
}

function toPlain(doc) {
  if (!doc) return null;
  return doc.toObject ? doc.toObject() : { ...doc };
}

async function findByPacketId(packetId) {
  if (mode === 'mongodb') {
    return EmergencyReport.findOne({ packet_id: packetId });
  }
  for (const report of memoryStore.values()) {
    if (report.packet_id === packetId) return { ...report };
  }
  return null;
}

async function create(data) {
  if (mode === 'mongodb') {
    const report = new EmergencyReport(data);
    await report.save();
    return report;
  }

  const report = {
    _id: randomUUID(),
    packet_id: data.packet_id || `PKT-${Date.now()}`,
    victim_name: data.victim_name,
    message: data.message,
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    priority: 'MEDIUM',
    advice: '',
    status: 'PENDING',
    response: '',
    created_at: new Date(),
  };
  memoryStore.set(report._id, report);
  return { ...report };
}

async function findById(id) {
  if (mode === 'mongodb') {
    return EmergencyReport.findById(id);
  }
  const report = memoryStore.get(id);
  return report ? { ...report } : null;
}

async function updateById(id, updates) {
  if (mode === 'mongodb') {
    return EmergencyReport.findByIdAndUpdate(id, updates, { new: true });
  }

  const existing = memoryStore.get(id);
  if (!existing) return null;

  const updated = { ...existing, ...updates };
  memoryStore.set(id, updated);
  return { ...updated };
}

async function findAll() {
  if (mode === 'mongodb') {
    return EmergencyReport.find().sort({ created_at: -1 }).limit(200);
  }

  return Array.from(memoryStore.values())
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 200)
    .map((r) => ({ ...r }));
}

async function getStatistics() {
  if (mode === 'mongodb') {
    const [total, pending, assigned, resolved, critical, high] = await Promise.all([
      EmergencyReport.countDocuments(),
      EmergencyReport.countDocuments({ status: 'PENDING' }),
      EmergencyReport.countDocuments({ status: 'ASSIGNED' }),
      EmergencyReport.countDocuments({ status: 'RESOLVED' }),
      EmergencyReport.countDocuments({ priority: 'CRITICAL' }),
      EmergencyReport.countDocuments({ priority: 'HIGH' }),
    ]);
    return { total, pending, assigned, resolved, critical, high };
  }

  const reports = Array.from(memoryStore.values());
  return {
    total: reports.length,
    pending: reports.filter((r) => r.status === 'PENDING').length,
    assigned: reports.filter((r) => r.status === 'ASSIGNED').length,
    resolved: reports.filter((r) => r.status === 'RESOLVED').length,
    critical: reports.filter((r) => r.priority === 'CRITICAL').length,
    high: reports.filter((r) => r.priority === 'HIGH').length,
  };
}

module.exports = {
  init,
  getMode,
  toPlain,
  findByPacketId,
  create,
  findById,
  updateById,
  findAll,
  getStatistics,
};
