export function capitalizeEachWord(str) {
  var strArr = str.split(" ");

  for (var i = 0; i < strArr.length; i++) {
    strArr[i] = strArr[i][0].toUpperCase() + strArr[i].substr(1);
  }

  return strArr.join(" ");
}

export function sleep(secs) {
  return new Promise((resolve) => setTimeout(resolve, secs * 1000));
}
