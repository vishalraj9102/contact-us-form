from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_pyfile('../config.py')

    # Allow only the frontend domain
    CORS(app, origins=["https://contact-us-form-4.onrender.com"], methods=["GET", "POST", "OPTIONS"])

    db.init_app(app)
    migrate.init_app(app, db)

    from app.routes import main
    app.register_blueprint(main, url_prefix="/api")  # use /api prefix for routes

    return app
