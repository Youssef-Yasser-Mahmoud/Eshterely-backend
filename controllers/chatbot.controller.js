const Headphones = require("../models/headphones.js");
const Soundbars = require("../models/soundbars.js");
const Speakers = require("../models/speakers.js");
const Televisions = require("../models/televisions.js");
const OpenAI = require("openai");
const stringSimilarity = require("string-similarity");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.FRONT_URL,
    "X-Title": "Eshterely AI Chatbot",
  },
});

// FAQs (unchanged)
const FAQs = [
  {
    q: "Can I reserve a product by adding it to my basket?",
    a: "To reserve a product, complete the purchase. Items in basket aren't reserved.",
  },
  {
    q: "Can I see the final price of a product in my basket?",
    a: "Yes, the basket displays the most up-to-date prices.",
  },
  {
    q: "What steps should I follow to complete my order?",
    a: "Follow the checkout steps, enter delivery info, and make your payment.",
  },
  {
    q: "What types of delivery do you offer?",
    a: "Standard shipping (2–5 days) and express shipping (1–2 days).",
  },
  {
    q: "I need help during my purchase, who can I contact?",
    a: "Contact Customer Care for help completing your order.",
  },
  {
    q: "How can I track an active order?",
    a: "Check 'My Orders' after payment or use the tracking link in your email.",
  },
  {
    q: "My payment got cancelled, what could be the reason for it?",
    a: "Check billing info or contact your bank for help with payment errors.",
  },
  {
    q: "I haven't received my order confirmation email, what should I do?",
    a: "Contact Customer Care to resend your confirmation email.",
  },
  {
    q: "Can I cancel my order?",
    a: "Orders can't be cancelled, but you can return items within 30 days.",
  },
  {
    q: "Where can I find my order invoice?",
    a: "Log into your account under 'My Orders' or check your shipping email.",
  },
  {
    q: "Can I assign the invoice to my company?",
    a: "Please contact our B2B department.",
  },
  {
    q: "What forms of payment do you accept?",
    a: "We accept most major cards, PayPal, Apple Pay, Google Pay, Klarna, and more.",
  },
  {
    q: "Can I use multiple methods of payment?",
    a: "No, multiple payment methods aren't supported for online purchases.",
  },
  { q: "Is VAT included in the price?", a: "Yes, VAT is included." },
  {
    q: "Why is my card rejected when I pay at checkout?",
    a: "Check expiry date, credit limit, or billing info. Contact your bank if needed.",
  },
  {
    q: "Where is pre-order available?",
    a: "All EMEA (except Norway); USA and Canada may be added soon.",
  },
  {
    q: "How does pre-ordering work?",
    a: "Pay fully or partially to reserve. Receive confirmation and shipping emails.",
  },
  {
    q: "How much of the amount of money is paid when pre-ordering?",
    a: "Depends on the product. It can be partial or full payment.",
  },
  {
    q: "When will I receive the product that I pre-ordered?",
    a: "Shipping dates are listed on the product page.",
  },
  {
    q: "Which countries do you ship to?",
    a: "We ship to 30+ countries including the US, Canada, UK, and EU nations.",
  },
  {
    q: "Where is my package?",
    a: "Track it via the link in your confirmation email.",
  },
  {
    q: "Can I change my shipping address after I submit my order?",
    a: "No, address changes aren't allowed after order submission.",
  },
  {
    q: "I was not home when UPS tried to deliver my package. What happens now?",
    a: "UPS will try to deliver 3 times before using a pickup location.",
  },
  {
    q: "Does UPS need a signature?",
    a: "Yes, UPS requires a signature to ensure safe delivery.",
  },
  {
    q: "My package is stuck at UPS. What should I do?",
    a: "Contact Customer Care for support.",
  },
  {
    q: "What should I do if my shipment has been damaged or lost?",
    a: "A UPS investigation may take up to 10 business days.",
  },
  {
    q: "What is your shipping policy?",
    a: "Visit our site to learn more about our shipping policy.",
  },
  {
    q: "How can I return my order?",
    a: "Use the UPS return label included with your package within 30 days.",
  },
  {
    q: "Do you offer gift wrapping for online orders?",
    a: "Yes, you can select exclusive gift wrapping at checkout.",
  },
  {
    q: "Will the price of the order be shown in a gift-wrapped package?",
    a: "No, the price is emailed separately.",
  },
  {
    q: "Can the receiver return the gift?",
    a: "Yes, they can request a refund using our return form.",
  },
  {
    q: "How to stream music to my loudspeakers",
    a: "Use Beolink, AirPlay, or Google Cast via your phone's streaming app.",
  },
  {
    q: "How to connect to my speakers via Bluetooth",
    a: "Power on, press Bluetooth button, then connect via phone settings.",
  },
  {
    q: "What is the difference between Wi-Fi speakers and Bluetooth speakers?",
    a: "Wi-Fi allows better quality and multi-room audio; Bluetooth is limited and drains phone battery.",
  },
  {
    q: "How to stereo pair speakers",
    a: "Use the Bang & Olufsen App > Sound Settings > Create stereo pair.",
  },
  {
    q: "How to connect two or more wireless speakers to each other",
    a: "Use Bang & Olufsen App to connect and group speakers over Wi-Fi.",
  },
  {
    q: "What is Beolink Surround?",
    a: "Bang & Olufsen's tech to create immersive surround sound using TVs, speakers and soundbars.",
  },
  {
    q: "How do I get Beolink Surround on my existing products?",
    a: "Mozart-based products will receive support via software update.",
  },
];

