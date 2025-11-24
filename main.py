from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from chatbot.chatbot_logic import get_bot_response

app = FastAPI()

# Allow frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Later I'll restrict it to our frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    user_message = data.get("message", "")
    bot_reply = get_bot_response(user_message)
    return {"response": bot_reply}