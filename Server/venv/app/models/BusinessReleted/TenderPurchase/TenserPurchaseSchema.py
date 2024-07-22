# project_folder/app/schemas.py
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.BusinessReleted.TenderPurchase.TenderPurchaseModels import TenderHead,TenderDetails
from marshmallow import fields

class TenderDetailsSchema(SQLAlchemyAutoSchema):
    
    class Meta:
        model = TenderDetails
        include_relationships = True

class TenderHeadSchema(SQLAlchemyAutoSchema):
    details = fields.Nested(TenderDetailsSchema, many=True)
    class Meta:
        model = TenderHead
        include_relationships = True


