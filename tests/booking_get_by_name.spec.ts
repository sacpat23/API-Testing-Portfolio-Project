import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

test("Verify GET /booking returns bookings for a valid guest name", async ({ request }) => {
    const jsonFile = path.resolve(__dirname, '..', 'testData', 'createBooking_api.json');
    const requestBody = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));

    const response = await request.post("/booking", { data: requestBody });

    const responseBody = await response.json();
    const bookingID = responseBody.bookingid;
    console.log("booking id is ", bookingID);

    const firstName = responseBody.booking.firstname;
    console.log("First Name is ", firstName);
    const lastName = responseBody.booking.lastname;
    console.log("Last Name is ", lastName);
    console.log("=========================");

    const responseData = await request.get("/booking", {
        params: { firstname: firstName, lastname: lastName }
    });

    const get_respponseBody = await responseData.json();

    console.log(get_respponseBody);
    expect(responseData.ok()).toBeTruthy();
    expect(responseData.status()).toBe(200);

    expect(get_respponseBody.length).toBeGreaterThan(0);

    for (const item of get_respponseBody) {
        expect(item).toHaveProperty('bookingid');
        expect(typeof item.bookingid).toBe("number");
        expect(item.bookingid).toBeGreaterThan(0);
    }
});

