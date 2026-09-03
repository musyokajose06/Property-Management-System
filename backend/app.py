from datetime import date, timedelta
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///r3ntledger.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "dev-only-change-me"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=60)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=1)

db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app, origins=["http://localhost:5173"])

# ── Models ────────────────────────────────────────────────────────────────────

class User(db.Model):
    __tablename__ = "users"
    id       = db.Column(db.String(64), primary_key=True)
    name     = db.Column(db.String(150))
    email    = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role     = db.Column(db.String(20), default="tenant")

    def to_dict(self):
        return {"id": self.id, "name": self.name, "email": self.email, "role": self.role}

class Property(db.Model):
    __tablename__ = "properties"
    id         = db.Column(db.String(64), primary_key=True)
    name       = db.Column(db.String(150))
    address    = db.Column(db.String(255))
    units      = db.Column(db.Integer, default=0)
    manager_id = db.Column(db.String(64), db.ForeignKey("users.id"), nullable=True)

    def to_dict(self):
        return {"id": self.id, "name": self.name, "address": self.address, "units": self.units, "managerId": self.manager_id}

class Tenant(db.Model):
    __tablename__ = "tenants"
    id          = db.Column(db.String(64), primary_key=True)
    user_id     = db.Column(db.String(64), db.ForeignKey("users.id"), nullable=True)
    name        = db.Column(db.String(150))
    email       = db.Column(db.String(255))
    unit        = db.Column(db.String(50))
    property_id = db.Column(db.String(64), db.ForeignKey("properties.id"))

    def to_dict(self):
        return {"id": self.id, "name": self.name, "email": self.email, "unit": self.unit, "propertyId": self.property_id}

class Lease(db.Model):
    __tablename__ = "leases"
    id          = db.Column(db.String(64), primary_key=True)
    tenant_id   = db.Column(db.String(64), db.ForeignKey("tenants.id"))
    property_id = db.Column(db.String(64), db.ForeignKey("properties.id"))
    start_date  = db.Column(db.String(20))
    end_date    = db.Column(db.String(20))
    status      = db.Column(db.String(20), default="active")
    approval    = db.Column(db.String(20), default="approved")

    def to_dict(self):
        return {"id": self.id, "tenantId": self.tenant_id, "propertyId": self.property_id,
                "leaseStart": self.start_date, "leaseEnd": self.end_date,
                "leaseStatus": self.status, "leaseApproval": self.approval}

class Payment(db.Model):
    __tablename__ = "payments"
    id        = db.Column(db.String(64), primary_key=True)
    tenant_id = db.Column(db.String(64), db.ForeignKey("tenants.id"))
    amount    = db.Column(db.Float)
    due_date  = db.Column(db.String(20))
    status    = db.Column(db.String(20), default="pending")
    month     = db.Column(db.String(50))

    def to_dict(self):
        tenant = Tenant.query.get(self.tenant_id)
        return {"id": self.id, "tenantId": self.tenant_id, "tenantName": tenant.name if tenant else "",
                "amount": self.amount, "dueDate": self.due_date, "status": self.status, "month": self.month}

class Inquiry(db.Model):
    __tablename__ = "inquiries"
    id        = db.Column(db.String(64), primary_key=True)
    tenant_id = db.Column(db.String(64), db.ForeignKey("tenants.id"))
    subject   = db.Column(db.String(200))
    message   = db.Column(db.Text)
    date      = db.Column(db.String(20))
    status    = db.Column(db.String(20), default="open")

    def to_dict(self):
        tenant = Tenant.query.get(self.tenant_id)
        return {"id": self.id, "tenantId": self.tenant_id, "tenantName": tenant.name if tenant else "",
                "subject": self.subject, "message": self.message, "date": self.date, "status": self.status}

class Warning(db.Model):
    __tablename__ = "warnings"
    id          = db.Column(db.String(64), primary_key=True)
    target      = db.Column(db.String(64))
    target_name = db.Column(db.String(150))
    message     = db.Column(db.Text)
    date        = db.Column(db.String(20))
    is_global   = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {"id": self.id, "target": self.target, "targetName": self.target_name,
                "message": self.message, "date": self.date, "isGlobal": self.is_global}

# ── Helpers ───────────────────────────────────────────────────────────────────

def ok(data, code=200):
    return jsonify(data), code

def err(msg, code=400):
    return jsonify({"error": msg}), code

def crud_routes(blueprint_name, Model, url):
    @app.route(url, methods=["GET"], endpoint=f"{blueprint_name}_list")
    @jwt_required()
    def list_all():
        return ok([r.to_dict() for r in Model.query.all()])

    @app.route(f"{url}/<string:rid>", methods=["GET"], endpoint=f"{blueprint_name}_get")
    @jwt_required()
    def get_one(rid):
        r = Model.query.get_or_404(rid)
        return ok(r.to_dict())

    @app.route(url, methods=["POST"], endpoint=f"{blueprint_name}_create")
    @jwt_required()
    def create():
        data = request.json or {}
        obj = Model(**{k: v for k, v in data.items() if hasattr(Model, k)})
        db.session.add(obj)
        db.session.commit()
        return ok(obj.to_dict(), 201)

    @app.route(f"{url}/<string:rid>", methods=["PUT", "PATCH"], endpoint=f"{blueprint_name}_update")
    @jwt_required()
    def update(rid):
        obj = Model.query.get_or_404(rid)
        for k, v in (request.json or {}).items():
            if hasattr(obj, k):
                setattr(obj, k, v)
        db.session.commit()
        return ok(obj.to_dict())

    @app.route(f"{url}/<string:rid>", methods=["DELETE"], endpoint=f"{blueprint_name}_delete")
    @jwt_required()
    def delete(rid):
        obj = Model.query.get_or_404(rid)
        db.session.delete(obj)
        db.session.commit()
        return ok({"deleted": rid})

