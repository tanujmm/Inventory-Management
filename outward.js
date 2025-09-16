// var jpdbBaseURL = "http://api.login2explore.com:5577";
// var jpdbIRL = "/api/irl";
// var jpdbIML = "/api/iml";
// var dbName = "INVENTORYdb";
// var relationName = "ITEMSDATA";
// var outwardRel = "OUTWARD";
// var connToken = "90934956|-31949252301077115|90959516";

// setBaseUrl(jpdbBaseURL);

// // Reset form
// function resetOutwardForm() {
//   $("#issueNo").val("");
//   $("#issueDate").val("");
//   $("#itemId").val("");
//   $("#itemNameDisplay").text("");
//   $("#qtyIssued").val("");
//   localStorage.removeItem("curr_rec_no");
//   $("#issueNo").focus();
// }

// // New Form
// function newOutward() {
//   resetOutwardForm();
//   $("#issueNo").focus();
// }

// // Get Issue by ID
// function getIssueById() {
//   let issueNo = $("#issueNo").val();
//   if (!issueNo) return;

//   let req = createGET_BY_KEYRequest(
//     connToken,
//     dbName,
//     outwardRel,
//     JSON.stringify({ IssueNo: issueNo })
//   );
//   jQuery.ajaxSetup({ async: false });
//   let result = executeCommandAtGivenBaseUrl(req, jpdbBaseURL, jpdbIRL);
//   jQuery.ajaxSetup({ async: true });

//   if (result.status === 200) {
//     let parsed = JSON.parse(result.data);
//     let data = parsed.record;
//     localStorage.setItem("curr_rec_no", parsed.rec_no);

//     $("#issueDate").val(data.IssueDate);
//     $("#itemId").val(data.ItemID);
//     $("#qtyIssued").val(data.QtyIssued);
//   } else {
//     alert("No issue record found, enter new details.");
//   }
// }

// // Check Item ID and fetch item name
// function checkItemIDOut() {
//   let itemId = $("#itemId").val();
//   if (!itemId) return;

//   let req = createGET_BY_KEYRequest(
//     connToken,
//     dbName,
//     relationName,
//     JSON.stringify({ itemId: itemId })
//   );
//   jQuery.ajaxSetup({ async: false });
//   let result = executeCommandAtGivenBaseUrl(req, jpdbBaseURL, jpdbIRL);
//   jQuery.ajaxSetup({ async: true });

//   if (result.status === 200) {
//     let data = JSON.parse(result.data).record;
//     $("#itemNameDisplay").text(data.itemName);
//   } else {
//     alert("Item not found in master.");
//     $("#itemNameDisplay").text("");
//   }
// }

// // Save Issue Entry
// function saveOutward() {
//   let issueNo = $("#issueNo").val();
//   let issueDate = $("#issueDate").val();
//   let itemId = $("#itemId").val();
//   let qtyIssued = $("#qtyIssued").val();

//   if (!issueNo || !issueDate || !itemId || !qtyIssued) {
//     alert("Please fill all fields");
//     return;
//   }

//   let jsonObj = {
//     IssueNo: issueNo,
//     IssueDate: issueDate,
//     ItemID: itemId,
//     QtyIssued: parseFloat(qtyIssued),
//   };

//   let putRequest = createPUTRequest(
//     connToken,
//     JSON.stringify(jsonObj),
//     dbName,
//     outwardRel
//   );
//   jQuery.ajaxSetup({ async: false });
//   let result = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
//   jQuery.ajaxSetup({ async: true });

//   if (result.status === 200) {
//     alert("Issue Saved Successfully");
//     reduceStock(itemId, qtyIssued);
//     resetOutwardForm();
//   } else {
//     alert("Error saving issue: " + result.message);
//   }
// }

// // Update Issue Entry
// function updateOutward() {
//   let recNo = localStorage.getItem("curr_rec_no");
//   if (!recNo) {
//     alert("Search issue first before updating.");
//     return;
//   }

//   let jsonObj = {
//     IssueNo: $("#issueNo").val(),
//     IssueDate: $("#issueDate").val(),
//     ItemID: $("#itemId").val(),
//     QtyIssued: parseFloat($("#qtyIssued").val()),
//   };

