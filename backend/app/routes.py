 
from flask import Blueprint, request, jsonify
from app import db
from app.models import Contact

main = Blueprint('main', __name__)

@main.route('/contact', methods=['POST'])
def contact():
    data = request.get_json()

    name = data.get('name')
    email = data.get('email')
    message = data.get('message')

    if not name or not email or not message:
        return jsonify({'error': 'All fields are required'}), 400

    contact = Contact(name=name, email=email, message=message)
    db.session.add(contact)
    db.session.commit()

    return jsonify({'message': 'Form submitted successfully'})
