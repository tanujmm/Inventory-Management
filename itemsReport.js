// // itemsReport.js - final robust version
// var jpdbBaseURL = "http://api.login2explore.com:5577";
// var jpdbIRL = "/api/irl";
// var dbName = "INVENTORYdb";
// var relationName = "ITEMSDATA";
// var connToken = "90934956|-31949252301077115|90959516";

// /* ---------- Helpers ---------- */
// function escapeHtml(unsafe) {
//   return String(unsafe || "")
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;")
//     .replace(/"/g, "&quot;")
//     .replace(/'/g, "&#039;");
// }

// function getFieldCaseInsensitive(obj, ...candidates) {
//   if (!obj) return undefined;
//   for (let c of candidates) {
//     if (obj.hasOwnProperty(c)) return obj[c];
//   }
//   // last resort: try case-insensitive match
//   let keys = Object.keys(obj);
//   for (let k of keys) {
//     for (let c of candidates) {
//       if (k.toLowerCase() === c.toLowerCase()) return obj[k];
//     }
//   }
//   return undefined;
// }

// function isNumericString(s) {
//   return (
//     typeof s === "string" && s.trim() !== "" && /^-?\d+(\.\d+)?$/.test(s.trim())
//   );
// }

// /* ---------- UI Helpers ---------- */
// function resetReportForm() {
//   $("#startId").val("");
//   $("#endId").val("");
//   $("#reportTable tbody").empty();
//   $("#startId").focus();
// }

// /* ---------- Main: getItemReport ---------- */
// function getItemReport() {
//   // Basic dependency checks
//   if (typeof executeCommandAtGivenBaseUrl !== "function") {
//     const msg =
//       "JPDB helper 'executeCommandAtGivenBaseUrl' not found. Make sure you included jpdb-commons.js BEFORE itemsReport.js.";
//     console.error(msg);
//     alert(msg);
//     return;
//   }
//   if (typeof $ === "undefined") {
//     alert("jQuery not found. Include jQuery before itemsReport.js.");
//     return;
//   }

//   let startIdRaw = $("#startId").val();
//   let endIdRaw = $("#endId").val();

//   if (!startIdRaw || !endIdRaw) {
//     alert("Please enter both Start Item ID and End Item ID.");
//     return;
//   }

//   let startId = startIdRaw.trim();
//   let endId = endIdRaw.trim();

//   // Auto-swap if start > end for numeric or lexicographic
//   let numericRange = isNumericString(startId) && isNumericString(endId);
//   if (numericRange) {
//     let sN = Number(startId),
//       eN = Number(endId);
//     if (sN > eN) {
//       let t = sN;
//       sN = eN;
//       eN = t;
//       startId = String(sN);
//       endId = String(eN);
//     }
//   } else {
//     if (startId > endId) {
//       let t = startId;
//       startId = endId;
//       endId = t;
//     }
//   }

//   // Build raw GET_ALL request (no helper function used)
//   let reqObj = {
//     token: connToken,
//     dbName: dbName,
//     cmd: "GET_ALL",
//     rel: relationName,
//     start: 1,
//     limit: 1000,
//   };

//   jQuery.ajaxSetup({ async: false });
//   let res;
//   try {
//     res = executeCommandAtGivenBaseUrl(
//       JSON.stringify(reqObj),
//       jpdbBaseURL,
//       jpdbIRL
//     );
//   } catch (err) {
//     jQuery.ajaxSetup({ async: true });
//     console.error("executeCommandAtGivenBaseUrl threw:", err);
//     alert("Request failed. Check console for details.");
//     return;
//   }
//   jQuery.ajaxSetup({ async: true });

//   if (!res || res.status !== 200) {
//     console.error("GET_ALL error or no response:", res);
//     $("#reportTable tbody")
//       .empty()
//       .append(
//         "<tr><td colspan='3'>Error fetching items. See console.</td></tr>"
//       );
//     return;
//   }

//   let parsed;
//   try {
//     parsed = JSON.parse(res.data);
//   } catch (e) {
//     console.error("Failed to parse response.data:", res.data, e);
//     $("#reportTable tbody")
//       .empty()
//       .append("<tr><td colspan='3'>Invalid server response.</td></tr>");
//     return;
//   }

