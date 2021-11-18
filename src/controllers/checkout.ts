import { Request, Response } from "express";
import { check, validationResult } from "express-validator";

/**
 * Contact form page.
 * @route GET /contact
 */
export const getContact = (req: Request, res: Response): void => {
    res.render("contact", {
        title: "Contact"
    });
};


/**
 * Login page.
 * @route GET /login
 */
 export const getLogin = (req: Request, res: Response): void => {
    if (req.user) {
        return res.redirect("/");
    }
    res.render("account/login", {
        title: "Login",
    });
};

/**
 * Send a contact form via Nodemailer.
 * @route POST /contact
 */
export const postContact = async (req: Request, res: Response): Promise<void> => {
    await check("name", "Name cannot be blank").not().isEmpty().run(req);
    await check("email", "Email is not valid").isEmail().run(req);
    await check("message", "Message cannot be blank").not().isEmpty().run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash("errors", errors.array().toString());
        return res.redirect("/contact");
    }

    const mailOptions = {
        to: "your@email.com",
        from: `${req.body.name} <${req.body.email}>`,
        subject: "Contact Form",
        text: req.body.message
    };

    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            req.flash("errors", err.message);
            return res.redirect("/contact");
        }
        req.flash("success", "Email has been sent successfully!");
        res.redirect("/contact");
    });
};
