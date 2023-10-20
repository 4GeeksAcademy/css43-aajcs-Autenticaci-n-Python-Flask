"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException

from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
import bcrypt

api = Blueprint('api', __name__)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route("/user", methods=["POST"])
def create_user():
    body = request.json
  
    email = body.get("email", None)
    password = request.json.get("password", None)

    if email is None or password is None:
        return jsonify({
            "message": "Something is missing"
        }), 400
    salt = str(bcrypt.gensalt(14))
    password_hash = generate_password_hash(password + salt)
    email_exist = User.query.filter_by(email=email).one_or_none()
    if email_exist is not None:
        return jsonify({
            "message": "Email already exists"
        }), 400
    user = User(
      
        email = email, 
        password = password_hash,
        salt = salt,

        )
    try:
        db.session.add(user)
        db.session.commit()
    except Exception as error:
        db.session.rollback()
        return jsonify({
            "message": "internal error",
            "error": error.args
        }), 500
    return jsonify({"message": "User created"}), 201

@api.route("/login", methods=["POST"])
def login():
    body = request.json
    email = body.get("email", None)
    password = request.json.get("password", None)
    if email is None or password is None:
        return jsonify({
            "message": "Something is missing"
        }), 400
    user_data = User.query.filter_by(email=email).one_or_none()
    if user_data is None:
        return jsonify({
            "message": "User does not exist"
        }), 400
    password_hashed = check_password_hash(pwhash=user_data.password, password=password + user_data.salt)
    print("esto es el pass: ", password)
    print("esto es el hash: ",user_data.password)
    if password_hashed is False:
        return jsonify({
            "message": "Invalid credetials"
        }), 400
    return jsonify({
        "token" : create_access_token(identity=user_data.id),
       
        "user_id" : user_data.id
    }), 201

