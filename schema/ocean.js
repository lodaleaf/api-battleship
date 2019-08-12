import mongoose from '../services/mongoose'

const oceanSchema = new mongoose.Schema({
  attack_history: [{ coordinateX: Number, coordinateY: Number, date: Date }],
  defender_history: [{ shipType: String, shipDirection: String, coordinateX: Number, coordinateY: Number, date: Date }],
  ocean_data: Object,
  ready_to_attack: Boolean,
  active: Boolean
})

oceanSchema.statics.findActive = function () {
  return this.findOne({ active: true })
}

oceanSchema.statics.deactiveAll = function () {
  return this.updateMany({ active: true }, { active: false })
}

module.exports = mongoose.model('ocean', oceanSchema)
