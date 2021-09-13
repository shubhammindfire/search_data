<?php

namespace App\Utils;

class Messages
{
	const NO_ADMIN_FOUND = "No admin found";
	const NO_PROPERTY_RECORD_FOUND = "No property record found";
	const NO_IMAGE_FOUND = "No image found";
	const ADMIN_DELETE_SUCCESS = "Successfully deleted admin";
	const ADMIN_DELETE_FAILURE = "Failed to delete admin";
	const ADMIN_NOT_ALLOWED_TO_DELETE_ONESELF = "An admin is not allowed to delete oneself";
	const CSV_FILE_NOT_FOUND = "CSV file not found";
	const WRONG_CSV_FILE_FORMAT = "Wrong CSV file format. Please upload CSV file with data in expected format only.";
	const ZIP_FILE_NOT_FOUND = "ZIP file not found";
	const UNABLE_TO_EXTRACT_ZIP_FILE = "Unable to extract zip file";
	const FAILED_TO_IMPORT_DATA = "Failed to import new PropertyRecord data";
	const PROPERTY_RECORD_DELETE_FAILURE = "Failed to delete property record";
	const PROPERTY_RECORD_EDIT_FAILURE = "Failed to edit property record";
	const PROPERTY_RECORD_ADD_FAILURE = "Failed to add property record";
}
