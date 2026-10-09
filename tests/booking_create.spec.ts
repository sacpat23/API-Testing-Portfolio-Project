import { test, expect } from "@playwright/test";
import fs from 'fs';
import path from 'path';

const readFixture = (fileName: string) =>
    JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'testData', fileName), 'utf-8'));

test("Verify POST /booking creates a booking successfully", async ({ request }) => {
    const requestBody = readFixture('createBooking_api.json');

    const response = await request.post("/booking", { data: requestBody });
    const responseBody = await response.json();
    console.log(responseBody);
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    expect(responseBody).toHaveProperty("bookingid");
    expect(responseBody).toHaveProperty("booking");

    const booking_id = responseBody.bookingid;
    console.log("Booking ID is ", booking_id);

    const booking = responseBody.booking;

    expect(booking).toMatchObject({
        firstname: 'Jim',
        lastname: 'Brown',
        totalprice: 111,
        depositpaid: true,
        additionalneeds: 'Breakfast'
    });

    expect(booking.bookingdates).toMatchObject({
        checkin: '2018-01-01', checkout: '2019-01-01'
    });
});