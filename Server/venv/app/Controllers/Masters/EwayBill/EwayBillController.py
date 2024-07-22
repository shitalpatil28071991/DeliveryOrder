# app/routes/group_routes.py
from flask import jsonify, request
from app import app, db
from app.models.Masters.EwayBillSetting.EwayBillModels import EwayBill 
import os

# Get the base URL from environment variables
API_URL = os.getenv('API_URL')
 
@app.route(API_URL + "/get-EwayBill-lastRecord", methods=["GET"])
def get_last_Record_by_EwayBill():
     try:
         # Extract Company_Code from query parameters
         company_code = request.args.get('Company_Code')
         if company_code is None:
             return jsonify({'error': 'Missing Company_Code parameter'}), 400
 
         try:
             company_code = int(company_code)
         except ValueError:
             return jsonify({'error': 'Invalid Company_Code parameter'}), 400
 
         # Fetch the last group by Company_Code Ordered by selected_RecOrd
         last_Record = EwayBill.query.filter_by(Company_Code=company_code).order_by(EwayBill.Company_Code.desc()).first()
 
         if last_Record is None:
             return jsonify({'error': 'No group found fOr the provided Company_Code'}), 404
 
         # Convert group to a dictionary
         last_Record_data = {column.key: getattr(last_Record, column.key) for column in last_Record.__table__.columns}
 
         return jsonify(last_Record_data)
     except Exception as e:
         print (e)
         return jsonify({'error': 'internal server error'}), 500


# Create a new group API

@app.route(API_URL + "/ewaybill", methods=["POST", "PUT"])
def upsert_EwayBill():
    try:
        # Extract Company_Code from query parameters
        company_code = request.args.get('Company_Code')
        if not company_code:
            return jsonify({'error': 'Missing Company_Code parameter'}), 400

        try:
            company_code = int(company_code)
        except ValueError:
            return jsonify({'error': 'Invalid Company_Code parameter'}), 400

        # Extract the request data
        record_data = request.json
        record_data['Company_Code'] = company_code

        # Check if the record exists
        existing_record = EwayBill.query.filter_by(Company_Code=company_code).first()

        if request.method == "POST":
            if existing_record:
                return jsonify({'error': 'Record already exists'}), 400

            # Create a new EwayBill record
            new_record = EwayBill(**record_data)
            db.session.add(new_record)
            db.session.commit()

            return jsonify({
                'message': 'Record created successfully',
                'record': record_data
            }), 201

        elif request.method == "PUT":
            if not existing_record:
                # Create a new record if it does not exist
                new_record = EwayBill(**record_data)
                db.session.add(new_record)
                db.session.commit()

                return jsonify({
                    'message': 'Record created successfully',
                    'record': record_data
                }), 201
            else:
                # Update the existing record
                for key, value in record_data.items():
                    setattr(existing_record, key, value)
                db.session.commit()

                return jsonify({
                    'message': 'Record updated successfully',
                    'record': record_data
                }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

