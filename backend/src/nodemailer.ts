import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
    "service": "gmail",
    "auth": {
        "user": "alexandrerivero16@gmail.com",
        "pass": "suwi crha obwq lmox"
    }
});

export default transport;