# ── Auth routes ───────────────────────────────────────────────────────────────

@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.json or {}
    user = User.query.filter_by(email=data.get("email", "").lower()).first()
    if not user or not check_password_hash(user.password, data.get("password", "")):
        return err("Invalid email or password.", 401)
    return ok({
        "access": create_access_token(identity=user.id),
        "refresh": create_refresh_token(identity=user.id),
        "user": user.to_dict(),
    })

@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.json or {}
    if User.query.filter_by(email=data.get("email", "").lower()).first():
        return err("Email already registered.", 409)
    role = data.get("role", "tenant")
    uid = f"{role[0]}{data.get('name','').replace(' ','').lower()}"
    user = User(id=uid, name=data.get("name"), email=data["email"].lower(),
                password=generate_password_hash(data["password"]), role=role)
    db.session.add(user)
    db.session.commit()
    return ok({"access": create_access_token(identity=user.id),
               "refresh": create_refresh_token(identity=user.id),
               "user": user.to_dict()}, 201)

@app.route("/api/auth/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    return ok({"access": create_access_token(identity=get_jwt_identity())})

# ── CRUD routes ───────────────────────────────────────────────────────────────

crud_routes("users",      User,     "/api/users")
crud_routes("properties", Property, "/api/properties")
crud_routes("tenants",    Tenant,   "/api/tenants")
crud_routes("leases",     Lease,    "/api/leases")
crud_routes("payments",   Payment,  "/api/payments")
crud_routes("inquiries",  Inquiry,  "/api/inquiries")
crud_routes("warnings",   Warning,  "/api/warnings")

# ── Seed ──────────────────────────────────────────────────────────────────────

def seed_demo():
    for uid, role, name, email, pw in [
        ("a1", "admin",   "Site Admin",     "admin@r3ntledger.com",   "admin123"),
        ("m1", "manager", "Joseph Musyoka", "manager@r3ntledger.com", "manager123"),
        ("t1", "tenant",  "John Tenant",    "john@r3ntledger.com",    "tenant123"),
        ("t2", "tenant",  "Mary Tenant",    "mary@r3ntledger.com",    "tenant123"),
    ]:
        if not User.query.get(uid):
            db.session.add(User(id=uid, name=name, email=email, password=generate_password_hash(pw), role=role))

    if not Property.query.get("p1"):
        db.session.add(Property(id="p1", name="Sunset Apartments", address="123 Sunset Blvd", units=10, manager_id="m1"))
    if not Property.query.get("p2"):
        db.session.add(Property(id="p2", name="Green Valley", address="456 Valley Rd", units=8, manager_id="m1"))

    db.session.flush()

    if not Tenant.query.get("t1"):
        db.session.add(Tenant(id="t1", user_id="t1", name="John Tenant", email="john@r3ntledger.com", unit="A1", property_id="p1"))
    if not Tenant.query.get("t2"):
        db.session.add(Tenant(id="t2", user_id="t2", name="Mary Tenant", email="mary@r3ntledger.com", unit="B2", property_id="p1"))

    db.session.flush()

    if not Lease.query.get("l1"):
        db.session.add(Lease(id="l1", tenant_id="t1", property_id="p1", start_date="2024-01-01", end_date="2025-12-01", status="active", approval="approved"))
    if not Lease.query.get("l2"):
        db.session.add(Lease(id="l2", tenant_id="t2", property_id="p1", start_date="2024-03-01", end_date="2025-03-01", status="active", approval="approved"))
    if not Payment.query.get("pay1"):
        db.session.add(Payment(id="pay1", tenant_id="t1", amount=1200, due_date="2025-02-01", status="paid", month="February 2025"))
    if not Payment.query.get("pay2"):
        db.session.add(Payment(id="pay2", tenant_id="t2", amount=1100, due_date="2025-02-01", status="pending", month="February 2025"))
    if not Inquiry.query.get("i1"):
        db.session.add(Inquiry(id="i1", tenant_id="t1", subject="Water leak", message="Leak in unit A1", date="2025-01-10", status="open"))
    if not Warning.query.get("w1"):
        db.session.add(Warning(id="w1", target="t1", target_name="John Tenant", message="Noise complaint", date="2025-01-15", is_global=False))
    if not Warning.query.get("w2"):
        db.session.add(Warning(id="w2", target="all", target_name="All Tenants", message="Rent due reminder", date="2025-01-20", is_global=True))

    db.session.commit()
    print("✓ Demo data seeded.")

# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        seed_demo()
    app.run(debug=True, port=8000)
