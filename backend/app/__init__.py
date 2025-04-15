from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate  # Import Migrate

db = SQLAlchemy()
migrate = Migrate()  # Initialize Migrate

def create_app():
    app = Flask(__name__)
    app.config.from_pyfile('../config.py')
    
    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)  # Link Migrate to app and db

    from app.routes import main
    app.register_blueprint(main)

    return app
