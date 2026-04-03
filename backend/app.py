from flask import Flask, request, jsonify
from flask_cors import CORS
import ollama

app = Flask(__name__)
CORS(app)

@app.route("/chat", methods=["POST"])
def chat():

    user_message = request.json["message"]

    response = ollama.chat(
        model="llama3",
        messages=[
            {"role": "user", "content": user_message}
        ]
    )

    reply = response["message"]["content"]

    return jsonify({"reply": reply})


if __name__ == "__main__":
    app.run(debug=True)