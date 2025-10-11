from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()
    skills = data.get("skills", [])

    if not skills:
        return jsonify({"recommendations": [], "message": "No skills provided"})

    # Simple AI-like response
    recommendations = []
    if "React" in skills or "JavaScript" in skills:
        recommendations.append({"role": "Frontend Developer", "match": 85})
    if "Node.js" in skills or "MongoDB" in skills:
        recommendations.append({"role": "Backend Developer", "match": 80})
    if {"React", "Node.js", "MongoDB"}.issubset(set(skills)):
        recommendations.append({"role": "Fullstack Developer", "match": 90})
    if "Python" in skills:
        recommendations.append({"role": "Data Scientist", "match": 75})

    return jsonify({
        "recommendations": recommendations,
        "skills_received": skills
    })

if __name__ == "__main__":
    app.run(port=5001)
