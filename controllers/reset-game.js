import { resetOcean } from '../services/battleship'
export const resetGame = async (req, res) => {
  await resetOcean()
  res.send('Reset successfully')
}
