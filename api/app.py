from flask import Flask, request, jsonify
from flask_cors import CORS
from http import HTTPStatus
import openai
from openai import OpenAI
from dotenv import load_dotenv
import os
import traceback

load_dotenv()
client = OpenAI()

# Set OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

cognitive_distortions = [
    "All-or-nothing thinking",
    "Overgeneralization",
    "Mental filter",
    "Disqualifying the positive",
    "Jumping to conclusions",
    "Emotional reasoning",
    "Should statements",
    "Labeling",
    "Personalization",
    "Catastrophizing"
]

def create_app():
    web_app = Flask(__name__)
    CORS(web_app, resources={r"/*": {"origins": "*"}})
    
    @web_app.route('/')
    def root():
        return jsonify({"message": "Hello World"})


    @web_app.route("/test", methods=["POST"])
    def test_endpoint():
        print(f'Test endpoint received request: {request}')
        return jsonify({"message": "Test endpoint received POST request successfully"})

    @web_app.route("/helpReframe", methods=["POST"])
    def help_reframe():
        try:
            data = request.get_json()
            print(f'helpReframe request received: {data}')
            completion = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": f"Imagine you are the user and are having a negative thought: {data['original_thought']}. Reframe this thought into a positive one using Cognitive Reframe. You must use first person tone 'I'. Limit to 300 characters. Leave out sensitive details. Add an emoji at the end."},
                    {"role": "user", "content": data['original_thought']}
                ]
            )
            
            print(f'response help reframe: {completion}')
            generated_reframe = completion.choices[0].message.content
            print(f'generated_reframe: {generated_reframe}')
            return jsonify({"generated_reframe": generated_reframe})
        
        except Exception as e:
            print(f"Error processing /helpReframe: {e}")
            print(traceback.format_exc())
            return jsonify({"error": f"Unexpected Error: {e}"}), HTTPStatus.INTERNAL_SERVER_ERROR

    @web_app.route("/helpIdentify", methods=["POST"])
    def help_identify():
        try:
            data = request.get_json()
            print(f'helpIdentify request received: {data}')
            completion = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": f"Identify cognitive distortions in the user's input. Please select no more than 3 that are applicable from: {', '.join(cognitive_distortions)}, rank them by relevancy."},
                    {"role": "user", "content": data['original_thought']}
                ]
            )
            
            print(f'response generated_distortions: {completion}')
            content = completion.choices[0].message.content
            generated_distortions = [distortion for distortion in cognitive_distortions if distortion.lower() in content.lower()]
            print('generated_distortions', generated_distortions)
            
            explain_prompt = f"Give a very short explanation about why {data['original_thought']} demonstrates {generated_distortions}. Start your sentence with 'It seems like you are experiencing...'. Explain why user's input is demonstrating the distorted thoughts. Make sure you cover all the distorted thoughts. Do not give a generic answer, be profound. Limit the response to 400 characters."
            
            explain_completion = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": explain_prompt},
                    {"role": "user", "content": "explain to me"}
                ]
            )
            
            explanation = explain_completion.choices[0].message.content
            print(f'explanation: ', explanation)
            return jsonify({"distortions": generated_distortions, "explanation": explanation})

        except Exception as e:
            print(f"Error processing /helpIdentify: {e}")
            print(traceback.format_exc())
            return jsonify({"error": f"Unexpected Error: {e}"}), HTTPStatus.INTERNAL_SERVER_ERROR


    @web_app.route("/helpChallenge", methods=["POST"])
    def help_challenge():
        try:
            data = request.get_json()
            completion = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", 
                    "content": f"Imagine you are the user and are having a negative thought: {data['original_thought']}. Ask only one question to challenge my thought using 'I' or 'me'. The question should be based on CBT methodologies. Use a very calm and warm tone. Your question should be succinct and focus on one point at a time. Use first person tone. A example tone is: Is there any evidence that failing this will prevent me from graduating?"},
                    {"role": "user", "content": data['original_thought']}
                ]
            )
            
            print(f'response help_challenge: {completion}')
            generated_challenge = completion.choices[0].message.content
            print(f'generated_challenge: {generated_challenge}')
            return jsonify({"challenge": generated_challenge})
        
        except Exception as e:
            print(f"Error processing /helpChallenge: {e}")
            print(traceback.format_exc())
            return jsonify({"error": f"Unexpected Error: {e}"}), HTTPStatus.INTERNAL_SERVER_ERROR


    return web_app

if __name__ == "__main__":
    app = create_app()
    if app is not None:
        port = int(os.getenv("PORT", 5001))  # Default to port 5001 if PORT is not set
        app.run(host="0.0.0.0", port=port)