//   let updateReq = createUPDATERecordRequest(
//     connToken,
//     JSON.stringify(jsonObj),
//     dbName,
//     outwardRel,
//     recNo
//   );
//   jQuery.ajaxSetup({ async: false });
//   let result = executeCommandAtGivenBaseUrl(updateReq, jpdbBaseURL, jpdbIML);
//   jQuery.ajaxSetup({ async: true });

//   if (result.status === 200) {
//     alert("Issue Updated Successfully");
//     reduceStock(jsonObj.ItemID, jsonObj.QtyIssued);
//     resetOutwardForm();
//   } else {
//     alert("Error updating issue: " + result.message);
//   }
// }

// // Reduce stock after issue
// function reduceStock(itemId, qtyIssued) {
//   let getReq = createGET_BY_KEYRequest(
//     connToken,
//     dbName,
//     relationName,
//     JSON.stringify({ itemId: itemId })
//   );
//   jQuery.ajaxSetup({ async: false });
//   let result = executeCommandAtGivenBaseUrl(getReq, jpdbBaseURL, jpdbIRL);
//   jQuery.ajaxSetup({ async: true });

//   if (result.status === 200) {
//     let data = JSON.parse(result.data).record;
//     let newStock = parseFloat(data.openingStock) - parseFloat(qtyIssued);

//     if (newStock < 0) {
//       alert("Not enough stock available!");
//       return;
//     }

//     let updateObj = {
//       itemId: itemId,
//       itemName: data.itemName,
//       openingStock: newStock,
//       uom: data.uom,
//       ItemsIssued: parseFloat(data.ItemsIssued) + parseFloat(qtyIssued),
//       ItemsReceived: data.ItemsReceived,
//     };

//     let recNo = JSON.parse(result.data).rec_no;
//     let updateReq = createUPDATERecordRequest(
//       connToken,
//       JSON.stringify(updateObj),
//       dbName,
//       relationName,
//       recNo
//     );
//     jQuery.ajaxSetup({ async: false });
//     let updateResult = executeCommandAtGivenBaseUrl(
//       updateReq,
//       jpdbBaseURL,
//       jpdbIML
//     );
//     jQuery.ajaxSetup({ async: true });

//     console.log("Stock Reduced:", updateResult);
//   }
// }

var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var dbName = "INVENTORYdb";
var relationName = "ITEMSDATA";
var outwardRel = "OUTWARD";
var connToken = "90934956|-31949252301077115|90959516";

setBaseUrl(jpdbBaseURL);

// Reset form
function resetOutwardForm() {
  $("#issueNo").val("");
  $("#issueDate").val("");
  $("#itemId").val("");
  $("#itemNameDisplay").text("");
  $("#qtyIssued").val("");
  localStorage.removeItem("curr_rec_no");
  localStorage.removeItem("old_qty"); // ✅ clear old qty when resetting
  $("#issueNo").focus();
}

// New Form
function newOutward() {
  resetOutwardForm();
  $("#issueNo").focus();
}

// Get Issue by ID
function getIssueById() {
  let issueNo = $("#issueNo").val();
  if (!issueNo) return;

  let req = createGET_BY_KEYRequest(
    connToken,
    dbName,
    outwardRel,
    JSON.stringify({ IssueNo: issueNo })
  );
  jQuery.ajaxSetup({ async: false });
  let result = executeCommandAtGivenBaseUrl(req, jpdbBaseURL, jpdbIRL);
  jQuery.ajaxSetup({ async: true });

  if (result.status === 200) {
    let parsed = JSON.parse(result.data);
    let data = parsed.record;
    localStorage.setItem("curr_rec_no", parsed.rec_no);

    $("#issueDate").val(data.IssueDate);
    $("#itemId").val(data.ItemID);
    $("#qtyIssued").val(data.QtyIssued);

    localStorage.setItem("old_qty", data.QtyIssued); // ✅ store old quantity
  } else {
    alert("No issue record found, enter new details.");
    localStorage.removeItem("old_qty");
  }
}

