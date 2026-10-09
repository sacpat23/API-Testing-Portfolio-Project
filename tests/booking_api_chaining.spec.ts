/*
1) create booking --- > booking id
2) create a token (post)
3) update booking (put)
*/

import { test, expect } from "@playwright/test";
import fs from 'fs';
import path from 'path';

function readjson(filePath: string) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Create Booking ID

test("Verify end-to-end booking update flow using API chaining", async ({ request }) => {
    const inputDir = path.resolve(__dirname, '..', 'testData');
    const createbooking_requestBody = readjson(path.join(inputDir, 'createBooking_api.json'));

    const createbooking_response = await request.post('/booking', { data: createbooking_requestBody });

    const responseBody = await createbooking_response.json();
    console.log(responseBody);
    expect(createbooking_response.ok()).toBeTruthy();
    expect(createbooking_response.status()).toBe(200);

    const bookingid = responseBody.bookingid;
    console.log("Booking ID is", bookingid);

    const token_requestBody = readjson(path.join(inputDir, 'token_api.json'));
    const token_response = await request.post('/auth', { data: token_requestBody });

    const token_responseBody = await token_response.json();
    expect(token_response.ok()).toBeTruthy();
    expect(token_response.status()).toBe(200);

    const token = token_responseBody.token;
    console.log("Token is ", token);

    const updatebooking_requestBody = readjson(path.join(inputDir, 'updateBooking_api.json'));

    const updatebooking_response = await request.put(`/booking/${bookingid}`, {
        headers: { "Cookie": `token=${token}` },
        data: updatebooking_requestBody
    });

    expect(updatebooking_response.ok()).toBeTruthy();
    expect(updatebooking_response.status()).toBe(200);

    const update_responseBody = await updatebooking_response.json();
    console.log(update_responseBody);
});