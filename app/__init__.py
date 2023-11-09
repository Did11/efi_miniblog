from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from config import Config

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()
migrate = Migrate()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    print('Database URI:', app.config['SQLALCHEMY_DATABASE_URI'])
    print('Secret Key:', app.config['SECRET_KEY'])
    print('JWT Secret Key:', app.config['JWT_SECRET_KEY'])

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # Importaciones locales dentro de create_app para evitar importaciones circulares
    with app.app_context():
        from .routes import auth_bp, blog_bp
        app.register_blueprint(auth_bp, url_prefix='/auth')
        app.register_blueprint(blog_bp, url_prefix='/blog')

        # Importa los modelos aquí si es necesario
        from .models import User, Post, Comment

    return app
