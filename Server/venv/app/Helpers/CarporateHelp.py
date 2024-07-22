
import traceback
from flask import jsonify
from app import app, db
from sqlalchemy.exc import SQLAlchemyError 
from sqlalchemy import text
from flask import jsonify, request
import os

API_URL = os.getenv('API_URL')


@app.route(API_URL+'/carporateno', methods=['GET'])
def carporateno():
    try:
        CompanyCode = request.args.get('CompanyCode')
        
        #Tender_No = request.args.get('Tender_No')

        if  CompanyCode is None :
            return jsonify({'error': 'Missing CompanyCode parameter'}), 400
        # Start a database transaction
        with db.session.begin_nested():
            query = db.session.execute(text('''
               select distinct(Doc_No),doc_dateConverted as Doc_Date,carporatepartyaccountname as partyName,
                              carporatepartyunitname as UnitName,sell_rate,pono as Po_Details,quantal,dispatched,balance,selling_type
                              from qrycarporatedobalance where balance!=0 and
                           Company_Code= :CompanyCode
            '''),{'CompanyCode':CompanyCode})

            result = query.fetchall()

        response = []
        for row in result:
            response.append({
                'Doc_No': row.Doc_No,
                'doc_dateConverted': row.Doc_Date,
                'carporatepartyaccountname': row.partyName,
                'carporatepartyunitname': row.UnitName,
                'sell_rate': row.sell_rate,
                'pono':row.Po_Details,
                'quantal':row.quantal,
                'dispatched':row.dispatched,
                'balance':row.balance,
                'selling_type':row.selling_type

            })

        return jsonify(response)

    except SQLAlchemyError as error:
        # Handle database errors
        print("Error fetching data:", error)
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500
    


@app.route(API_URL+"/getCarporateData", methods=["GET"])
def getCarporateData():
        try:

            Company_Code = request.args.get('CompanyCode')
            Carporate_no = request.args.get('Carporate_no')
            print('Carporate_no',Carporate_no)
          
            if not all([Company_Code]):
                return jsonify({"error": "Missing required parameters"}), 400

            with db.session.begin_nested():
                query = db.session.execute(text('''
                        select ac_code as Ac_Code,carporatepartyaccountname as partyName,carporatepartyunitname as Unit_name,
                          Unit_Code,carporatepartyunitname as UnitName,
                        broker as BrokerCode,carporatepartybrokername as BrokerName,sell_rate as Sale_Rate,
                       pono as Po_Details,balance,selling_type as SellingType, 
                       bill_to,carporatebilltoname,CommissionRate,ac,uc,br,DeliveryType,
                        (case when selling_type='C' then Unit_Code else Ac_Code end) as Unitcode,
                         (case when selling_type='C' then uc else ac end) as Unitid,
                          (case when selling_type='C' then carporatepartyunitname else carporatepartyaccountname end) as Unitname
					                                    
                       from qrycarporatedobalance
                        where Company_Code= :Company_Code and Doc_No=:Doc_No 
            '''),{'Company_Code':Company_Code, 'Doc_No':Carporate_no})
                
            print('query',query)

            result = query.fetchall()

            last_details_data = [dict(row._mapping) for row in result]
            
            response = {
                "last_Carporate_data":last_details_data
            }

            return jsonify(response), 200

        except Exception as e:
            print("Traceback",traceback.format_exc())
            return jsonify({"error": "Internal server error", "message": str(e)}), 500

