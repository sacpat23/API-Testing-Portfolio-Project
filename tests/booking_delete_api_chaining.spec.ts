/*
Create booking
get booking
update booking(token needed)
delete booking (token needed)
*/

import { test, expect } from "@playwright/test";
import fs from 'fs';
import path from 'path';

function readJson(filePath: string) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

test('Verify end-to-end booking update flow using API chaining (end to end test)', async ({ request }) => {
    const inputDir = path.resolve(__dirname, '..', 'testData');

    const requestBody = readJson(path.join(inputDir, 'createBooking_api.json'));
    const post_response = await request.post("/booking", { data: requestBody });
    const post_responseBody = await post_response.json();
    console.log(post_responseBody);

    const bookingID = post_responseBody.bookingid;
    console.log("Booking ID is ", bookingID);

    const get_response = await request.get(`/booking/${bookingID}`);
    const get_responseBody = await get_response.json();
    console.log(get_responseBody);

    const token_requestBody = readJson(path.join(inputDir, 'token_api.json'));
    const token_response = await request.post('/auth', { data: token_requestBody });
    const token_responseBody = await token_response.json();
    const token = token_responseBody.token;
    console.log("Token is ", token_responseBody);

    const update_requestBody = readJson(path.join(inputDir, 'updateBooking_api.json'));
    const update_response = await request.put(`/booking/${bookingID}`, {
        headers: { "Cookie": `token=${token}` },
        data: update_requestBody
    });

    const update_responseBody = await update_response.json();
    console.log(update_responseBody);

    const delete_response = await request.delete(`/booking/${bookingID}`, {
        headers: { "Cookie": `token=${token}` }
    });

    expect(delete_response.statusText()).toBe("Created");
    expect(delete_response.status()).toBe(201);

    console.log("booking deleted successfully ");
});