var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var dbName = "INVENTORYdb";
var relationName = "ITEMSDATA";
var InwardName = "INWARD";
var connToken = "90934956|-31949252301077115|90959516";

setBaseUrl(jpdbBaseURL);

function resetForm() {
  $("#receiptNo").val("");
  $("#receiptDate").val("");
  $("#itemId").val("");
  $("#itemNameDisplay").text("");
  $("#qtyReceived").val("");
  localStorage.removeItem("curr_rec_no");
  $("#receiptNo").focus();
}

function receiptID() {
  let receiptNo = $("#receiptNo").val();
  if (!receiptNo) return;

  let req = createGET_BY_KEYRequest(
    connToken,
    dbName,
    InwardName,
    JSON.stringify({ ReceiptNo: receiptNo })
  );
  jQuery.ajaxSetup({ async: false });
  let result = executeCommandAtGivenBaseUrl(req, jpdbBaseURL, jpdbIRL);
  jQuery.ajaxSetup({ async: true });

  if (result.status === 200) {
    let parsed = JSON.parse(result.data);
    let data = parsed.record;
    // let data = JSON.parse(result.data).record;
    localStorage.setItem("curr_rec_no", parsed.rec_no);

    $("#receiptDate").val(data.ReceiptDate);
    $("#itemId").val(data.ItemID);
    $("#qtyReceived").val(data.QtyReceived);
  } else {
    alert("data not present");
    $("#receiptDate").text("");
    $("#itemId").focus();
  }
}

function checkItemID() {
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
    alert("data not present");
    $("#itemNameDisplay").text("");
    $("#itemId").focus();
  }
}

function saveReceipt() {
  let receiptNo = $("#receiptNo").val();
  let receiptDate = $("#receiptDate").val();
  let itemId = $("#itemId").val();
  let qtyReceived = $("#qtyReceived").val();

  if (!receiptNo || !receiptDate || !itemId || !qtyReceived) {
    alert("Please fill all fields");
    return;
  }

  let jsonObj = {
    ReceiptNo: receiptNo,
    ReceiptDate: receiptDate,
    ItemID: itemId,
    QtyReceived: parseFloat(qtyReceived),
  };

  var putRequest = createPUTRequest(
    connToken,
    JSON.stringify(jsonObj),
    dbName,
    InwardName
  );
  jQuery.ajaxSetup({ async: false });
  let result = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
  jQuery.ajaxSetup({ async: true });
  console.log("Save Receipt Response:", result);

  if (result.status === 200) {
    alert("Receipt Saved Successfully");
    updateStock(itemId, qtyReceived);
    resetForm();
  } else {
    alert("Error saving receipt: " + result.message);
  }
  resetForm();
  $("#receiptNo").focus();
}

function updateReceipt() {
  let recNo = localStorage.getItem("curr_rec_no");
  if (!recNo) {
    alert("Search receipt first before updating.");
    return;
  }

  let jsonObj = {
    ReceiptNo: $("#receiptNo").val(),
    ReceiptDate: $("#receiptDate").val(),
    ItemID: $("#itemId").val(),
    QtyReceived: parseFloat($("#qtyReceived").val()),
  };

  let updateReq = createUPDATERecordRequest(
    connToken,
    JSON.stringify(jsonObj),
    dbName,
    // inwardRel,
    InwardName,
    recNo
  );
  jQuery.ajaxSetup({ async: false });
  let result = executeCommandAtGivenBaseUrl(updateReq, jpdbBaseURL, jpdbIML);
  jQuery.ajaxSetup({ async: true });

  if (result.status === 200) {
    alert("Receipt Updated Successfully");
    updateStock(jsonObj.ItemID, jsonObj.QtyReceived);
    resetForm();
  } else {
    alert("Error updating receipt: " + result.message);
  }
}

function updateStock(itemId, qtyReceived) {
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
    var data = JSON.parse(result.data).record;
    var newStock = parseFloat(data.openingStock) + parseFloat(qtyReceived);
  }
  let updateObj = {
    itemId: itemId,
    itemName: data.itemName,
    openingStock: newStock,
    uom: data.uom,
    ItemsIssued: data.ItemsIssued,
    ItemsReceived: parseFloat(data.ItemsReceived) + parseFloat(qtyReceived),
  };
  let recNo = JSON.parse(result.data).rec_no;
  let updateReq = createUPDATERecordRequest(
    connToken,
    JSON.stringify(updateObj),
    dbName,
    relationName,
    recNo
  );
  jQuery.ajaxSetup({ async: false });
  let updateResult = executeCommandAtGivenBaseUrl(
    updateReq,
    jpdbBaseURL,
    jpdbIML
  );
  jQuery.ajaxSetup({ async: true });

  console.log("Stock Updated:", updateResult);
}
