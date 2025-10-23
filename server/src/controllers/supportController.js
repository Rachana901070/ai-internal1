import asyncHandler from "express-async-handler";

export const submitContact = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    res.status(400);
    throw new Error("All fields are required");
  }

  // Here you could integrate email sending, e.g., using nodemailer
  // For now, just log and return success
  console.log(`Contact form submission: Name: ${name}, Email: ${email}, Message: ${message}`);

  res.status(200).json({ success: true, message: "Thank you for your message. Our support team will get back to you shortly." });
});
