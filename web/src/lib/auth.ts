const getData = (field: string): string | null => {
  const data = sessionStorage.getItem("wsauth");
  if (!data) return null;
  return JSON.parse(data)[field];
};

export {getData};