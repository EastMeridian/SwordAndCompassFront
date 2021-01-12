export function transformToAssocArray(prmstr: string) {
  const params: Record<string, any> = {};
  const prmarr = prmstr.split('&');
  for (let i = 0; i < prmarr.length; i++) {
    const tmparr = prmarr[i].split('=');
    // eslint-disable-next-line prefer-destructuring
    params[tmparr[0]] = tmparr[1];
  }
  return params;
}

export function getSearchParameters() {
  const prmstr = window.location.search.substr(1);
  return prmstr != null && prmstr !== '' ? transformToAssocArray(prmstr) : {};
}
