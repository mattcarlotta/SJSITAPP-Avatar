import get from "lodash.get";
import app from "./tesetServer";

const password = "password";

/**
 * Test utility function to log in a staff member
 *
 * @function staffSignIn
 * @returns {string} cookie
 */
export const staffSignIn = async (): Promise<string> => {
  const res = await app()
    .post("/api/signin")
    .send({ email: "staffmember@example.com", password });

  return get(res, ["header", "set-cookie"]);
};

/**
 * Test utility function to log in a non-staff member
 *
 * @function staffSignIn
 * @returns {string} cookie
 */
export const memberSignIn = async (email?: string): Promise<string> => {
  const res = await app()
    .post("/api/signin")
    .send({ email: email || "scheduledmember@test.com", password });

  return get(res, ["header", "set-cookie"]);
};