//   let records = parsed.records || [];
//   if (!Array.isArray(records) || records.length === 0) {
//     $("#reportTable tbody")
//       .empty()
//       .append("<tr><td colspan='3'>No items in database.</td></tr>");
//     return;
//   }

//   // Filter records in range. handle multiple possible key names
//   let filtered = records.filter(function (r) {
//     let rec = r.record || {};
//     // possible ID fields in different casings
//     let idVal = getFieldCaseInsensitive(
//       rec,
//       "ItemID",
//       "itemId",
//       "ItemId",
//       "ITEMID"
//     );
//     if (idVal === undefined || idVal === null) return false;
//     let idStr = String(idVal);

//     if (numericRange) {
//       // numeric compare
//       return Number(idStr) >= Number(startId) && Number(idStr) <= Number(endId);
//     } else {
//       // lexicographic compare
//       return idStr >= startId && idStr <= endId;
//     }
//   });

//   // Render table
//   $("#reportTable tbody").empty();
//   if (filtered.length === 0) {
//     $("#reportTable tbody").append(
//       "<tr><td colspan='3'>No items found in this range.</td></tr>"
//     );
//     return;
//   }

//   filtered.forEach(function (r) {
//     let rec = r.record || {};

//     // resolve standard fields with fallbacks (case-insensitive)
//     let id =
//       getFieldCaseInsensitive(rec, "ItemID", "itemId", "ItemId", "ITEMID") ||
//       "";
//     let name =
//       getFieldCaseInsensitive(rec, "ItemName", "itemName", "ITEMNAME") || "";
//     let opening =
//       parseFloat(
//         getFieldCaseInsensitive(
//           rec,
//           "OpeningStock",
//           "openingStock",
//           "Openingstock"
//         ) || 0
//       ) || 0;
//     let received =
//       parseFloat(
//         getFieldCaseInsensitive(
//           rec,
//           "ItemsReceived",
//           "itemsReceived",
//           "Itemsreceived"
//         ) || 0
//       ) || 0;
//     let issued =
//       parseFloat(
//         getFieldCaseInsensitive(
//           rec,
//           "ItemsIssued",
//           "itemsIssued",
//           "Itemsissued"
//         ) || 0
//       ) || 0;

//     // Current stock computed as Opening + Received - Issued
//     let current = opening + received - issued;

//     let row =
//       "<tr>" +
//       "<td>" +
//       escapeHtml(id) +
//       "</td>" +
//       "<td>" +
//       escapeHtml(name) +
//       "</td>" +
//       "<td>" +
//       current.toFixed(3) +
//       "</td>" +
//       "</tr>";

//     $("#reportTable tbody").append(row);
//   });
// }

// itemsReport.js - final robust version with ID fix
var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var dbName = "INVENTORYdb";
var relationName = "ITEMSDATA";
var connToken = "90934956|-31949252301077115|90959516";

