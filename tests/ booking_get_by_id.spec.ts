import { test, expect } from "@playwright/test";

import fs from "fs";


test("Verify GET /booking/{id} returns booking details", async ({ request }) => { 

    const jsonFile = "testData/createBooking_api.json";
    const requestBody = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));


    const response = await request.post("/booking", { data: requestBody });

    console.log(response);
    const responseBody = await response.json();
    console.log(responseBody);
    const bookingID = responseBody.bookingid;
    console.log("booking id is ", bookingID);


//get Booking ID details

    const responseData = await request.get(`/booking/${bookingID}`);
    console.log(responseData);

    const get_respponseBody = await responseData.json();
    console.log(get_respponseBody);
    expect(responseData.ok()).toBeTruthy();
    expect(responseData.status()).toBe(200);

})


