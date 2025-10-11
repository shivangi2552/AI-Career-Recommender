from resources import resources_data

roles_data = {
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
}

def recommend_roles(user_skills):
    recommendations = []
    for role, skills_required in roles_data.items():
        match_count = len(set(user_skills) & set(skills_required))
        match_percentage = match_count / len(skills_required)
        if match_percentage > 0:
            recommendations.append({
                "role": role,
                "match": round(match_percentage * 100),
                "resources": resources_data.get(role, [])
            })
    recommendations.sort(key=lambda x: x["match"], reverse=True)
    return recommendations
