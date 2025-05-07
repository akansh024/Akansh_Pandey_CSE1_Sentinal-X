# Akansh_Pandey_CSE1_Sentinal-X
Sentinel-X - Cybersecurity Toolkit
Team Members 
Akansh Pandey
Akshaya Tanwar
Kartikey
Palak Kashyap
Sentinel-X is a comprehensive cybersecurity project that provides users with essential tools for securing their online presence. The project includes:

Secure Chatting App (Currently under development)

Password Strength Checker (Using Have I Been Pwned API)

Port Scanner

Vulnerability Scanner

Features
Password Strength Checker: Users can check whether their passwords have been exposed in known data breaches using the Have I Been Pwned API.

Port Scanner: Scans a given IP address for open ports within a specified range.

Vulnerability Scanner: Scans websites for common vulnerabilities.

Secure Chatting App: A secure messaging platform for users (work in progress).

The port scanner and vulnerability scanner are available to users without requiring a login, but users can create an account to access additional features and interact with the community.

Tech Stack
Frontend:
HTML for the user interface

CSS for styling

JavaScript for handling dynamic actions, such as interacting with the backend

Backend:
Python (Flask)

Libraries used:

Flask==2.3.2

requests==2.31.0

beautifulsoup4==4.12.2

flask-cors for handling CORS

gunicorn for running the Flask app in production

Authentication:
Supabase: Provides authentication services for the secure chatting app and user login.

APIs:
Have I Been Pwned API: Used for checking if a password has been exposed in data breaches.

Installation
To run this project locally, follow these steps:
Clone the repository:
git clone https://github.com/your-repository-url.git
cd your-project-directory
Set up a virtual environment:
python3 -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
Install the required dependencies:
pip install -r requirements.txt
Set up environment variables (for sensitive data like API keys or Supabase credentials):
cp .env.example .env
Edit the .env file with your Supabase credentials and any other necessary configurations.
Run the application:
python app.py
Alternatively, if you're deploying for production, use Gunicorn:
gunicorn -w 4 app:app
How to Use
1. Password Strength Checker:
Go to the password checker section.

Enter a password and click Check Password.

The app will tell you if the password has been exposed in any data breaches.

2. Port Scanner:
Enter an IP address and specify the start and end ports to scan.

Click Initiate Scan to find open ports.

3. Vulnerability Scanner:
Enter the URL of the website you wish to scan.

Click Scan to check for known vulnerabilities.

4. Secure Chatting App:
(Coming soon) Secure chatting platform where users can log in using Supabase and communicate with each other securely.

Contributing
If you'd like to contribute to this project, feel free to fork the repository, make improvements, and submit a pull request.

Steps to Contribute:
Fork the repository.

Create a new branch (git checkout -b feature/your-feature).

Make your changes and commit them (git commit -am 'Add new feature').

Push to the branch (git push origin feature/your-feature).

Open a pull request.