// Check Item ID and fetch item name
function checkItemIDOut() {
  let itemId = $("#itemId").val();
  if (!itemId) return;

  let req = createGET_BY_KEYRequest(
    connToken,
    dbName,
    relationName,
    JSON.stringify({ itemId: itemId })
  );
  jQuery.ajaxSetup({ async: false });
  let result = executeCommandAtGivenBaseUrl(req, jpdbBaseURL, jpdbIRL);
  jQuery.ajaxSetup({ async: true });

  if (result.status === 200) {
    let data = JSON.parse(result.data).record;
    $("#itemNameDisplay").text(data.itemName);
  } else {
    alert("Item not found in master.");
    $("#itemNameDisplay").text("");
  }
}

// Save Issue Entry
function saveOutward() {
  let issueNo = $("#issueNo").val();
  let issueDate = $("#issueDate").val();
  let itemId = $("#itemId").val();
  let qtyIssued = $("#qtyIssued").val();

  if (!issueNo || !issueDate || !itemId || !qtyIssued) {
    alert("Please fill all fields");
    return;
  }

  let jsonObj = {
    IssueNo: issueNo,
    IssueDate: issueDate,
    ItemID: itemId,
    QtyIssued: parseFloat(qtyIssued),
  };

  let putRequest = createPUTRequest(
    connToken,
    JSON.stringify(jsonObj),
    dbName,
    outwardRel
  );
  jQuery.ajaxSetup({ async: false });
  let result = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
  jQuery.ajaxSetup({ async: true });

  if (result.status === 200) {
    alert("Issue Saved Successfully");
    reduceStock(itemId, parseFloat(qtyIssued)); // ✅ total issue qty
    resetOutwardForm();
  } else {
    alert("Error saving issue: " + result.message);
  }
}

// Update Issue Entry
function updateOutward() {
  let recNo = localStorage.getItem("curr_rec_no");
  let oldQty = parseFloat(localStorage.getItem("old_qty") || 0);

  if (!recNo) {
    alert("Search issue first before updating.");
    return;
  }

  let newQty = parseFloat($("#qtyIssued").val());
  let diff = newQty - oldQty; // ✅ only the change

  let jsonObj = {
    IssueNo: $("#issueNo").val(),
    IssueDate: $("#issueDate").val(),
    ItemID: $("#itemId").val(),
    QtyIssued: newQty,
  };

  let updateReq = createUPDATERecordRequest(
    connToken,
    JSON.stringify(jsonObj),
    dbName,
    outwardRel,
    recNo
  );
  jQuery.ajaxSetup({ async: false });
  let result = executeCommandAtGivenBaseUrl(updateReq, jpdbBaseURL, jpdbIML);
  jQuery.ajaxSetup({ async: true });

  if (result.status === 200) {
    alert("Issue Updated Successfully");
    reduceStock(jsonObj.ItemID, diff); // ✅ adjust only by the difference
    resetOutwardForm();
  } else {
    alert("Error updating issue: " + result.message);
  }
}

// Reduce stock after issue
function reduceStock(itemId, qtyChange) {
  // qtyChange can be positive (reduce stock) or negative (add stock back)

  let getReq = createGET_BY_KEYRequest(
    connToken,
    dbName,
    relationName,
    JSON.stringify({ itemId: itemId })
  );
  jQuery.ajaxSetup({ async: false });
  let result = executeCommandAtGivenBaseUrl(getReq, jpdbBaseURL, jpdbIRL);
  jQuery.ajaxSetup({ async: true });

  if (result.status === 200) {
    let parsed = JSON.parse(result.data);
    let data = parsed.record;

    let newStock = parseFloat(data.openingStock) - parseFloat(qtyChange);

    if (newStock < 0) {
      alert("Not enough stock available!");
      return;
    }

    let updateObj = {
      itemId: itemId,
      itemName: data.itemName,
      openingStock: newStock,
      uom: data.uom,
      ItemsIssued: parseFloat(data.ItemsIssued) + parseFloat(qtyChange), // ✅ add only the change
      ItemsReceived: data.ItemsReceived,
    };

    let updateReq = createUPDATERecordRequest(
      connToken,
      JSON.stringify(updateObj),
      dbName,
      relationName,
      parsed.rec_no
    );
    jQuery.ajaxSetup({ async: false });
    let updateResult = executeCommandAtGivenBaseUrl(
      updateReq,
      jpdbBaseURL,
      jpdbIML
    );
    jQuery.ajaxSetup({ async: true });

    console.log("Stock Adjusted:", updateResult);
  }
}
