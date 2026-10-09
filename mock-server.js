const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 3000;

const baseBooking = {
  firstname: "Jim",
  lastname: "Brown",
  totalprice: 111,
  depositpaid: true,
  bookingdates: {
    checkin: "2018-01-01",
    checkout: "2019-01-01",
  },
  additionalneeds: "Breakfast",
};

let bookings = [];
let nextId = 1;

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "GET" && url.pathname === "/posts/1") {
    return sendJson(res, 200, {
      userId: 1,
      id: 1,
      title:
        "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
      body: "quia et suscipit",
    });
  }

  if (req.method === "POST" && url.pathname === "/basic-auth/user/passwd") {
    const authHeader = req.headers.authorization || "";
    const expected = "Basic " + Buffer.from("user:pass").toString("base64");
    if (authHeader === expected) {
      return sendJson(res, 200, { authenticated: true, user: "user" });
    }
    return sendJson(res, 401, { error: "unauthorized" });
  }

  if (req.method === "POST" && url.pathname === "/booking") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const payload = body ? JSON.parse(body) : baseBooking;
      const booking = { ...payload, bookingid: nextId++ };
      bookings.push(booking);
      sendJson(res, 200, { bookingid: booking.bookingid, booking: payload });
    });
    return;
  }

  if (req.method === "GET" && url.pathname.startsWith("/booking/")) {
    const id = Number(url.pathname.split("/").pop());
    const booking = bookings.find((b) => b.bookingid === id);
    if (!booking) {
      return sendJson(res, 404, { error: "not found" });
    }
    return sendJson(res, 200, booking);
  }

  if (req.method === "GET" && url.pathname === "/booking") {
    const firstname = url.searchParams.get("firstname");
    const lastname = url.searchParams.get("lastname");
    const results = bookings.filter((b) => {
      const booking = b.booking || b;
      return (
        (!firstname || booking.firstname === firstname) &&
        (!lastname || booking.lastname === lastname)
      );
    });
    return sendJson(
      res,
      200,
      results.map((b) => ({ bookingid: b.bookingid, booking: b.booking || b })),
    );
  }

  if (req.method === "POST" && url.pathname === "/auth") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const payload = JSON.parse(body || "{}");
      if (payload.username === "admin" && payload.password === "password123") {
        return sendJson(res, 200, { token: "mock-token-123" });
      }
      return sendJson(res, 403, { error: "invalid credentials" });
    });
    return;
  }

  if (req.method === "PUT" && url.pathname.startsWith("/booking/")) {
    const id = Number(url.pathname.split("/").pop());
    const cookie = req.headers.cookie || "";
    const token = cookie.split("token=")[1]?.split(";")[0];
    if (token !== "mock-token-123") {
      return sendJson(res, 403, { error: "unauthorized" });
    }
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const payload = JSON.parse(body || "{}");
      const bookingIndex = bookings.findIndex((b) => b.bookingid === id);
      if (bookingIndex === -1) {
        return sendJson(res, 404, { error: "not found" });
      }
      bookings[bookingIndex] = { ...bookings[bookingIndex], ...payload };
      sendJson(res, 200, { ...bookings[bookingIndex] });
    });
    return;
  }

  if (req.method === "DELETE" && url.pathname.startsWith("/booking/")) {
    const id = Number(url.pathname.split("/").pop());
    const cookie = req.headers.cookie || "";
    const token = cookie.split("token=")[1]?.split(";")[0];
    if (token !== "mock-token-123") {
      return sendJson(res, 403, { error: "unauthorized" });
    }
    const index = bookings.findIndex((b) => b.bookingid === id);
    if (index === -1) {
      return sendJson(res, 404, { error: "not found" });
    }
    bookings.splice(index, 1);
    return sendJson(res, 201, { deleted: true, bookingid: id });
  }

  sendJson(res, 404, { error: "not found" });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Mock API server listening on http://127.0.0.1:${port}`);
});
