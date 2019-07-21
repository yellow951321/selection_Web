var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

export default async (info={
              findType : undefined,
              interface : null,
              whereCondition : {},
              attributes : [],
              allowNull : true,
              },
              options={
                group: [],
                include: []
              }
) => {
  try{
    if(info.findType === undefined)
      throw new Error('No defined findType in find fn')
    if(info.interface === null)
      throw new Error('No defined interface in find fn')
    if( isEmpty(whereCondition) && findType === 'one')
      throw new Error('No whereCondition with findOne method in find fn')
    if( !Array.isArray(attributes) || !attributes.length )
      throw new Error('Arrtibutes array is empty in find fn')

    const findType = info.findType
    const interface_ = info.interface
    const where = info.whereCondition
    const attributes = info.attributes

    let temp = {
      where,
      attributes,
    }

    if( options.hasOwnProperty('group')
    && Array.isArray(options.group)
    && options.group.length )
      temp = Object.assign(temp , {
        group: options.group
      })
    if( options.hasOwnProperty('include')
    && Array.isArray(options.include)
    && options.include.length )
      temp = Object.assign(temp, {
        include: options.include
      })
    let data
    if(findType === 'one'){
      data = interface_.findOne(temp)
    }else if(findType === 'all'){
      data = interface_.findAll(temp)
    }

    if( !info.allowNull && (data === null || !data.length)){
      let err = new Error('No data found')
      err.status = 404
      throw err
    }
    return data
  }catch(err){
    if(!err.status)
      err.status = 500
    console.log(err, err.status)
  }
}