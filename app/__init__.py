from flask import Flask
from config import Config
from app.extensions import db, bcrypt, jwt, migrate
from app.routes import auth_bp, blog_bp, main_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    app.debug = True

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # Registro de los Blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(blog_bp, url_prefix='/blog')
    app.register_blueprint(main_bp, url_prefix='/')  # Registrar el blueprint principal en la raíz

    with app.app_context():
        from .models import User, Post, Comment

    return app
