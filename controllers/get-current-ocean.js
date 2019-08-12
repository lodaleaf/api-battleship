import { initOcean } from '../services/battleship'
import OceanModel from '../schema/ocean'
import _ from 'lodash'

export const getCurrentOcean = async (req, res) => {
  let activeOcean = await OceanModel.findActive()

  if (_.isNil(activeOcean)) {
    activeOcean = await createActiveOcean()
  }
  res.send(activeOcean)
}

const createActiveOcean = async () => {
  let newOceanData = initOcean()
  let newOcean = new OceanModel({
    ocean_data: newOceanData,
    active: true
  })
  await newOcean.save()
  return newOcean
}
