import json
import random
import re
from datetime import datetime, timedelta

with open("intents.json", "r") as file:
    intents = json.load(file)["intents"]

conversation_memory = {}

dummy_data = {
    "order_status": {
        "12345": {"status": "processing", "delivery_days": 3},
        "67890": {"status": "shipped", "delivery_days": 2}
    },
    "products": {
        "Apple": ["iPhone 15", "MacBook Air", "iPad Pro"],
        "Samsung": ["Galaxy S23", "Galaxy Tab S8"]
    }
}

def find_intent(user_input):
    """Keyword-based intent recognition"""
    for intent in intents:
        for pattern in intent.get("patterns", []):
            if re.search(pattern, user_input, re.IGNORECASE):
                return intent
    return None

def extract_entities(user_input, expected_entities):
    """Extract entities cleanly from user input"""
    entities = {}
    for entity in expected_entities:
        match = re.search(f"{entity}[: ]?(.+)", user_input, re.IGNORECASE)
        if match:
            value = match.group(1).strip()
            value = re.sub(f"^{entity}[: ]*", "", value, flags=re.IGNORECASE)
            entities[entity] = value
        else:
            if len(expected_entities) == 1:
                entities[entity] = user_input.strip()
    return entities

def generate_response(intent, entities=None):
    """Generate response based on intent and extracted entities"""
    response_template = random.choice(intent.get("responses", ["Sorry, I don't understand."]))

    if intent.get("follow_up") and entities:
        template = intent["follow_up"]["response_template"]

        if "order_id" in entities:
            order_id = entities["order_id"]
            data = dummy_data["order_status"].get(order_id, {"status": "unknown", "delivery_days": 0})
            template = template.replace("{{order_id}}", order_id)
            template = template.replace("{{status}}", data["status"])
            delivery_date = (datetime.now() + timedelta(days=data["delivery_days"])).strftime("%d %b %Y") \
                            if data["delivery_days"] > 0 else "unknown"
            template = template.replace("{{delivery_date}}", delivery_date)

        if "category" in entities and "brand" in entities:
            category = entities["category"].strip()
            brand = entities["brand"].strip()
            products = dummy_data["products"].get(brand, ["No products found"])
            template = template.replace("{{category}}", category)
            template = template.replace("{{brand}}", brand)
            template = template.replace("{{product_list}}", ", ".join(products))

        return template

    return response_template

def chatbot_response(user_id, user_input):
    """Handle multi-turn chatbot conversations"""
    global conversation_memory

    if user_id in conversation_memory:
        follow_up = conversation_memory[user_id]
        entities = extract_entities(user_input, follow_up["expected_entity"])
        if len(entities) == len(follow_up["expected_entity"]):
            response = generate_response(follow_up["intent"], entities)
            del conversation_memory[user_id]  
            return response
        else:
            return "Could you provide more details, please?"

    intent = find_intent(user_input)
    if intent:
        if intent.get("follow_up"):
            conversation_memory[user_id] = {
                "intent": intent,
                "expected_entity": intent["follow_up"]["expected_entity"]
            }
            return random.choice(intent.get("responses", ["Please provide more details."]))
        else:
            return random.choice(intent.get("responses", ["Sorry, I don't understand."]))
    else:
        return "Sorry, I didn't understand that. Can you rephrase?"

def get_bot_response(user_input, user_id="user1"):
    """Wrapper for FastAPI to call chatbot"""
    return chatbot_response(user_id, user_input)

if __name__ == "__main__":
    print(get_bot_response("Hi"))
    print(get_bot_response("Where is my order?"))
    print(get_bot_response("12345")) 
    print(get_bot_response("Show me laptops"))
    print(get_bot_response("category: Laptop brand: Apple"))