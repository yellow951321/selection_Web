import Data from 'mid-long-term/models/schemas/Data.js'

export default async(dataId) => {
  try {
    return Data.destroy({
      where: {
        dataId: dataId,
      },
    })
      .then(() => 'ok')
      .catch(() => {
        throw new Error('No specified project')
      })
  } catch (err) {
    console.log(err)
  }
}