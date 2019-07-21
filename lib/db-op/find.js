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

const findOne = async (info={
                interface : null,
                whereCondition : {},
                attributes : [],
                allowNull : true
              },
              options={
                group: [],
                include: []
              }
) => {
  try{
    const {
      interface_ = null,
      whereCondition = null,
      attributes = null,
      allowNull = true
    } = info || {}

    const {
      group = null,
      include = null
    } = options || {}

    if( interface_ === null)
      throw new Error('No defined interface in find fn')
    if( whereCondition === null )
      throw new Error('No whereCondition with findOne method in find fn')
    if( attributes === null )
      throw new Error('Arrtibutes array is empty in find fn')

    let temp = {
      where : whereCondition,
      attributes,
    }

    if( group !== null
    && Array.isArray(group)
    && group.length )
      temp = Object.assign(temp , {
        group: options.group
      })
    if( include !== null
    && Array.isArray(include)
    && include.length )
      temp = Object.assign(temp, {
        include: options.include
      })
    let data
    data = interface_.findOne(temp)

    if( !allowNull && (data === null || !data.length)){
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

const findAll = async (info={
                interface : null,
                whereCondition : {},
                attributes : [],
                allowNull : true
              },
              options={
                group: [],
                include: []
              }
) => {
  try{
    const {
      interface_ = null,
      whereCondition = null,
      attributes = null,
      allowNull = true
    } = info || {}

    const {
      group = null,
      include = null
    } = options || {}

    if( interface_ === null)
      throw new Error('No defined interface in find fn')
    if( whereCondition === null )
      throw new Error('No whereCondition with findOne method in find fn')
    if( attributes === null )
      throw new Error('Arrtibutes array is empty in find fn')

    let temp = {
      where : whereCondition,
      attributes,
    }

    if( group !== null
    && Array.isArray(group)
    && group.length )
      temp = Object.assign(temp , {
        group: options.group
      })
    if( include !== null
    && Array.isArray(include)
    && include.length )
      temp = Object.assign(temp, {
        include: options.include
      })
    let data
    data = interface_.findAll(temp)

    if( !allowNull && (data === null || !data.length)){
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


export {
  findOne,
  findAll
}