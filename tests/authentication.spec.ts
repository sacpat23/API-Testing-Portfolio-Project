/*
No Auth - (Public api not need to username and password andno authentication is requiered)
Basic Auth  /. preemptive auth- (username and password is requiered)
Beare Token 
API key Authentication
OAuth
*/

import { test, expect } from "@playwright/test";
import { Buffer } from "buffer";

// 1) No Auth

test('No Auth test', async ({ request }) => {
    const response = await request.get("http://127.0.0.1:3000/posts/1");
    expect(response.ok()).toBeTruthy();
    const responseBody = await response.json();
    console.log(responseBody);
});

// Basic Auth (authentication is a part of headers - wheneever we send the request including user /password )
//every headers have key and value pair 
//Buffer.from is used for combining the username and password

test("Basic Authenticaton ", async ({ request }) => {
    const response = await request.post("http://127.0.0.1:3000/basic-auth/user/passwd", {
        headers: {
            Authorization: "Basic " + Buffer.from('user:pass').toString('base64')
        }
    });
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
});