const handleChatRequest = async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "No message provided" });

  try {
    const lowerMessage = message.toLowerCase();

    // 1️⃣ Check FAQs
    const matchedFaq = FAQs.find((faq) =>
      lowerMessage.includes(faq.q.toLowerCase())
    );
    if (matchedFaq) return res.json({ reply: matchedFaq.a });

    // 2️⃣ Build product search query
    const searchTerms = lowerMessage
      .split(" ")
      .map((term) => term.trim())
      .filter((term) => term.length > 0);

    const orQueries = searchTerms.map((term) => ({
      $or: [
        { title: { $regex: term, $options: "i" } },
        { description: { $regex: term, $options: "i" } },
        { color: { $regex: term, $options: "i" } },
        { material: { $regex: term, $options: "i" } },
      ],
    }));

    // 3️⃣ Search across all product models
    const [headphones, soundbars, speakers, televisions] = await Promise.all([
      Headphones.find({ $or: orQueries }),
      Soundbars.find({ $or: orQueries }),
      Speakers.find({ $or: orQueries }),
      Televisions.find({ $or: orQueries }),
    ]);

    const allResults = [
      ...headphones,
      ...soundbars,
      ...speakers,
      ...televisions,
    ];

    // 4️⃣ Rank by similarity to message
    let bestMatch = null;
    let highestScore = 0;

    for (const product of allResults) {
      if (!product?.title) continue; // skip invalid product

      const score = stringSimilarity.compareTwoStrings(
        lowerMessage,
        product.title.toLowerCase()
      );
      if (score > highestScore) {
        highestScore = score;
        bestMatch = product;
      }
    }

    // 5️⃣ Prepare product info
    const productInfo = bestMatch
      ? `*${bestMatch.title || "Unnamed Product"}* - ${
          bestMatch.description || "No description available"
        }. Price: $${bestMatch.price ?? "N/A"}, Stock: ${
          bestMatch.stock ?? "N/A"
        }.`
      : "No product matched.";

    // 6️⃣ Get AI response
    const completion = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [
        {
          role: "system",
          content: `You are a helpful eCommerce chatbot. Always respond in under 150 characters. Be extremely concise. Avoid extra words. Summarize if needed. If the user asks about FAQs or store policies, answer directly. If they ask about products, use this product info: ${productInfo}`,
        },
        {
          role: "user",
          content: `${message} (Respond in under 150 characters.)`,
        },
      ],
    });

    const reply = completion.choices[0].message.content;
    return res.json({ reply });
  } catch (err) {
    console.error("Chatbot Error:", err);
    res.status(500).json({ error: "AI request failed" });
  }
};

module.exports.handleChatRequest = handleChatRequest;
