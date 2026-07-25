const axios = require("axios");
const { authenticator } = require("otplib");

const BASE_URL = "https://apiconnect.angelone.in";

const API_KEY = process.env.ANGEL_API_KEY;
const CLIENT_CODE = process.env.ANGEL_CLIENT_CODE;
const MPIN = process.env.ANGEL_MPIN;
const TOTP_SECRET = process.env.ANGEL_TOTP_SECRET;

/**
 * Generates a TOTP using the secret stored in .env
 */
const generateTOTP = () => {
    return authenticator.generate(TOTP_SECRET);
};

/**
 * Authenticates with Angel One and returns
 * the session tokens.
 */
const generateSession = async () => {

    const totp = generateTOTP();

    const response = await axios.post(
        `${BASE_URL}/rest/auth/angelbroking/user/v1/loginByPassword`,
        {
            clientcode: CLIENT_CODE,
            password: MPIN,
            totp,
        },
        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-UserType": "USER",
                "X-SourceID": "WEB",
                "X-PrivateKey": API_KEY,
                "X-ClientLocalIP": "127.0.0.1",
                "X-ClientPublicIP": "127.0.0.1",
                "X-MACAddress": "00:00:00:00:00:00",
            },
        }
    );

    const {
        jwtToken,
        refreshToken,
        feedToken,
    } = response.data.data;

    return {
        jwtToken,
        refreshToken,
        feedToken,
    };
};

module.exports = {
    generateSession,
};