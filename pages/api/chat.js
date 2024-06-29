export default async function (req, res) {
  const formData = new FormData();
  formData.append('message', "Câu hỏi là: " + req.body.question + ". Lịch sử đoạn chat của chúng ta là: " + req.body.history);

  const response = await fetch("https://backend-chat-fxter.vercel.app/api/chat", {
    method: "POST",
    body: formData
  });

  const data = await response.data;

  res.status(200).json({ result: data })
}