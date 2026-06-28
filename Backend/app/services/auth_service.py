from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.user import User
from app.utils.jwt import create_access_token
from app.utils.password import hash_password, verify_password


def register_user(db: Session, username: str, email: str, password: str):

    existing = db.query(User).filter(User.email == email).first()

    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed = hash_password(password)
    print("Generated Hash:", hashed)

    user = User(
        username=username,
        email=email,
        password=hashed
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "Registration successful"
    }


def login_user(db: Session, email: str, password: str):

    print("Entered Password:", repr(password))

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    print("Stored Hash:", repr(user.password))

    print("Password Length:", len(password))
    print("Hash Length:", len(user.password))

    print("Verify Result:", verify_password(password, user.password))

    if not verify_password(password, user.password):
      raise HTTPException(status_code=401, detail="Invalid password")

    # Generate JWT token
    token = create_access_token(
        {
            "sub": user.email
        }
    )

    return {
        "message": "Login Success",
        "access_token": token,
        "token_type": "bearer"
    }
   