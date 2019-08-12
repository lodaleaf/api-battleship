import { getOrCreateActiveOcean } from '../services/battleship'

export const getCurrentOcean = async (req, res) => {
  let activeOcean = await getOrCreateActiveOcean()
  res.send(activeOcean)
}