/* ---------- Helpers ---------- */
function escapeHtml(unsafe) {
  return String(unsafe || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getFieldCaseInsensitive(obj, ...candidates) {
  if (!obj) return undefined;
  for (let c of candidates) {
    if (obj.hasOwnProperty(c)) return obj[c];
  }
  // last resort: case-insensitive
  let keys = Object.keys(obj);
  for (let k of keys) {
    for (let c of candidates) {
      if (k.toLowerCase() === c.toLowerCase()) return obj[k];
    }
  }
  return undefined;
}

function isNumericString(s) {
  return (
    typeof s === "string" && s.trim() !== "" && /^-?\d+(\.\d+)?$/.test(s.trim())
  );
}

/* ---------- UI Helpers ---------- */
function resetReportForm() {
  $("#startId").val("");
  $("#endId").val("");
  $("#reportTable tbody").empty();
  $("#startId").focus();
}

/* ---------- Main: getItemReport ---------- */
function getItemReport() {
  if (typeof executeCommandAtGivenBaseUrl !== "function") {
    const msg =
      "JPDB helper 'executeCommandAtGivenBaseUrl' not found. Make sure you included jpdb-commons.js BEFORE itemsReport.js.";
    console.error(msg);
    alert(msg);
    return;
  }
  if (typeof $ === "undefined") {
    alert("jQuery not found. Include jQuery before itemsReport.js.");
    return;
  }

  let startIdRaw = $("#startId").val();
  let endIdRaw = $("#endId").val();

  if (!startIdRaw || !endIdRaw) {
    alert("Please enter both Start Item ID and End Item ID.");
    return;
  }

  let startId = startIdRaw.trim();
  let endId = endIdRaw.trim();

  // Auto-swap if start > end
  let numericRange = isNumericString(startId) && isNumericString(endId);
  if (numericRange) {
    let sN = Number(startId),
      eN = Number(endId);
    if (sN > eN) {
      let t = sN;
      sN = eN;
      eN = t;
      startId = String(sN);
      endId = String(eN);
    }
  } else {
    if (startId > endId) {
      let t = startId;
      startId = endId;
      endId = t;
    }
  }

  // Build raw GET_ALL request
  let reqObj = {
    token: connToken,
    dbName: dbName,
    cmd: "GET_ALL",
    rel: relationName,
    start: 1,
    limit: 1000,
  };

  jQuery.ajaxSetup({ async: false });
  let res;
  try {
    res = executeCommandAtGivenBaseUrl(
      JSON.stringify(reqObj),
      jpdbBaseURL,
      jpdbIRL
    );
  } catch (err) {
    jQuery.ajaxSetup({ async: true });
    console.error("executeCommandAtGivenBaseUrl threw:", err);
    alert("Request failed. Check console for details.");
    return;
  }
  jQuery.ajaxSetup({ async: true });

  if (!res || res.status !== 200) {
    console.error("GET_ALL error or no response:", res);
    $("#reportTable tbody")
      .empty()
      .append(
        "<tr><td colspan='3'>Error fetching items. See console.</td></tr>"
      );
    return;
  }

  let parsed;
  try {
    parsed = JSON.parse(res.data);
  } catch (e) {
    console.error("Failed to parse response.data:", res.data, e);
    $("#reportTable tbody")
      .empty()
      .append("<tr><td colspan='3'>Invalid server response.</td></tr>");
    return;
  }

  let records = parsed.records || [];
  if (!Array.isArray(records) || records.length === 0) {
    $("#reportTable tbody")
      .empty()
      .append("<tr><td colspan='3'>No items in database.</td></tr>");
    return;
  }

  // Filter records in range
  let filtered = records.filter(function (r) {
    let rec = r.record || {};
    let idVal = getFieldCaseInsensitive(
      rec,
      "ItemID",
      "itemId",
      "ItemId",
      "ITEMID"
    );
    if (idVal === undefined || idVal === null) return false;

    let idStr = String(idVal);

    if (isNumericString(idStr) && numericRange) {
      return Number(idStr) >= Number(startId) && Number(idStr) <= Number(endId);
    } else {
      let len = Math.max(startId.length, endId.length, idStr.length);
      let s = startId.padStart(len, "0");
      let e = endId.padStart(len, "0");
      let v = idStr.padStart(len, "0");
      return v >= s && v <= e;
    }
  });

  // Render table
  $("#reportTable tbody").empty();
  if (filtered.length === 0) {
    $("#reportTable tbody").append(
      "<tr><td colspan='3'>No items found in this range.</td></tr>"
    );
    return;
  }

  filtered.forEach(function (r) {
    let rec = r.record || {};

    let id =
      getFieldCaseInsensitive(rec, "ItemID", "itemId", "ItemId", "ITEMID") ||
      "";
    let name =
      getFieldCaseInsensitive(rec, "ItemName", "itemName", "ITEMNAME") || "";
    let opening =
      parseFloat(
        getFieldCaseInsensitive(
          rec,
          "OpeningStock",
          "openingStock",
          "Openingstock"
        ) || 0
      ) || 0;
    let received =
      parseFloat(
        getFieldCaseInsensitive(
          rec,
          "ItemsReceived",
          "itemsReceived",
          "Itemsreceived"
        ) || 0
      ) || 0;
    let issued =
      parseFloat(
        getFieldCaseInsensitive(
          rec,
          "ItemsIssued",
          "itemsIssued",
          "Itemsissued"
        ) || 0
      ) || 0;

    let current = opening + received - issued;

    let row =
      "<tr>" +
      "<td>" +
      escapeHtml(id) +
      "</td>" +
      "<td>" +
      escapeHtml(name) +
      "</td>" +
      "<td>" +
      current.toFixed(3) +
      "</td>" +
      "</tr>";

    $("#reportTable tbody").append(row);
  });
}
