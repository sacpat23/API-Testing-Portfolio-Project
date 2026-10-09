import { test, expect } from "@playwright/test";
import Ajv from 'ajv';
import fs from 'fs';
import path from 'path';


test("Verify booking API response matches the expected schema", async ({ request }) => {
    const jsonFile = path.resolve(__dirname, '..', 'testData', 'createBooking_api.json');
    const requestBody = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));

    const response = await request.post("/booking", { data: requestBody });
    const responseBody = await response.json();
    console.log(responseBody);

    const schema = {
        "type": "object",
        "properties": {
            "bookingid": {
                "type": "integer"
            },
            "booking": {
                "type": "object",
                "properties": {
                    "firstname": {
                        "type": "string"
                    },
                    "lastname": {
                        "type": "string"
                    },
                    "totalprice": {
                        "type": "integer"
                    },
                    "depositpaid": {
                        "type": "boolean"
                    },
                    "bookingdates": {
                        "type": "object",
                        "properties": {
                            "checkin": {
                                "type": "string"
                            },
                            "checkout": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "checkin",
                            "checkout"
                        ]
                    },
                    "additionalneeds": {
                        "type": "string"
                    }
                },
                "required": [
                    "firstname",
                    "lastname",
                    "totalprice",
                    "depositpaid",
                    "bookingdates",
                    "additionalneeds"
                ]
            }
        },
        "required": [
            "bookingid",
            "booking"
        ]
    };

    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const isValid = validate(responseBody);

    expect(isValid).toBeTruthy();
});