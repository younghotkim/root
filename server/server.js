const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.post("/api/analyze", async (req, res) => {
  const { text } = req.body;

  const prompt = `이 문장의 감정을 분석해줘 그런 다음 나온 감정들을 #를 써서 키워드 형식으로 정리해줘 그리고 결과창에는 키워드만 보여줘: "${text}"`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = await response.text();

    res.json({ result: analysis });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
