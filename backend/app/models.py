from app import db

class Contact(db.Model):
    __tablename__ = 'contact_form'  

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    message = db.Column(db.Text)
