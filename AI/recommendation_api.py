from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Extended IT job roles
job_roles = {
    "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "Vue.js", "TypeScript"],
    "Backend Developer": ["Node.js", "Express", "MongoDB", "Python", "SQL", "Django"],
    "Fullstack Developer": ["HTML", "CSS", "JavaScript", "Node.js", "MongoDB", "React", "Express", "TypeScript"],
    "Data Analyst": ["Python", "SQL", "Pandas", "Excel", "Tableau", "Power BI"],
    "Data Scientist": ["Python", "R", "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "Keras"],
    "Machine Learning Engineer": ["Python", "TensorFlow", "Scikit-learn", "NumPy", "PyTorch", "Deep Learning"],
    "DevOps Engineer": ["AWS", "Docker", "Kubernetes", "CI/CD", "Jenkins", "Terraform", "Linux"],
    "Cloud Engineer": ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Terraform"],
    "Cybersecurity Analyst": ["Networking", "Linux", "Python", "Firewalls", "Penetration Testing", "SIEM"],
    "Mobile App Developer": ["Java", "Kotlin", "Swift", "React Native", "Flutter"],
    "QA Engineer": ["Selenium", "Cypress", "Postman", "Jira", "TestNG", "Automation Testing"],
    "System Administrator": ["Linux", "Windows Server", "Networking", "Shell Scripting", "PowerShell"],
    "UI/UX Designer": ["Figma", "Adobe XD", "Sketch", "Wireframing", "Prototyping", "User Research"],
    "Database Administrator": ["SQL", "MySQL", "PostgreSQL", "MongoDB", "Database Optimization", "Backup & Recovery"]
}

@app.route("/recommend", methods=["POST"])
def recommend_roles():
    try:
        data = request.get_json()
        user_skills = [s.lower() for s in data.get("skills", [])] if data else []

        recommendations = []

        for role, required_skills in job_roles.items():
            required_lower = [s.lower() for s in required_skills]
            matched_skills = [s for s in required_skills if s.lower() in user_skills]
            missing_skills = [s for s in required_skills if s.lower() not in user_skills]
            match_percent = round((len(matched_skills) / len(required_skills)) * 100, 2)

            recommendations.append({
                "role": role,
                "match": match_percent,
                "required_skills": required_skills,
                "missing_skills": missing_skills
            })

        # Sort by match % descending
        recommendations.sort(key=lambda x: x["match"], reverse=True)
        return jsonify({"recommendations": recommendations})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5001, debug=True)
