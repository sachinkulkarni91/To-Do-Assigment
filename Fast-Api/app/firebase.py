import firebase_admin
from firebase_admin import credentials, auth, firestore

cred = cred = credentials.Certificate("app/todocred.json")
firebase_admin.initialize_app(cred)
db = firestore.client()
def verify_firebase_token(token: str):
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise Exception("Invalid token") from e
