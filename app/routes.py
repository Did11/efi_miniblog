from flask import Blueprint, jsonify, request, render_template, redirect, url_for, flash, make_response
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.extensions import db
from .models import User, Post, Comment

auth_bp = Blueprint('auth_bp', __name__)
blog_bp = Blueprint('blog_bp', __name__)
main_bp = Blueprint('main_bp', __name__)  # Blueprint para la ruta principal

@main_bp.route('/')  # Ruta principal para mostrar index.html
def index():
    return render_template('index.html')

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return render_template('auth/register.html')

    if request.content_type == 'application/json':
        # Procesa una solicitud JSON
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
    else:
        # Procesa una solicitud de formulario HTML
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')

    if not username or not email or not password:
        # Maneja el error según el tipo de solicitud
        if request.content_type == 'application/json':
            return jsonify({"msg": "Missing username, email or password"}), 400
        else:
            flash('Missing username, email or password', 'error')
            return redirect(url_for('auth_bp.register'))

    if User.query.filter_by(username=username).first():
        # Maneja el error según el tipo de solicitud
        if request.content_type == 'application/json':
            return jsonify({"msg": "Username already taken"}), 409
        else:
            flash('Username already taken', 'error')
            return redirect(url_for('auth_bp.register'))

    user = User(username=username, email=email)
    user.set_password(password)  
    db.session.add(user)
    db.session.commit()

    # Maneja la respuesta según el tipo de solicitud
    if request.content_type == 'application/json':
        return jsonify({"msg": "User created"}), 201
    else:
        flash('User created successfully', 'success')
        return redirect(url_for('auth_bp.login'))

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('auth/login.html')

    username = request.form.get('username')
    password = request.form.get('password')

    if not username or not password:
        return jsonify({'error': 'Missing username or password'}), 400

    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        access_token = create_access_token(identity=user.id)

        # Crear respuesta y establecer la cookie HttpOnly
        response = make_response(redirect(url_for('main_bp.index')))
        response.set_cookie('access_token', access_token, httponly=True)
        return response
    else:
        return jsonify({'error': 'Bad username or password'}), 401


@auth_bp.route('/verify', methods=['GET'])
@jwt_required(optional=True)
def verify():
    try:
        get_jwt_identity()
        return jsonify(isAuthenticated=True), 200
    except:
        return jsonify(isAuthenticated=False), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({"msg": "Logged out"}), 200)
    response.delete_cookie('access_token')  #Usar el nombre correcto de tu cookie
    return response

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
