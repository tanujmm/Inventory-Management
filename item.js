var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var dbName = "INVENTORYdb";
var relationName = "ITEMSDATA";
var connToken = "90934956|-31949252301077115|90959516";

setBaseUrl(jpdbBaseURL);

function validateData() {
  var itemId, itemName, openingStock, uom;

  itemId = $("#itemId").val();
  itemName = $("#itemName").val();
  openingStock = $("#openingStock").val();
  uom = $("#uom").val();

  if (itemId === "") {
    alert("Item Id missing");
    $("#itemId").focus();
    return;
  }

  if (itemName === "") {
    alert("Item Name missing");
    $("#itemName").focus();
    return;
  }
  if (openingStock === "") {
    alert("Opening Stock missing");
    $("#openingStock").focus();
    return;
  }
  if (uom === "") {
    alert(" uoM is missing");
    $("#uom").focus();
    return;
  }

  var jsonObj = {
    itemId: itemId,
    itemName: itemName,
    openingStock: openingStock,
    uom: uom,
    ItemsIssued: 0,
    ItemsReceived: 0,
  };
  return JSON.stringify(jsonObj);
}

function saveItem() {
  var jsonStrObj = validateData();
  if (!jsonStrObj) {
    return;
  }

  var putRequest = createPUTRequest(
    connToken,
    jsonStrObj,
    dbName,
    relationName
  );
  jQuery.ajaxSetup({ async: false });
  var resJsonObj = executeCommandAtGivenBaseUrl(
    putRequest,
    jpdbBaseURL,
    jpdbIML
  );
  jQuery.ajaxSetup({ async: true });
  resetForm();
  $("#itemId").focus();
}

function resetForm() {
  $("#itemId").val("");
  $("#itemName").val("");
  $("#openingStock").val("");
  $("#uom").val("");

  $("#itemId").prop("disabled", false);
  $("#save").prop("disabled", true);
  $("#edit").prop("disabled", true);
  $("#reset").prop("disabled", true);
  $("#itemId").focus();
}

function getitemIdNoAsJsonObj() {
  var itemId = $("#itemId").val();
  var jsonStr = {
    itemId: itemId,
  };
  return JSON.stringify(jsonStr);
}

function saveRecNo2LS(jsonObj) {
  var lvData = JSON.parse(jsonObj.data);
  localStorage.setItem("recno", lvData.rec_no);
}

function fillData(jsonObj) {
  saveRecNo2LS(jsonObj);
  var record = JSON.parse(jsonObj.data).record;
  $("#itemName").val(record.itemName);
  $("#openingStock").val(record.openingStock);
  $("#uom").val(record.uom);
  localStorage.setItem("curr_rec_no", data.rec_no);
}

function getItem() {
  var itemIdObj = getitemIdNoAsJsonObj();
  var getRequest = createGET_BY_KEYRequest(
    connToken,
    dbName,
    relationName,
    itemIdObj
  );
  jQuery.ajaxSetup({ async: false });
  var resJsonObj = executeCommandAtGivenBaseUrl(
    getRequest,
    jpdbBaseURL,
    jpdbIRL
  );
  jQuery.ajaxSetup({ async: true });

  if (resJsonObj.status === 400) {
    $("#save").prop("disabled", false);
    $("#reset").prop("disabled", false);
    $("#itemName").focus();
  } else if (resJsonObj.status === 200) {
    $("#itemId").prop("disabled", true);

    fillData(resJsonObj);

    $("#edit").prop("disabled", false);
    $("#reset").prop("disabled", false);
    $("#itemName").focus();
  }
}

function changeData() {
  $("#edit").prop("disabled", true);
  jsonChg = validateData();
  var updateRequest = createUPDATERecordRequest(
    connToken,
    jsonChg,
    dbName,
    relationName,
    localStorage.getItem("recno")
  );
  jQuery.ajaxSetup({ async: false });
  var resJsonObj = executeCommandAtGivenBaseUrl(
    updateRequest,
    jpdbBaseURL,
    jpdbIML
  );
  jQuery.ajaxSetup({ async: true });
  console.log(resJsonObj);
  resetForm();
  $("#itemId").focus();
}

// Delete Item
function deleteItem() {
  let recNo = localStorage.getItem("curr_rec_no");

  if (!recNo) {
    alert("Please search the item first before deleting.");
    return;
  }

  if (!confirm("Are you sure you want to delete this item?")) {
    return;
  }

  let removeReq = createREMOVERecordRequest(
    connToken,
    dbName,
    relationName,
    recNo
  );

  jQuery.ajaxSetup({ async: false });
  let result = executeCommandAtGivenBaseUrl(removeReq, jpdbBaseURL, jpdbIML);
  jQuery.ajaxSetup({ async: true });

  if (result.status === 200) {
    alert("Item Deleted Successfully");
    resetForm();
    localStorage.removeItem("curr_rec_no");
  } else {
    alert("Error deleting item: " + result.message);
  }
}
