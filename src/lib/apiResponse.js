import { NextResponse } from "next/server";

export const apiSuccess = (data, message = "success", status = 200) =>
  NextResponse.json({ status: "success", message, data }, { status });

export const apiError = (message, status = 400) =>
  NextResponse.json({ status: "error", message }, { status });

export const apiCreated = (data, message = "created") =>
  apiSuccess(data, message, 201);
