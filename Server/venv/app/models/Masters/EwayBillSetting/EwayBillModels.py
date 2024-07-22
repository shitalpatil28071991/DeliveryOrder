from app import db
class EwayBill(db.Model):
    __tablename__ = 'eway_bill'
    E_UserName = db.Column(db.String(250),nullable=True)
    E_UserPassword = db.Column(db.String(250),nullable=True)
    E_UrlAddress_Token = db.Column(db.String(250),nullable=True)
    E_UrlAddress_Bill = db.Column(db.String(250),nullable=True)
    E_UserName_Gov = db.Column(db.String(250),nullable=True)
    E_UserPassword_Gov = db.Column(db.String(250),nullable=True)
    E_Company_GSTno = db.Column(db.String(100),nullable=True)
    Company_Code = db.Column(db.Integer,primary_key=True)
    E_Envoice = db.Column(db.String(500),nullable=True)
    smsApi = db.Column(db.String(500),nullable=True)
    Sender_id = db.Column(db.String(500),nullable=True)
    Accusage = db.Column(db.String(100),nullable=True)
    Mode_of_Payment = db.Column(db.String(50),nullable=True)
    Account_Details = db.Column(db.String(50),nullable=True)
    Branch = db.Column(db.String(50),nullable=True)
    EInvoiceCancle = db.Column(db.String(250),nullable=True)

