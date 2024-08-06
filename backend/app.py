import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

app = Flask(__name__)
load_dotenv()
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
if not app.config['SQLALCHEMY_DATABASE_URI']:
    raise KeyError("SQLALCHEMY_DATABASE_URI is missing")
db = SQLAlchemy(app)
CORS(app) 

app.config['JWT_SECRET_KEY'] = 'your_secret_key'
jwt = JWTManager(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    role = db.Column(db.String(20), nullable=False)
    profession = db.Column(db.String(50), nullable=False)
    technologies = db.Column(db.ARRAY(db.String), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'role': self.role,
            'profession': self.profession,
            'technologies': self.technologies
        }

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print("data", data)
    required_fields = ['username', 'password', 'email', 'role', 'profession', 'technologies']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing {field} field'}), 400

    # Create new user record
    new_user = User(
        username=data['username'],
        password=data['password'],  # Ensure to hash the password in real scenarios
        email=data['email'],
        role=data['role'],
        profession=data['profession'],
        technologies=data['technologies']
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        print("errorrr", e)
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/check-email', methods=['GET'])
def check_email():
    email = request.args.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'exists': True}), 200
    return jsonify({'exists': False}), 200


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and user.password == password:  
        access_token = create_access_token(identity=email)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify(error='Invalid credentials'), 401

@app.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    email = get_jwt_identity()  # Get the email from the JWT token
    user = User.query.filter_by(email=email).first()

    if user:
        return jsonify(user=user.to_dict()), 200
    else:
        return jsonify(error='User not found'), 404
    
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)