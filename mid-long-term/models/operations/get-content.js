import Content from 'projectRoot/mid-long-term/models/schemas/Content.js'

export default async(aspect, keypoint, method, dataId, isChecked =-1, isConflicted=-1) => {
  /** if any of the value of the three type of label is -1
     *  ,which means show all the content under this label
     *  ,we need to set special condition
    */
  let whereCondition = {
    dataId,
  }

  if(aspect !== -1){
    whereCondition['aspect'] = aspect
    if(keypoint !== -1 & aspect < 5){
      whereCondition['keypoint'] = keypoint
      if(method !== -1){
        whereCondition['method'] = method
      }
    }
  }

  if(isConflicted != -1){
    whereCondition['isConflicted'] = isConflicted
  }

  if(isChecked != -1){
    whereCondition['isChecked'] = isChecked
  }
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

  return data
}