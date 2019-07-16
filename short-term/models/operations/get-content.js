/**
 * @typedef {object} ContentInfo
 * @property {number} campusId
 * @property {string} title1
 * @property {string} title2
 * @property {string} title3
 * @property {string} title4
 * @property {string} content
 * @property {string} summary
 * @property {string} note
 * @property {number} pageFrom
 * @property {number} pageTo
 * @property {number} aspect
 * @property {number} keypoint
 * @property {number} method
 * @property {number} conflictedAspect
 * @property {number} conflictedKeypoint
 * @property {number} conflictedMethod
 * @property {number} isChecked
 * @property {number} isConflicted
 * @property {number} reviewerId
 * @property {number} updateTime
 * @property {number} dataId
 */
/**
 * Return total content with the given informatioin
 * @function GetContent
 * @param {number} aspect - The ID of the Aspect
 * @param {number} keypoint - The ID of the keypoint
 * @param {number} method - The ID of the method
 * @param {number} dataId - The ID of the data in data table
 * @param {number} isChecked - The status of this data
 * @param {number} isConflicted - The another status of this data
 * @returns {ContentInfo}
 * @todo give the link of the illustration of isChecked and isConflicted
 */
// import the COntent Module
import Content from 'projectRoot/short-term/models/schemas/Content.js'


export default async(aspect, keypoint, method, dataId, isChecked =-1, isConflicted=-1) => {
  /**
   * Define the where condition for Content.findAll()
   */
  let whereCondition = {
    dataId,
  }
  /**
   * Check whether the aspect is -1 or not,so as keypoint and method,
   * then assign into a property into the variablet whereCondition
   */
  if(aspect !== -1){
    whereCondition['aspect'] = aspect
    if(keypoint !== -1){
      whereCondition['keypoint'] = keypoint
      if(method !== -1){
        whereCondition['method'] = method
      }
    }
  }
  /**
   * Check the isConflicted is -1 or not,
   * if isConflicted is not -1, we need to explicitly
   * set the isConflixted property in the object whereCondition.
   */
  if(isConflicted != -1){
    whereCondition['isConflicted'] = isConflicted
  }
  /**
   * So as the reason written above.
   */
  if(isChecked != -1){
    whereCondition['isChecked'] = isChecked
  }
  /**
   * Find all Content with the given condition, whereCondition
   */
  let data = await Content.findAll({
    where: whereCondition,
    attributes: [
      'contentId',
      'title1',
      'title2',
      'title3',
      'title4',
      'content',
      'summary',
      'note',
      'pageFrom',
      'pageTo',
      'aspect',
      'keypoint',
      'method',
      'conflictedAspect',
      'conflictedKeypoint',
      'conflictedMethod',
      'isChecked',
      'reviewerId',
      'isConflicted',
      'updateTime',
      'dataId',
    ],
  })
  // return a array of data
  return data
}