import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export function num2str(val) {
  if (val < 999) return val;
  if (!val) return "-";

  var s = ["", "k", "m", "b", "t"];

  var sNum = Math.floor(("" + val).length / 3);

  var sVal = parseFloat(
    (sNum != 0 ? val / Math.pow(1000, sNum) : val).toPrecision(4)
  );

  if (sVal % 1 != 0) {
    sVal = sVal.toFixed(2);
  }

  return sVal + s[sNum];
}

export function thousandsSeparators(num) {
  if (!num || num < 1000) return num;
  let numParts = num.toString().split(".");
  numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return numParts.join(".");
}

export function date2rel(dateStr) {
  dayjs.extend(relativeTime);
  return dayjs(dateStr).from(dayjs());
}

export function date2str(dateStr) {
  return dayjs(dateStr).format("MM/DD/YYYY");
}

export function validateEmail(email) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
}

export function validateUsername(username) {
  return /^[a-z0-9_-]{3,16}$/.test(username);
}

export function removeNull(obj) {
  Object.keys(obj).forEach(
    (k) => !obj[k] && obj[k] !== undefined && obj[k] !== 0 && delete obj[k]
  );
  return obj;
}

export function findComment(nComments, id) {
  let comm;
  for (let i = 0; i < nComments.length; i++) {
    let found = _findComment(nComments[i], id);
    if (found) {
      comm = found;
      break;
    }
  }
  return comm;
}
function _findComment(comm, id) {
  if (comm._id == id) return comm;
  if (comm.replies) {
    for (let i = 0; i < comm.replies.length; i++) {
      let found = _findComment(comm.replies[i], id);
      if (found) {
        comm.replies = [...comm.replies];
        return found;
      }
    }
  }
}

export function findAndDeleteComment(comms, id) {
  if (comms.findIndex((c) => c._id == id) > -1) {
    comms = comms.filter((c) => c._id != id);
    return comms;
  }
  for (let i = 0; i < comms.length; i++) {
    if (comms[i].replies) {
      let found = findAndDeleteComment(comms[i].replies, id);
      if (found) {
        comms[i].replies = [...found];
        return [...comms];
      }
    }
  }
  return false;
}

export function truncateCaptionPreview(caption) {
  if (caption.length > 222) return caption.substring(0, 222) + "...";
  else return caption;
}
export function truncateTitlePreview(title) {
  if (title.length > 42) return title.substring(0, 52) + "...";
  else return title;
}

export function convertHashtagsToLinks(str) {
  return str
    .replace(/</g, "&lt")
    .replace(/>/g, "&gt")
    .replace(
      /(#[a-z0-9_-]+)/g,
      (match) => `<a href='/search?h=${match.slice(1)}'>${match}</a>`
    );
}

export function convertVideoTimestampsToLinks(videoId, str) {
  return str.replace(
    /(?:([0-5]?[0-9]):)?([0-5]?[0-9]):([0-5][0-9])/g,
    (match, h, m, s) =>
      `<a onclick="vidJump('${videoId}', ${h},${m},${s})">${match}</a>`
  );
}

export function converAtMentionsToLinks(str) {
  return str.replace(/@[a-z0-9_-]{3,16}/g, (match) => {
    return `<a href='/profile/${match.slice(1)}'>${match}</a>`;
  });
}

export function parseLinks(str) {
  return converAtMentionsToLinks(convertHashtagsToLinks(str));
}

export function stripLinks(str) {
  return str
    .replace(/&lt/g, "<")
    .replace(/&gt/g, ">")
    .replace(/<a.*?[^=]>/g, "")
    .replace(/<\/a>/g, "");
}

export function getCommentId(search) {
  search = decodeURI(search.slice(1));
  if (search.indexOf("c=") > -1) {
    let c = null;
    search.split("&").forEach((kv) => {
      if (kv.split("=")[0] == "c") c = kv.split("=")[1];
    });
    return c;
  }
  return null;
}

export function getPaymentId(search) {
  search = decodeURI(search.slice(1));
  if (search.indexOf("p=") > -1) {
    let c = null;
    search.split("&").forEach((kv) => {
      if (kv.split("=")[0] == "p") c = kv.split("=")[1];
    });
    return c;
  }
  return null;
}
export function getSubId(search) {
  search = decodeURI(search.slice(1));
  if (search.indexOf("s=") > -1) {
    let s = null;
    search.split("&").forEach((kv) => {
      if (kv.split("=")[0] == "s") s = kv.split("=")[1];
    });
    return s;
  }
  return null;
}

export function getSearchQuery(search) {
  search = decodeURI(search.slice(1));
  if (search.indexOf("s=") > -1) {
    let s = null;
    search.split("&").forEach((kv) => {
      if (kv.split("=")[0] == "s") s = kv.split("=")[1];
    });
    return s;
  }
  return null;
}

export function parseHashtags(str) {
  let tags = str.match(/(#[a-z0-9_-]+)/gi);
  if (tags) return tags.map((tag) => tag.slice(1).toLowerCase());
  else return [];
}
export function removeHashtags(str) {
  let terms = str
    .replace(/[.,\/!$%\^&\*;:{}=\`~()]/g, "")
    .replace(/(#[a-z0-9_-]+)/gi, "__removed_981_hashtag__")
    .split("__removed_981_hashtag__")
    .map((term) => term.trim())
    .filter((term) => term);
  if (terms.length) return terms;
  else return [];
}

export function getHashtag(search) {
  search = decodeURI(search.slice(1));
  if (search.indexOf("h=") > -1) {
    let h = null;
    search.split("&").forEach((kv) => {
      if (kv.split("=")[0] == "h") h = kv.split("=")[1];
    });
    return h;
  }
  return null;
}

export function getVideoTimestamp(search) {
  search = decodeURI(search.slice(1));
  let ts = {};
  if (search.indexOf("h=") > -1) {
    let h = null;
    search.split("&").forEach((kv) => {
      if (kv.split("=")[0] == "h") h = kv.split("=")[1];
    });
    ts.h = h;
  }
  if (search.indexOf("m=") > -1) {
    let m = null;
    search.split("&").forEach((kv) => {
      if (kv.split("=")[0] == "m") m = kv.split("=")[1];
    });
    ts.m = m;
  }
  if (search.indexOf("s=") > -1) {
    let s = null;
    search.split("&").forEach((kv) => {
      if (kv.split("=")[0] == "s") s = kv.split("=")[1];
    });
    ts.s = s;
  }
  if (!ts.h && !ts.m & !ts.s) return null;

  return ts;
}

export function printCentsToCurreny(cents) {
  return "$" + (parseFloat(cents) / 100).toFixed(2);
}
