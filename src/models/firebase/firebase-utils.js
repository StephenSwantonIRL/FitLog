export function convertResult(snapshot) {
  const objectArray = [];
  snapshot.forEach((doc) => {
    const returnedData = doc.data();
    returnedData._id = doc.id;
    objectArray.push(returnedData);
  });
  return objectArray;
}

export function addId(doc) {
  if (doc === undefined) return null;
  const returnedData = doc.data();
  returnedData._id = doc.id;
  return returnedData;
}
