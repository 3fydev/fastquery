function transformFilter(col, value) {
  if (Array.isArray(value)) return `${col} IN (${value})`;
  return `${col} = ${value}`;
}

/**
 * @params {[{ col, value: Array | String |Number}]} list
 */
function where(list) {
  return list.reduce((acc, filter, index) => {
    if (index === 0) return `WHERE ${filter}`;
    return `${acc} AND ${filter}`;
  }, "");
}

function having(list) {
  return list.reduce((acc, filter, index) => {
    if (index === 0) return `HAVING ${filter}`;
    return `${acc} AND ${filter}`;
  }, "");
}

function join(list) {
  return list.reduce((acc, filter) => `${acc} AND ${filter}`, "");
}

function conditionalInArrayExists(col, value, not) {
  if (Array.isArray(value) && value.length > 0) {
    const commas = `'${value.join(`', '`)}'`;
    if (not) return `arrayExists(x -> in(x, (${commas})), ${col}) = 0`;
    return `arrayExists(x -> in(x, (${commas})), ${col}) = 1`;
  }
  return null;
}

function conditionalWhereHasAny(col, value, not) {
  if (Array.isArray(value) && value.length > 0) {
    const commas = `'${value.join(`', '`)}'`;
    if (not) return `hasAny(${col}, [${commas}]) = 0`;
    return `hasAny(${col}, [${commas}]) = 1`;
  }
  return null;
}

function conditionalWhereHasAll(col, value, not) {
  if (Array.isArray(value) && value.length > 0) {
    const commas = `'${value.join(`', '`)}'`;
    if (not) return `hasAll(${col}, [${commas}]) = 0`;
    return `hasAll(${col}, [${commas}]) = 1`;
  }
  return null;
}

function conditionalWhereArrayAll(col, value, not) {
  if (Array.isArray(value) && value.length > 0) {
    const commas = `'${value.join(`', '`)}'`;
    if (not) return `arrayAll(${col}, [${commas}]) = 0`;
    return `arrayAll(${col}, [${commas}]) = 1`;
  }
  return null;
}

function conditionalWhereEqual(col, value, not) {
  if (value || value === 0) {
    const fvalue = typeof value === "string" ? `'${value}'` : value;
    if (not) return `${col} != ${fvalue}`;
    return `${col} = ${fvalue}`;
  }
  return null;
}

function conditionalWhereOp(col, operator, value) {
  if (value || value === 0) {
    const fvalue = typeof value === "string" ? `'${value}'` : value;
    return `${col} ${operator} ${fvalue}`;
  }
  return null;
}

function conditionalWhereIN(col, value, not) {
  if (Array.isArray(value) && value.length > 0) {
    const commas = `'${value.join(`', '`)}'`;
    if (not) return `${col} NOT IN (${commas})`;
    return `${col} IN (${commas})`;
  }
  return null;
}

function conditionalWhereBetween(col, values, not, isSorted) {
  if (Array.isArray(values) && values.length === 2) {
    const [init, end] = isSorted
      ? values.sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
      : values;
    if (not) return `${col} NOT BETWEEN ${init} AND ${end}`;
    return `${col} BETWEEN ${init} AND ${end}`;
  }

  return null;
}

function conditionalWhereLike(col, value) {
  if (value && typeof value === "string") {
    const fvalue = value.replace(/\s/g, "%");
    return `${col} LIKE '%${fvalue}%'`;
  }
  return null;
}

function conditionalWhereCaseInsensitive(col, value) {
  if (value && typeof value === "string")
    return `positionCaseInsensitive(${col}, '${value}') > 0`;

  return null;
}

function conditionalWhereIsNot(col, value) {
  const fvalue = typeof value === "string" ? `'${value}'` : value;
  return `${col} IS NOT ${fvalue}`;
}

module.exports = {
  equal: conditionalWhereEqual,
  op: conditionalWhereOp,
  in: conditionalWhereIN,
  between: conditionalWhereBetween,
  like: conditionalWhereLike,
  caseInsensitive: conditionalWhereCaseInsensitive,
  inArrayExists: conditionalInArrayExists,
  isNot: conditionalWhereIsNot,
  hasAny: conditionalWhereHasAny,
  hasAll: conditionalWhereHasAll,
  arrayAll: conditionalWhereArrayAll,
  transformFilter,
  where,
  having,
  join,
};
