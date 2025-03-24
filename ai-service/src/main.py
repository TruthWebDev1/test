from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import requests

load_dotenv()

app = FastAPI()

# MongoDB setup
mongo_client = MongoClient(os.getenv("MONGO_URI"))
db = mongo_client["truthweb"]
conversations_collection = db["aiConversations"]

class Message(BaseModel):
    userId: str
    content: str

# Mock AI response function (replace with actual AI model integration)
def get_ai_response(user_input, conversation_history):
    # Example: Integrate with xAI's Grok or a custom model
    # For demonstration, use a mock response
    responses = {
        "marketplace": "The TruthWeb marketplace is buzzing! You can find everything from Pi software to trading courses. Want me to recommend the hottest items right now? Just say 'recommend marketplace items'!",
        "feed": "The feed is your window into the TruthWeb community. You're seeing posts from Pioneers and ads from our sponsors. Want to know how to get more engagement on your posts? Ask me for tips!",
        "recommend marketplace items": "Here are some hot picks: 'Pi Software' for 100 Pi, 'Premium Pi Analytics' for 75 Pi, and 'Trading Course' for 150 Pi. All available in the marketplace—check them out!",
        "tips": "To boost engagement, try posting about your Pi trading wins, sharing marketplace finds, or asking questions to spark conversations. And don't forget to use hashtags like #PiTrading! Want more specific advice? Just ask!"
    }
    lower_input = user_input.lower()
    for key in responses:
        if key in lower_input:
            return responses[key]
    return "Hmm, I'm not sure I caught that, but I'm here to help! Try asking about the marketplace, feed, or community tips. Or, if you're feeling cosmic, ask me about the meaning of Pi (just kidding... or am I?)."

@app.post("/ai/chat")
async def chat(message: Message):
    try:
        # Fetch conversation history
        conversation = conversations_collection.find_one({"userId": message.userId})
        history = conversation["messages"] if conversation else []

        # Get AI response
        ai_response = get_ai_response(message.content, history)

        # Update conversation history
        new_message = {"role": "user", "content": message.content, "createdAt": datetime.now().isoformat()}
        ai_message = {"role": "ai", "content": ai_response, "createdAt": datetime.now().isoformat()}
        if conversation:
            conversations_collection.update_one(
                {"userId": message.userId},
                {"$push": {"messages": {"$each": [new_message, ai_message]}}}
            )
        else:
            conversations_collection.insert_one({
                "userId": message.userId,
                "messages": [new_message, ai_message]
            })

        return {"response": ai_response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
