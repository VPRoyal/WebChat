import pkg from "lodash";
import fs from "fs";
import path from "path";
const { find, set } = pkg;
import { dataMap } from "./database/database.js";
// Load the JSON data containing your records
// import database from "./database/executive.json" assert { type: 'json' } // Replace with the path to your JSON file

// Function to update a field by ID using Lodash
const updateDataByField = ({
  databaseName,
  fieldToFind,
  fieldValue,
  fieldToUpdate,
  newValue,
}) => {
  // Here to check if database not there
  if (!(databaseName && fieldToFind && fieldValue && fieldToUpdate && newValue))
    return { success: true, message: "Invalid request" };
  const database = dataMap[databaseName];
  database.read();
  const recordToUpdate = find(database.data, { [fieldToFind]: fieldValue });
  if (recordToUpdate) {
    if (Array.isArray(fieldToUpdate)) {
      for (let i = 0; i < fieldToUpdate.length; i++) {
        set(recordToUpdate, fieldToUpdate[i], newValue[i]);
      }
    } else set(recordToUpdate, fieldToUpdate, newValue);
    // const currentDir = path.dirname(new URL(import.meta.url).pathname)
    // const executivePath= path.resolve(currentDir,  'database/executive.json')
    // writeData(executivePath, database)
    database.write();
    return { success: true, message: "Data Updated" };
  } else {
    return { success: false, message: "Service not working" };
  }
};

const addData = ({ databaseName, data }) => {
  // console.log(req)
  if (!(databaseName, data?.id)) {
    return { success: false, message: "Invalid request" };
  }
  const database = dataMap[databaseName];
  database.read();
  database.data.push(data);
  database.write();
  return { success: true, message: "Data Updated", id: data.id };
};

const findData = ({ databaseName, field, value }) => {
  const database = dataMap[databaseName];
  database.read();
  const record = find(database.data, { [field]: value });
  if (record) return { success: true, data: record };
  return { success: false, data: [] };
};
const addDataByField = ({
  databaseName,
  fieldToFind,
  fieldValue,
  fieldToAdd,
  newValue,
}) => {
  const database = dataMap[databaseName];
  database.read();
  const record = find(database.data, { [fieldToFind]: fieldValue });
  if (record) {
    if (!Array.isArray(fieldToAdd)) {
      fieldToAdd = [fieldToAdd];
      newValue = [newValue];
    }
    for (let i = 0; i < fieldToAdd.length; i++) {
      if (!Array.isArray(record[fieldToAdd[i]])) {
        return {
          success: false,
          message: "Data update failed",
          error: "Field is not an array",
        };
      }
      record[fieldToAdd[i]].push(newValue[i]);
    }

    database.write();
    return { success: true, message: "Data Updated", data: record };
  }
  return {
    success: false,
    error: "No record found",
    message: "No record found",
  };
};
export { updateDataByField, addData, findData, addDataByField };
