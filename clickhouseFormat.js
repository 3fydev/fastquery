const clickhouseFormat = (clickhouseObj) => {
  const arrayOfObjects = clickhouseObj.data.map((element) => {
    const objToAdd = element.reduce((acc, data, index) => {
      acc[clickhouseObj.meta[index].name] = data;
      return acc;
    }, {});
    return objToAdd;
  });
  return arrayOfObjects;
};

module.exports = clickhouseFormat;