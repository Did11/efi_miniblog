from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import User, db
from app import bcrypt
from app.models import Post, Comment

auth_bp = Blueprint('auth_bp', __name__)
blog_bp = Blueprint('blog_bp', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    username = request.json.get('username', None)
    email = request.json.get('email', None)
    password = request.json.get('password', None)

    if not username or not email or not password:
        return jsonify({"msg": "Missing username, email or password"}), 400

    if User.query.filter_by(username=username).first() is not None:
        return jsonify({"msg": "Username already taken"}), 409

    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "User created"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    if not username or not password:
        return jsonify({"msg": "Missing username or password"}), 400

    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"msg": "Bad username or password"}), 401

@auth_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    return jsonify(logged_in_as=current_user_id), 200

@blog_bp.route('/posts', methods=['POST'])
@jwt_required()
def create_post():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    title = data.get('title')
    body = data.get('body')

    if not title or not body:
        return jsonify({"msg": "Title and body are required"}), 400

    post = Post(title=title, body=body, user_id=current_user_id)
    db.session.add(post)
    db.session.commit()

    return jsonify({"id": post.id, "title": post.title, "body": post.body, "user_id": post.user_id}), 201

@blog_bp.route('/posts/<int:post_id>/comments', methods=['POST'])
@jwt_required()
def create_comment(post_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    content = data.get('content')

    if not content:
        return jsonify({"msg": "Content is required"}), 400

    comment = Comment(content=content, user_id=current_user_id, post_id=post_id)
    db.session.add(comment)
    db.session.commit()

    return jsonify({"id": comment.id, "content": comment.content, "user_id": comment.user_id, "post_id": comment.post_id}), 201



# Asegúrate de registrar el Blueprint en tu app principal
# app.register_blueprint(auth_bp)
