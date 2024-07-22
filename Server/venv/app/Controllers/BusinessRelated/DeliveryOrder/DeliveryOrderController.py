import traceback
from flask import Flask, jsonify, request
from app import app, db
from app.models.BusinessReleted.DeliveryOrder.DeliveryOrderModels import DeliveryOrderHead,DeliveryOrderDetail
from app.models.Reports.GLedeger.GLedgerModels import Gledger
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError 
from sqlalchemy import func
import os
import requests
import logging
from app.utils.CommonGLedgerFunctions import fetch_company_parameters,get_accoid,getSaleAc,get_acShort_Name
from app.models.BusinessReleted.TenderPurchase.TenderPurchaseModels import TenderHead,TenderDetails


API_URL= os.getenv('API_URL')

from app.models.BusinessReleted.DeliveryOrder.DeliveryOrderSchema import DeliveryOrderHeadSchema, DeliveryOrderDetailSchema

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

TASK_DETAILS_QUERY = '''
SELECT        dbo.nt_1_deliveryorder.mill_code, dbo.nt_1_deliveryorder.transport, dbo.nt_1_deliveryorder.GETPASSCODE, dbo.nt_1_deliveryorder.SaleBillTo, dbo.nt_1_deliveryorder.mc, dbo.nt_1_deliveryorder.gp, 
                         dbo.nt_1_deliveryorder.st, dbo.nt_1_deliveryorder.sb, dbo.nt_1_deliveryorder.tc, mill.Ac_Code AS millacode, mill.Ac_Name_E AS millname, mill.accoid AS millacid, shipto.accoid AS shiptoacid, shipto.Ac_Code AS shiptoaccode, 
                         salebillto.accoid AS salebillacid, salebillto.Ac_Code AS salebillaccode, salebillto.Ac_Name_E AS salebillname, transport.accoid AS transportacid, transport.Ac_Code AS transportaccode, transport.Ac_Name_E AS transportname, 
                         getpass.accoid AS getpassacid, getpass.Ac_Code AS getpassAccode, getpass.Ac_Name_E AS getpassname, dbo.nt_1_systemmaster.System_Code AS Item_Code, dbo.nt_1_systemmaster.System_Name_E AS itemname, 
                         dbo.nt_1_deliveryorder.ic, dbo.nt_1_deliveryorder.itemcode, dbo.nt_1_systemmaster.systemid, dbo.nt_1_deliveryorder.gstid, gstrate.gstid AS gst_Id, dbo.nt_1_deliveryorder.GstRateCode, gstrate.Doc_no AS gstdocno, 
                         gstrate.Rate AS Gstrate, dbo.nt_1_deliveryorder.TDSAc, dbo.nt_1_deliveryorder.TDSAcId, tdsac.accoid, tdsac.Ac_Code AS tdsaccode, tdsac.Ac_Name_E AS tdsacname, dbo.nt_1_deliveryorder.bk, dbo.nt_1_deliveryorder.broker, 
                         broker.accoid AS brokerid, broker.Ac_Code AS brokeraccode, broker.Ac_Name_E AS brokername, dbo.nt_1_deliveryorder.CashDiffAc, dbo.nt_1_deliveryorder.CashDiffAcId, cashdiffac.Ac_Code AS cashdiffaccode, 
                         cashdiffac.Ac_Name_E AS cashdiffacname, cashdiffac.accoid AS Expr1, dbo.nt_1_deliveryorder.brandcode, dbo.Brand_Master.Code, dbo.Brand_Master.Marka AS brandname, dbo.nt_1_dodetails.Bank_Code, 
                         bank.accoid AS bankacid, bank.Ac_Code AS bankaccode, bank.Ac_Name_E AS bankname, dbo.nt_1_dodetails.detail_Id, dbo.nt_1_dodetails.ddType, dbo.nt_1_dodetails.Narration, dbo.nt_1_dodetails.Amount, 
                         dbo.nt_1_dodetails.UTR_NO, dbo.nt_1_dodetails.DO_No, dbo.nt_1_dodetails.UtrYearCode, dbo.nt_1_dodetails.LTNo, dbo.nt_1_dodetails.doid, dbo.nt_1_dodetails.dodetailid, dbo.nt_1_dodetails.bc, 
                         dbo.nt_1_dodetails.utrdetailid, dbo.nt_1_dodetails.UtrCompanyCode, dbo.nt_1_deliveryorder.Vasuli_Ac, dbo.nt_1_deliveryorder.va, vasuliac.accoid AS vasuliacid, vasuliac.Ac_Code AS vasuliaccode, 
                         vasuliac.Ac_Name_E AS vasuliacname, dbo.nt_1_deliveryorder.MillGSTStateCode, millstatecode.State_Name AS millstatename, millstatecode.State_Code AS millstatecode, dbo.nt_1_deliveryorder.VoucherbyGstStateCode, 
                         voucherbystatecode.State_Code AS voucherbystatecode, voucherbystatecode.State_Name AS vaoucherbystatename, dbo.nt_1_deliveryorder.SalebilltoGstStateCode, salebillstatecode.State_Code AS salebilltostatecode, 
                         salebillstatecode.State_Name AS salebilltostatename, dbo.nt_1_deliveryorder.TransportGSTStateCode, transportstatecode.State_Code AS transportstatecode, transportstatecode.State_Name AS transportstatename, 
                         dbo.nt_1_deliveryorder.GetpassGstStateCode, getpassstatename.State_Code AS getpassstatecode, getpassstatename.State_Name AS getpassstatename, voucherby.Ac_Code AS voucherbyaccode, 
                         voucherby.Ac_Name_E AS voucherbyname, dbo.nt_1_deliveryorder.vb, dbo.nt_1_deliveryorder.voucher_by, voucherby.accoid AS voucherbyacic, dbo.nt_1_deliveryorder.docd, DO.accoid AS DOaccodeid, 
                         DO.Ac_Code AS DOacCode, DO.Ac_Name_E AS DOName, dbo.nt_1_deliveryorder.DO, dbo.nt_1_deliveryorder.MemoGSTRate, memogstrate.Doc_no AS memogstdocno, memogstrate.Rate AS memorategst,
                          gstrate.GST_Name AS gstratename
FROM            dbo.nt_1_accountmaster AS broker RIGHT OUTER JOIN
                         dbo.Brand_Master RIGHT OUTER JOIN
                         dbo.nt_1_gstratemaster AS gstrate RIGHT OUTER JOIN
                         dbo.nt_1_deliveryorder ON gstrate.Company_Code = dbo.nt_1_deliveryorder.company_code AND gstrate.Doc_no = dbo.nt_1_deliveryorder.GstRateCode LEFT OUTER JOIN
                         dbo.nt_1_gstratemaster AS memogstrate ON dbo.nt_1_deliveryorder.company_code = memogstrate.Company_Code AND dbo.nt_1_deliveryorder.MemoGSTRate = memogstrate.Doc_no LEFT OUTER JOIN
                         dbo.nt_1_accountmaster AS DO ON dbo.nt_1_deliveryorder.docd = DO.accoid LEFT OUTER JOIN
                         dbo.nt_1_accountmaster AS transport ON dbo.nt_1_deliveryorder.tc = transport.accoid LEFT OUTER JOIN
                         dbo.nt_1_accountmaster AS voucherby ON dbo.nt_1_deliveryorder.vb = voucherby.accoid LEFT OUTER JOIN
                         dbo.gststatemaster AS getpassstatename ON dbo.nt_1_deliveryorder.GetpassGstStateCode = getpassstatename.State_Code LEFT OUTER JOIN
                         dbo.gststatemaster AS transportstatecode ON dbo.nt_1_deliveryorder.TransportGSTStateCode = transportstatecode.State_Code LEFT OUTER JOIN
                         dbo.gststatemaster AS salebillstatecode ON dbo.nt_1_deliveryorder.SalebilltoGstStateCode = salebillstatecode.State_Code LEFT OUTER JOIN
                         dbo.gststatemaster AS voucherbystatecode ON dbo.nt_1_deliveryorder.VoucherbyGstStateCode = voucherbystatecode.State_Code LEFT OUTER JOIN
                         dbo.gststatemaster AS millstatecode ON dbo.nt_1_deliveryorder.MillGSTStateCode = millstatecode.State_Code LEFT OUTER JOIN
                         dbo.nt_1_accountmaster AS vasuliac ON dbo.nt_1_deliveryorder.va = vasuliac.accoid LEFT OUTER JOIN
                         dbo.nt_1_accountmaster AS bank RIGHT OUTER JOIN
                         dbo.nt_1_dodetails ON bank.accoid = dbo.nt_1_dodetails.bc ON dbo.nt_1_deliveryorder.doid = dbo.nt_1_dodetails.doid ON dbo.Brand_Master.Code = dbo.nt_1_deliveryorder.brandcode LEFT OUTER JOIN
                         dbo.nt_1_accountmaster AS cashdiffac ON dbo.nt_1_deliveryorder.CashDiffAcId = cashdiffac.accoid ON broker.accoid = dbo.nt_1_deliveryorder.bk LEFT OUTER JOIN
                         dbo.nt_1_accountmaster AS tdsac ON dbo.nt_1_deliveryorder.TDSAcId = tdsac.accoid RIGHT OUTER JOIN
                         dbo.nt_1_systemmaster ON dbo.nt_1_deliveryorder.ic = dbo.nt_1_systemmaster.systemid LEFT OUTER JOIN
                         dbo.nt_1_accountmaster AS mill ON dbo.nt_1_deliveryorder.mc = mill.accoid RIGHT OUTER JOIN
                         dbo.nt_1_accountmaster AS salebillto ON dbo.nt_1_deliveryorder.sb = salebillto.accoid LEFT OUTER JOIN
                         dbo.nt_1_accountmaster AS shipto ON dbo.nt_1_deliveryorder.st = shipto.accoid LEFT OUTER JOIN
                         dbo.nt_1_accountmaster AS getpass ON dbo.nt_1_deliveryorder.gp = getpass.accoid
        WHERE        (dbo.nt_1_systemmaster.System_Type = 'I') and dbo.nt_1_deliveryorder.doid=:doid
'''

def format_dates(task):
    return {
        
        "doc_date": task.doc_date.strftime('%Y-%m-%d') if task.doc_date else None,
        "Purchase_Date": task.Purchase_Date.strftime('%Y-%m-%d') if task.Purchase_Date else None,
        "mill_inv_date": task.mill_inv_date.strftime('%Y-%m-%d') if task.mill_inv_date else None,
        "newsbdate": task.newsbdate.strftime('%Y-%m-%d') if task.newsbdate else None,
        "EwayBillValidDate": task.EwayBillValidDate.strftime('%Y-%m-%d') if task.EwayBillValidDate else None,
        "Do_DATE": task.Do_DATE.strftime('%Y-%m-%d') if task.Do_DATE else None,
        "reached_date": task.reached_date.strftime('%Y-%m-%d') if task.reached_date else None,
        "reached_date": task.reached_date.strftime('%Y-%m-%d') if task.reached_date else None,

    }

# Define schemas
task_head_schema = DeliveryOrderHeadSchema()
task_head_schemas = DeliveryOrderHeadSchema(many=True)

task_detail_schema = DeliveryOrderDetailSchema()
task_detail_schemas = DeliveryOrderDetailSchema(many=True)

# Get data from both tables SaleBill and SaleBilllDetail
@app.route(API_URL+"/getdata-DeliveryOrder", methods=["GET"])
def getdata_DeliveryOrder():
    try:
        # Query both tables and get the data
        task_data = DeliveryOrderHead.query.all()
        user_data = DeliveryOrderDetail.query.all()
        # Serialize the data using schemas
        task_result = task_head_schemas.dump(task_data)
        user_result = task_detail_schemas.dump(user_data)
        response = {
            "nt_1_deliveryorder": task_result,
            "nt_1_dodetails": user_result
        }

        return jsonify(response), 200
    except Exception as e:
        # Handle any potential exceptions and return an error response with a 500 Internal Server Error status code
        return jsonify({"error": "Internal server error", "message": str(e)}), 500

# # We have to get the data By the Particular doc_no AND tran_type
@app.route(API_URL+"/DOByid", methods=["GET"])
def getDOByid():
    try:
        # Extract taskNo from request query parameters
        doc_no = request.args.get('doc_no')
        
        # Extract company_code from query parameters
        company_code = request.args.get('company_code')
        Year_Code = request.args.get('Year_Code')
        if company_code is None or Year_Code is None or doc_no is None:
            return jsonify({'error': 'Missing company_code Or Year_Code parameter'}), 400

        try:
            company_code = int(company_code)
            Year_Code = int(Year_Code)
        except ValueError:
            return jsonify({'error': 'Invalid company_code parameter'}), 400

        # Use SQLAlchemy to find the record by Task_No
        DO_head = DeliveryOrderHead.query.filter_by(doc_no=doc_no,company_code=company_code,Year_Code=Year_Code).first()

        newtaskid = DO_head.doid
        
        additional_data = db.session.execute(text(TASK_DETAILS_QUERY), {"doid": newtaskid})
       
        # Extracting category name from additional_data
        additional_data_rows = additional_data.fetchall()
      
        # Extracting category name from additional_data
        last_head_data = {column.name: getattr(DO_head, column.name) for column in DO_head.__table__.columns}
        last_head_data.update(format_dates(DO_head))

       


        # Convert additional_data_rows to a list of dictionaries
        last_details_data = [dict(row._mapping) for row in additional_data_rows]
        
        # Prepare response data
        response = {
            "last_head_data": last_head_data,
            "last_details_data": last_details_data
        }
        # If record found, return it
        return jsonify(response), 200

    except Exception as e:
        print(e)
        return jsonify({"error": "Internal server error", "message": str(e)}), 500



#Insert Record and Gldger Effects of DebitcreditNote and DebitcreditNoteDetail
@app.route(API_URL + "/insert-DeliveryOrder", methods=["POST"])
def insert_DeliveryOrder():
    def get_max_doc_no():
        return db.session.query(func.max(DeliveryOrderHead.doc_no)).scalar() or 0
 
    def create_gledger_entry(data, amount, drcr, ac_code, accoid,narration,DRCR_HEAD,ordercode):
        return {
            "TRAN_TYPE": data['tran_type'],
            "DOC_NO": new_doc_no,
            "DOC_DATE": data['doc_date'],
            "AC_CODE": ac_code,
            "AMOUNT": amount,
            "COMPANY_CODE": headData['company_code'],
            "YEAR_CODE": data['Year_Code'],
            "ORDER_CODE": 12,
            "DRCR": drcr,
            "UNIT_Code": 0,
            "NARRATION": narration,
            "TENDER_ID": 0,
            "TENDER_ID_DETAIL": 0,
            "VOUCHER_ID": 0,
            "DRCR_HEAD": 0,
            "ADJUSTED_AMOUNT": 0,
            "Branch_Code": 1,
            "SORT_TYPE": data['tran_type'],
            "SORT_NO": new_doc_no,
            "vc": 0,
            "progid": 0,
            "tranid": 0,
            "saleid":0,
            "ac": accoid
        }

    def add_gledger_entry(entries, data, amount, drcr, ac_code, accoid,narration,DRCR_HEAD,ordercode):
        if amount != 0:
            entries.append(create_gledger_entry(data, amount, drcr, ac_code, accoid,narration,DRCR_HEAD,ordercode))
            
    try:
        data = request.get_json()
        new_sale_data= data['headData']
        headData = new_sale_data.copy()
        detailData = data['detailData']

       
        logger.info("Fetched company parameters: %s", headData)
        max_doc_no = get_max_doc_no()
        new_doc_no = max_doc_no + 1
        
        
        headData['doc_no'] = new_doc_no
        
        remove_sale_data = ['TaxableAmountForSB','cgstrate','sgstrate','igstrate','cgstamt',
                            'sgstamt','igstamt','SaleDetail_Rate','SB_freight','SB_SubTotal','SB_Less_Frt_Rate',
                            'TotalGstSaleBillAmount','Roundoff','SBTCSAmt','Net_Payble','SBTDSAmt','save' ,'sale',
                            'item_Amount','SB_Ac_Code','SB_Unit_Code','PS_CGSTAmount','PS_SGSTAmount','PS_IGSTAmount','PS_CGSTRATE',
                            'PS_SGSTRATE','PS_IGSTRATE','TOTALPurchase_Amount','PSTCS_Amt','PSTDS_Amt','PSNetPayble','PS_SelfBal','PS_amount']

        for key in remove_sale_data:
            if key in headData:
                del headData[key]


        
        print('new_head',headData)
        new_head = DeliveryOrderHead(**headData)
        


        db.session.add(new_head)
        
        createdDetails = []
        updatedDetails = []
        deletedDetailIds = []
      
        for item in detailData:
            item['doc_no'] = new_doc_no
            item['doid'] = new_head.doid
            
            if 'rowaction' in item:
                if item['rowaction'] == "add":
                    del item['rowaction']
                    new_detail = DeliveryOrderDetail(**item)
                    new_head.details.append(new_detail)
                    createdDetails.append(new_detail)
                    logger.info("Added new detail: %s", new_detail)

                elif item['rowaction'] == "update":
                    dodetailid = item['dodetailid']
                    update_values = {k: v for k, v in item.items() if k not in ('dodetailid', 'rowaction', 'doid')}
                    db.session.query(DeliveryOrderDetail).filter(DeliveryOrderDetail.dodetailid == dodetailid).update(update_values)
                    updatedDetails.append(dodetailid)
                    logger.info("Updated detail with ID %s: %s", dodetailid, update_values)

                elif item['rowaction'] == "delete":
                    dodetailid = item['dodetailid']
                    detail_to_delete = db.session.query(DeliveryOrderDetail).filter(DeliveryOrderDetail.dodetailid == dodetailid).one_or_none()
                    if detail_to_delete:
                        db.session.delete(detail_to_delete)
                        deletedDetailIds.append(dodetailid)
                        logger.info("Deleted detail with ID %s", dodetailid)

         

        db.session.commit()
        logger.info("Head and details committed to the database")
              
     
       
        company_parameters = fetch_company_parameters(headData['company_code'], headData['Year_Code'])
        
        getpasscode=headData['GETPASSCODE']
        selfac= company_parameters.SELF_AC

        
        gledger_entries = []

        vasuli_amount1 = float(headData.get('amount', 0) or 0)
        vasuli_amount1=float(headData.get('vasuli_amount1', 0) or 0)
        vasuli_amount=float(headData.get('vasuli_amount', 0) or 0)
        TDSAc = headData['TDSAc']
        TDSAmt = float(headData.get('TDSAmt', 0) or 0)
        TDSCut = headData['TDSCut']
        transport = headData['transport']
        Memo_Advance =float(headData.get('Memo_Advance', 0) or 0)
        MemoGstRate =headData['MemoGSTRate']
        ordercode=0
        if TDSCut =="N" :
            transporttdsac=transport
        else:
            transporttdsac=company_parameters.TransportTDS_AcCut
        
        if getpasscode != selfac :
            if vasuli_amount1 != 0:
                ordercode=ordercode+1
                GETPASSCODE = headData['GETPASSCODE']
                accoid = get_accoid(GETPASSCODE,headData['company_code'])
                add_gledger_entry(gledger_entries, headData, vasuli_amount1, "D", GETPASSCODE, accoid,"",0,ordercode)
                logger.info("Added gledger entry for vasuli_amount1: %s", vasuli_amount1)

                ordercode=ordercode+1
                Vasuli_Ac = headData['Vasuli_Ac']
                accoid = get_accoid(Vasuli_Ac,headData['company_code'])
                add_gledger_entry(gledger_entries, headData, vasuli_amount1, "D", Vasuli_Ac, accoid,"",9999971,ordercode)
                logger.info("Added gledger entry for Vasuli_Ac: %s", Vasuli_Ac)

                
            if TDSAc != 0 :      
                if TDSAmt != 0 :
                    ordercode=ordercode+1
                    accoid = get_accoid(TDSAc,headData['company_code'])
                    add_gledger_entry(gledger_entries, headData, TDSAmt, "C", TDSAc, accoid,"",9999971,ordercode)
                    logger.info("Added gledger entry for TDSAc: %s", TDSAc)
                    ordercode=ordercode+1
                    accoid = get_accoid(transporttdsac,headData['company_code'])
                    add_gledger_entry(gledger_entries, headData, TDSAmt, "D", transporttdsac, accoid,"",transporttdsac,ordercode)
                    
                   
                 
            if Memo_Advance!=0 :
                 ordercode=ordercode+1
                 accoid = get_accoid(transport,headData['company_code'])
                 add_gledger_entry(gledger_entries, headData, Memo_Advance, "C", transport, accoid,"",transport,ordercode)
                 
                 
                 ordercode=ordercode+1
                 Freight_Ac=company_parameters.Freight_Ac
                 accoid = get_accoid(Freight_Ac,headData['company_code'])
                 add_gledger_entry(gledger_entries, headData, Memo_Advance, "D", Freight_Ac, accoid,"",Freight_Ac,ordercode)
                 
                 if MemoGstRate!=0:
                     RCMCGST=float(headData.get('RCMCGSTAmt', 0) or 0)
                     RCMSGST=float(headData.get('RCMSGSTAmt', 0) or 0)
                     RCMIGST=float(headData.get('RCMIGSTAmt', 0) or 0)

                     if RCMCGST >0:
                        ordercode=ordercode+1
                        CGST_RCM_Ac=company_parameters.CGST_RCM_Ac
                        accoid = get_accoid(CGST_RCM_Ac,headData['company_code'])
                        add_gledger_entry(gledger_entries, headData, RCMCGST, "D", CGST_RCM_Ac, accoid,"",headData['transport'],ordercode)
                        
                        ordercode=ordercode+1
                        CCGSTAc=company_parameters.CGSTAc
                        accoid = get_accoid(CCGSTAc,headData['company_code'])
                        add_gledger_entry(gledger_entries, headData, RCMCGST, "C", headData['transport'], accoid,"",transportac,ordercode)
                        
                     if RCMSGST >0:
                        ordercode=ordercode+1
                        SGST_RCM_Ac=company_parameters.SGST_RCM_Ac
                        accoid = get_accoid(SGST_RCM_Ac,headData['company_code'])
                        add_gledger_entry(gledger_entries, headData, RCMSGST, "D", SGST_RCM_Ac, accoid,"",headData['transport'],ordercode)
                        
                        ordercode=ordercode+1
                        CCGSTAc=company_parameters.SGSTAc
                        accoid = get_accoid(CCGSTAc,headData['company_code'])
                        add_gledger_entry(gledger_entries, headData, RCMSGST, "C", headData['transport'], accoid,"",transportac,ordercode)
                        
                     if RCMIGST >0:
                        ordercode=ordercode+1
                        IGST_RCM_Ac=company_parameters.IGST_RCM_Ac
                        accoid = get_accoid(IGST_RCM_Ac,headData['company_code'])
                        add_gledger_entry(gledger_entries, headData, RCMIGST, "D", IGST_RCM_Ac, accoid,"",headData['transport'],ordercode)
                        
                        ordercode=ordercode+1
                        SCGSTAc=company_parameters.IGSTAc
                        accoid = get_accoid(SCGSTAc,headData['company_code'])
                        add_gledger_entry(gledger_entries, headData, RCMIGST, "C", headData['transport'], accoid,"",transportac,ordercode)
              
            if vasuli_amount!=0:
                ordercode=ordercode+1
                accoid = get_accoid(transport,headData['company_code'])
                add_gledger_entry(gledger_entries, headData, vasuli_amount, "D", transport, accoid,"",transport,ordercode)
                ordercode=ordercode+1
            
                accoid = get_accoid(1,headData['company_code'])
                add_gledger_entry(gledger_entries, headData, vasuli_amount, "C", transport, accoid,"",transport,ordercode)
            
        else:
            if TDSAc!=0 :      
                if TDSAmt!=0 :
                    ordercode=ordercode+1
                    accoid = get_accoid(TDSAc,headData['company_code'])
                    add_gledger_entry(gledger_entries, headData, TDSAmt, "C", TDSAc, accoid,"",9999971,ordercode)

                    ordercode=ordercode+1
                    accoid = get_accoid(transporttdsac,headData['company_code'])
                    add_gledger_entry(gledger_entries, headData, TDSAmt, "D", transporttdsac, accoid,"",transporttdsac,ordercode)
             
            if vasuli_amount!=0:
                ordercode=ordercode+1
                accoid = get_accoid(transport,headData['company_code'])
                add_gledger_entry(gledger_entries, headData, vasuli_amount, "D", transport, accoid,"",transport,ordercode)

                ordercode=ordercode+1
                accoid = get_accoid(1,headData['company_code'])
                add_gledger_entry(gledger_entries, headData, vasuli_amount, "C", 1, accoid,"",transport,ordercode)
            
            if Memo_Advance!=0 :
                 ordercode=ordercode+1
                 accoid = get_accoid(transport,headData['company_code'])
                 add_gledger_entry(gledger_entries, headData, Memo_Advance, "C", transport, accoid,"",transport,ordercode)

                 ordercode=ordercode+1
                 Freight_Ac=company_parameters.Freight_Ac
                 accoid = get_accoid(Freight_Ac,headData['company_code'])
                 add_gledger_entry(gledger_entries, headData, Memo_Advance, "D", Freight_Ac, accoid,"",Freight_Ac,ordercode)

                 if MemoGstRate!=0:
                     RCMCGST=float(headData.get('RCMCGSTAmt', 0) or 0)
                     RCMSGST=float(headData.get('RCMSGSTAmt', 0) or 0)
                     RCMIGST=float(headData.get('RCMIGSTAmt', 0) or 0)

                     if RCMCGST >0:
                        ordercode=ordercode+1
                        CGST_RCM_Ac=company_parameters.CGST_RCM_Ac
                        accoid = get_accoid(CGST_RCM_Ac,headData['company_code'])
                        add_gledger_entry(gledger_entries, headData, RCMCGST, "D", CGST_RCM_Ac, accoid,"",headData['transport'],ordercode)
                        
                        ordercode=ordercode+1
                        CCGSTAc=company_parameters.CGSTAc
                        accoid = get_accoid(CCGSTAc,headData['company_code'])
                        add_gledger_entry(gledger_entries, headData, RCMCGST, "C", headData['transport'], accoid,"",transportac,ordercode)
                        
                     if RCMSGST >0:
                        ordercode=ordercode+1
                        SGST_RCM_Ac=company_parameters.SGST_RCM_Ac
                        accoid = get_accoid(SGST_RCM_Ac,headData['company_code'])
                        add_gledger_entry(gledger_entries, headData, RCMSGST, "D", SGST_RCM_Ac, accoid,"",headData['transport'],ordercode)
                        
                        ordercode=ordercode+1
                        CCGSTAc=company_parameters.SGSTAc
                        accoid = get_accoid(CCGSTAc,headData['company_code'])
                        add_gledger_entry(gledger_entries, headData, RCMSGST, "C", headData['transport'], accoid,"",transportac,ordercode)
                        
                     if RCMIGST > 0:
                        ordercode=ordercode+1
                        IGST_RCM_Ac=company_parameters.IGST_RCM_Ac
                        accoid = get_accoid(IGST_RCM_Ac,headData['company_code'])
                        add_gledger_entry(gledger_entries, headData, RCMIGST, "D", IGST_RCM_Ac, accoid,"",headData['transport'],ordercode)
                        
                        ordercode=ordercode+1
                        SCGSTAc=company_parameters.IGSTAc
                        accoid = get_accoid(SCGSTAc,headData['company_code'])
                        add_gledger_entry(gledger_entries, headData, RCMIGST, "C", headData['transport'], accoid,"",transportac,ordercode)
                        

         



        query_params = {
            'Company_Code': headData['company_code'],
            'DOC_NO': new_doc_no,
            'Year_Code': headData['Year_Code'],
            'TRAN_TYPE' : headData['tran_type']
            
        }
       
        response = requests.post("http://localhost:8080/api/sugarian/create-Record-gLedger", params=query_params, json=gledger_entries)
        

        if response.status_code == 201:
            db.session.commit()
        else:
            db.session.rollback()
            return jsonify({"error": "Failed to create gLedger record", "details": response.json()}), response.status_code


        

        
        desp_type=headData['desp_type']
       
        purchaseno=0
        detaildataappend=[]
        detailLedger_entry=[]
        if desp_type=="DI":
            for item in detailData:
                detailLedger_entry = [({
                                "rowaction":"add","detail_id":1,"Tran_Type":"PS","item_code":headData['itemcode'],
                                "narration":"abc","Quantal":headData['quantal'],"packing":headData['packing'],"bags":headData['bags'],
                                "rate":headData['mill_rate'],"item_Amount":new_sale_data['PS_amount'],"Company_Code":headData["company_code"],"Year_Code":headData["Year_Code"],
                                "ic":headData['ic'],"Brand_Code":headData['brandcode']
                })]

            
          
            detaildataappend.append(detailLedger_entry)
            
            create_PurchaseBill_entry= {
                       "detailData":detailLedger_entry,
                        
                        "headData":{ "doc_no":headData["voucher_no"],
                                "Tran_Type":"PS","PURCNO":new_doc_no,"doc_date":headData["Purchase_Date"],"Ac_Code":item['Bank_Code'],
                                "Unit_Code":0,"mill_code":headData["mill_code"],"FROM_STATION":"","TO_STATION":"",
                                "LORRYNO":headData["truck_no"],"ac":item.get('bc'),"mc":headData['mc'],
                                "Company_Code":headData["company_code"],"Year_Code":headData["Year_Code"],"BROKER":headData['broker'],
                                "subTotal":0,"LESS_FRT_RATE":0,"freight":0,"cash_advance":0,"bank_commission":0,"OTHER_AMT":0,"Bill_Amount":new_sale_data['TOTALPurchase_Amount'],
                                "Due_Days":1,"NETQNTL":headData['quantal'],"Created_By":headData['Created_By'],"Modified_By":headData['Modified_By'],
                                "Bill_No":headData['MillInvoiceNo'],"GstRateCode":headData['GstRateCode'],"CGSTRate":new_sale_data['PS_CGSTRATE'],"CGSTAmount":new_sale_data['PS_CGSTAmount'],"SGSTRate":new_sale_data['PS_SGSTRATE'],
                                "SGSTAmount":new_sale_data['PS_SGSTAmount'],"IGSTRate":new_sale_data['PS_IGSTRATE'],"IGSTAmount":new_sale_data['PS_IGSTAmount'],"EWay_Bill_No":headData['EWay_Bill_No'],"uc":0,"bk":headData['bk'],
                                "grade":headData['grade'],"mill_inv_date":headData['mill_inv_date'],"Purcid":0,
                                "SelfBal":'',"TCS_Rate":headData['TCS_Rate'],"TCS_Amt":0,"TCS_Net_Payable":0,"purchaseidnew":0,
                                "TDS_Amt":0,"TDS_Rate":headData['PurchaseTDSRate'],"Retail_Stock":"N","gstid":headData['gstid']
                        },
                        
                    }
            # logger.info("Creating PurchaseBill entry: %s", create_PurchaseBill_entry)
        
            response = requests.post("http://localhost:8080/api/sugarian/insert_SugarPurchase",  json=create_PurchaseBill_entry)

            if response.status_code == 201:
                data =response.json()
                added_details = data.get('addedDetails')
                doc_nos = next((detail.get('doc_no') for detail in added_details if 'doc_no' in detail), None)
                purchaseid=next((detail.get('purchase') for detail in added_details if 'purchase' in detail), None)
                new_head.voucher_no=doc_nos
                new_head.voucher_type="PS"
                new_head.purchaseid=purchaseid
                purchaseno=doc_nos
                db.session.commit()
            else:
                db.session.rollback()
                return jsonify({"error": "Failed to create PurchaseBill record", "details": response.json()}), response.status_code
            
            company_parameters = fetch_company_parameters(headData['company_code'], headData['Year_Code'])
            desp_type=headData["desp_type"]
            
            salebillto=headData["SaleBillTo"]
            SB_No=headData["SB_No"]
            SELFAC=company_parameters.SELF_AC
            autovaoucher=company_parameters.AutoVoucher
           
            SB_Ac_Codeaccoid = get_accoid(new_sale_data['SB_Ac_Code'], headData['company_code'])
            SB_Unit_Codeaccoid = get_accoid(new_sale_data['SB_Unit_Code'], headData['company_code'])
            

            if autovaoucher=="YES":
                if desp_type!="DO" and salebillto != "0" and salebillto != SELFAC and salebillto != "2":   
                    
   
                    create_SaleBill_entry= {
                                        "detailData":[{
                                                "rowaction":"add","detail_id":1,"Tran_Type":"SB","item_code":headData['itemcode'],
                                                "narration":"abc","Quantal":headData['quantal'],"packing":headData['packing'],"bags":headData['bags'],
                                                "rate":headData['mill_rate'],"item_Amount":new_sale_data['item_Amount'],"Company_Code":headData["company_code"],"Year_Code":headData["Year_Code"],
                                                "ic":headData['ic'],"Brand_Code":headData['brandcode']

                                        }],
                                        "headData":{ 
                                                "Tran_Type":"SB","PURCNO":purchaseno,"doc_date":headData["doc_date"],"Ac_Code":new_sale_data['SB_Ac_Code'],
                                                "Unit_Code":new_sale_data['SB_Unit_Code'],"mill_code":headData["mill_code"],"FROM_STATION":"","TO_STATION":"",
                                                "LORRYNO":headData["truck_no"],"ac":SB_Ac_Codeaccoid,"mc":headData['mc'],
                                                "Company_Code":headData["company_code"],"Year_Code":headData["Year_Code"],"BROKER":headData['broker'],
                                                "subTotal":new_sale_data['SB_SubTotal'],"LESS_FRT_RATE":new_sale_data['SB_Less_Frt_Rate'],"freight":new_sale_data['SB_freight'],"cash_advance":0,"bank_commission":0,"OTHER_AMT":new_sale_data['SB_Other_Amount'],"Bill_Amount":new_sale_data['TotalGstSaleBillAmount'],
                                                "Due_Days":1,"NETQNTL":headData['quantal'],"Modified_By":headData['Modified_By'],
                                                "GstRateCode":headData['GstRateCode'],"CGSTRate":new_sale_data['cgstrate'],"CGSTAmount":new_sale_data['cgstamt'],"SGSTRate":new_sale_data['sgstrate'],
                                                "SGSTAmount":new_sale_data['sgstamt'],"IGSTRate":new_sale_data['igstrate'],"IGSTAmount":new_sale_data['igstamt'],"EWay_Bill_No":headData['EWay_Bill_No'],"uc":SB_Unit_Codeaccoid,"bk":headData['bk'],
                                                "Purcid":0,"saleidnew":0,
                                                "TCS_Rate":headData['Sale_TCS_Rate'],"TCS_Amt":new_sale_data['SBTCSAmt'],"TCS_Net_Payable":0,"saleidnew":0,
                                                "TDS_Amt":new_sale_data['SBTDSAmt'],"TDS_Rate":headData['PurchaseTDSRate'],"gstid":headData['gstid'],"TaxableAmount":new_sale_data['TaxableAmountForSB'],
                                                "EWayBill_Chk":headData["EWayBillChk"],"MillInvoiceNo":headData["MillInvoiceNo"],"RoundOff":0,
                                                "Transport_Code":headData["transport"],"tc":headData["tc"],"DoNarrtion":headData["narration3"],"newsbno":0,
                                                "einvoiceno":headData["einvoiceno"],"ackno":headData['ackno'],"Delivery_type":headData["Delivery_Type"],
                                                "Bill_To":headData['carporate_ac'],"bt":headData['ca'],"EwayBillValidDate":headData['doc_date'],"IsDeleted":1,
                                                "SBNarration":headData["SBNarration"],"Insured":headData["Insured"],"DO_No":new_doc_no


                                        },
                                        
                                    
                            }
                    
                   
                    response = requests.post("http://localhost:8080/api/sugarian/insert-SaleBill",  json=create_SaleBill_entry)

                    if response.status_code == 201:
                        data = response.json()
                        added_detailssb = data.get('addedDetails')
                        doc_nos = next((detail.get('doc_no') for detail in added_detailssb if 'doc_no' in detail), None)
                        saleid=next((detail.get('Saleid') for detail in added_detailssb if 'Saleid' in detail), None)
                        new_head.SB_No=doc_nos
                        new_head.saleid=saleid
                        
                        db.session.commit()
                    else:
                        db.session.rollback()
                        return jsonify({"error": "Failed to create SaleBill record", "details": response.json()}), response.status_code

        else:
            
            create_CommisionBill_entry= {
                
                                "Tran_Type":"SB","doc_date":headData["doc_date"],"link_no":new_doc_no,"link_type":"","link_id":0,
                                "ac_code":headData['SaleBillTo'],"unit_code":headData['GETPASSCODE'],"broker_code":headData['broker'],
                                "qntl":headData['quantal'],"packing":headData["packing"],"bags":headData['bags'],"grade":headData['grade'],
                                "transport_code":headData["transport"],"mill_rate":headData["mill_rate"],"sale_rate":headData['sale_rate'],
                                "purc_rate":headData["PurchaseRate"],"commission_amount":0,"resale_rate":headData["Tender_Commission"],"resale_commission":0,
                                "texable_amount":0,"gst_code":headData["GstRateCode"],"cgst_rate":0,"cgst_amount":0,"sgst_rate":0,"sgst_amount":0,"igst_rate":0,"igst_amount":0,
                                "bill_amount":0,"Company_Code":headData["company_code"],"Year_Code":headData["Year_Code"],"Created_By":headData["Created_By"],
                                "ac":headData["sb"],"uc":headData["gp"],"bc":headData["bk"],"tc":headData["tc"],"mill_code":headData["mill_code"],"mc":headData["mc"],
                                "narration1":"","narration2":"","narration3":"","narration4":"","TCS_Rate":headData["Sale_TCS_Rate"],"TCS_Amt":0,"TCS_Net_Payable":0,
                                "Tran_Type":"","HSN":"","item_code":headData["itemcode"],"ic":headData["ic"],"Frieght_Rate":0,"Frieght_amt":headData["Memo_Advance"],
                                "subtotal":headData["diff_amount"],"IsTDS":headData["TDSCut"],"TDS_Ac":headData["TDSAc"],"TDS_Per":headData["TDSRate"],
                                "TDSAmount":headData["TDSAmt"],"TDS":headData["TDSRate"],"ta":headData["TDSAcId"],'Branch_Code':0,'Created_By':''
                 
            }

            query_params = {
            'Company_Code': headData['company_code'],
            'Year_Code': headData['Year_Code'],
            'Tran_Type': "LV"
                        }

            response = requests.post("http://localhost:8080/api/sugarian/create-RecordCommissionBill",params=query_params,json=create_CommisionBill_entry)
           
            if response.status_code == 201:
                data=response.json()
                added_detailssb = data.get('record')
                
                 
                voucher_no = added_detailssb['doc_no']
                commisionid = added_detailssb['commissionid']
                # commisionid=next((detail['commisionid'] for detail in added_detailssb if 'commisionid' in detail), None)
                
                new_head.voucher_no=voucher_no
                new_head.commisionid=commisionid
                 
                db.session.commit()
                
            else:
                db.session.rollback()
                return jsonify({"error": "Failed to create CommisionBill record", "details": response.json()}), response.status_code
            

    ####creation of stock entry
        tender_no=headData["purc_no"]
        tender_head = TenderHead.query.filter_by(Tender_No=tender_no).first()
        if not tender_head:
            return jsonify({"error": "Tender not found"}), 404

        tenderid = tender_head.tenderid

        # Generate new ID for the detail entry
        max_detail_id = db.session.query(func.max(TenderDetails.ID)).filter_by(tenderid=tenderid).scalar() or 0
        new_detail_id = max_detail_id + 1

        detail_record = db.session.execute(text("select * from nt_1_tenderdetails where ID=:id and tenderid=:tenderid" ),{'id':1,'tenderid':tenderid})
        
        detail_record = detail_record.fetchall()

        result = [dict(row._mapping) for row in detail_record]

        

        buyer_quantal = result[0].get('Buyer_Quantal')
        selfquantalid=result[0].get('tenderdetailid')
       
        selfstock=float(buyer_quantal)
        SaleQuantal=headData["quantal"]
        TenderStockQty= selfstock-float(SaleQuantal)

       
        
        purcorder=headData["purc_order"]
        if purcorder==1:
                create_TenderStock_entry= {
                "detailData":[{
                            "rowaction":"add","Tender_No":headData["purc_no"],"Buyer":headData['SaleBillTo'],"Buyer_Quantal":headData["quantal"],
                            "Sale_Rate":headData["sale_rate"],"Commission_Rate":headData["Tender_Commission"],"Sauda_Date":headData["doc_date"],
                            "Lifting_Date":headData["doc_date"],"ID":new_detail_id,"Buyer_Party":headData["broker"],"Delivery_Type":headData["Delivery_Type"],
                            "tenderid":tenderid,"buyerid":headData["sb"],"buyerpartyid":headData["bk"],"sub_broker":headData["broker"],
                            "sbr":headData["bk"],"ShipTo":headData["voucher_by"],"shiptoid":headData["vb"],"Company_Code":headData["company_code"],
                            "year_code":headData["Year_Code"]

                },
                {
                            "rowaction":"update","Tender_No":headData["purc_no"],"Buyer_Quantal":TenderStockQty,
                            "ID":1,"tenderid":tenderid,"tenderdetailid":selfquantalid,
                            
                }],
               
        
                }
                
                Stock_query_params = {
                        'tenderid':tenderid,
                        'Tender_No': headData["purc_no"],
                        
                        }

                response = requests.put("http://localhost:8080/api/sugarian/Stock_Entry_tender_purchase",params=Stock_query_params,json=create_TenderStock_entry)
        

        if response.status_code == 200:
            data=response.json()
            
            added_detailssb = data.get('addedDetails')
            
            first_dict = added_detailssb[0]
            tenderdetailid = first_dict['tenderdetailid']
            
            new_head.tenderdetailid=tenderdetailid
            db.session.commit()
                
        else:
            db.session.rollback()
            return jsonify({"error": "Failed to create Tender record", "details": response.json()}), response.status_code
                


        return jsonify({
            "message": "Data Inserted successfully",
            "head": task_head_schema.dump(new_head),
            "addedDetails": task_detail_schemas.dump(createdDetails),
            "updatedDetails": updatedDetails,
            "deletedDetailIds": deletedDetailIds
        }), 201

    except Exception as e:
        db.session.rollback()
        logger.error("An error occurred: %s", str(e))
        logger.error("Traceback: %s", traceback.format_exc())
        return jsonify({"error": "Internal server error", "message": str(e)}), 500
    
    #Update Record and Gldger Effects of SaleBill and SaleBill
@app.route(API_URL + "/update-DeliveryOrder", methods=["PUT"])
def update_DeliveryOrder():

    def create_gledger_entry(data, amount, drcr, ac_code, accoid,narration,DRCR_HEAD,ordercode):
        return {
            "TRAN_TYPE": 'DO',
            "DOC_NO": updateddoc_no,
            "DOC_DATE": data['doc_date'],
            "AC_CODE": ac_code,
            "AMOUNT": amount,
            "COMPANY_CODE": data['company_code'],
            "YEAR_CODE": data['Year_Code'],
            "ORDER_CODE": 12,
            "DRCR": drcr,
            "UNIT_Code": 0,
            "NARRATION": narration,
            "TENDER_ID": 0,
            "TENDER_ID_DETAIL": 0,
            "VOUCHER_ID": 0,
            "DRCR_HEAD": 0,
            "ADJUSTED_AMOUNT": 0,
            "Branch_Code": 1,
            "SORT_TYPE": 'DO',
            "SORT_NO": updateddoc_no,
            "vc": 0,
            "progid": 0,
            "tranid": 0,
            "saleid": 0,
            "ac": accoid
        }

    def add_gledger_entry(entries, data, amount, drcr, ac_code, accoid,narration,DRCR_HEAD,ordercode):
        if amount != 0:
            entries.append(create_gledger_entry(data, amount, drcr, ac_code, accoid,narration,DRCR_HEAD,ordercode))
            
    try:
        doid = request.args.get('doid')
        if doid is None:
            return jsonify({"error": "Missing 'doid' parameter"}), 400
        
        data = request.get_json()
        new_sale_data= data['headData']
        headData = new_sale_data.copy()
        # headData = data['headData']
        detailData = data['detailData']

        remove_sale_data = ['TaxableAmountForSB','cgstrate','sgstrate','igstrate','cgstamt',
                            'sgstamt','igstamt','SaleDetail_Rate','SB_freight','SB_SubTotal','SB_Less_Frt_Rate',
                            'TotalGstSaleBillAmount','Roundoff','SBTCSAmt','Net_Payble','save' ,'sale','SBTDSAmt',
                            'item_Amount','SB_Ac_Code','SB_Unit_Code','PS_CGSTAmount','PS_SGSTAmount','PS_IGSTAmount','PS_CGSTRATE',
                            'PS_SGSTRATE','PS_IGSTRATE','TOTALPurchase_Amount','PSTCS_Amt','PSTDS_Amt','PSNetPayble','PS_SelfBal','PS_amount']

        for key in remove_sale_data:
            if key in headData:
                del headData[key]

        tran_type = headData.get('tran_type')
        if tran_type is None:
             return jsonify({"error": "Bad Request", "message": "tran_type and bill_type is required"}), 400


        company_code=headData['company_code']
        doc_no=headData['doc_no']
        Year_Code=headData['Year_Code']

      #  DO_head = DeliveryOrderHead.query.filter_by(doc_no=doc_no,company_code=company_code,Year_Code=Year_Code).first()

        
        # Extracting category name from additional_data
        # last_head_data = {column.name: getattr(DO_head, column.name) for column in DO_head.__table__.columns}
        # last_head_data.update(format_dates(DO_head))

        

        #print("last_head_data",last_head_data)
        # Update the head data
        updatedHeadCount = db.session.query(DeliveryOrderHead).filter(DeliveryOrderHead.doid == doid).update(headData)
        updated_DO_head = db.session.query(DeliveryOrderHead).filter(DeliveryOrderHead.doid == doid).one()
        updateddoc_no = updated_DO_head.doc_no
        #print("updated_DO_head",updated_DO_head)

        createdDetails = []
        updatedDetails = []
        deletedDetailIds = []
        
        for item in detailData:
            item['doid'] = updated_DO_head.doid

            if 'rowaction' in item:
                if item['rowaction'] == "add":
                    del item['rowaction']
                    item['doc_no'] = updateddoc_no
                    new_detail = DeliveryOrderDetail(**item)
                    updated_DO_head.details.append(new_detail)
                    createdDetails.append(new_detail)

                elif item['rowaction'] == "update":
                    dodetailid = item['dodetailid']
                    update_values = {k: v for k, v in item.items() if k not in ('dodetailid', 'rowaction', 'doid')}
                    db.session.query(DeliveryOrderDetail).filter(DeliveryOrderDetail.dodetailid == dodetailid).update(update_values)
                    updatedDetails.append(dodetailid)

                elif item['rowaction'] == "delete":
                    dodetailid = item['dodetailid']
                    detail_to_delete = db.session.query(DeliveryOrderDetail).filter(DeliveryOrderDetail.dodetailid == dodetailid).one_or_none()
                    if detail_to_delete:
                        db.session.delete(detail_to_delete)
                        deletedDetailIds.append(dodetailid)
                        

        db.session.commit()

        company_parameters = fetch_company_parameters(headData['company_code'], headData['Year_Code'])

        getpasscode=headData['GETPASSCODE']
        selfac= company_parameters.SELF_AC
        
        vasuli_amount1=headData['vasuli_amount1']
        vasuli_amount=headData['vasuli_amount']
        TDSAc = headData['TDSAc']
        TDSAmt = headData['TDSAmt']
        TDSCut = headData['TDSCut']
        transport = headData['transport']
        Memo_Advance = headData['Memo_Advance']
        ordercode=0
        if TDSCut =='N' :
            transporttdsac=transport
        else:
            transporttdsac=company_parameters.TransportTDS_AcCut
         

      
        gledger_entries = []

        if getpasscode != selfac :
            if vasuli_amount1 != 0:
                ordercode=ordercode+1
                GETPASSCODE = headData['GETPASSCODE']
                accoid = get_accoid(GETPASSCODE,headData['company_code'])
                add_gledger_entry(gledger_entries, headData, vasuli_amount1, 'D', GETPASSCODE, accoid,'',0,ordercode)

                ordercode=ordercode+1
                Vasuli_Ac = headData['Vasuli_Ac']
                accoid = get_accoid(Vasuli_Ac,headData['company_code'])
                add_gledger_entry(gledger_entries, headData, vasuli_amount1, 'D', Vasuli_Ac, accoid,'',9999971,ordercode)
                
            if TDSAc != 0 :      
                if TDSAmt != 0 :
                    ordercode=ordercode+1
                    accoid = get_accoid(TDSAc,headData['company_code'])
                    add_gledger_entry(gledger_entries, headData, TDSAmt, 'C', TDSAc, accoid,'',9999971,ordercode)

                    ordercode=ordercode+1
                    accoid = get_accoid(transporttdsac,headData['company_code'])
                    add_gledger_entry(gledger_entries, headData, TDSAmt, 'D', transporttdsac, accoid,'',transporttdsac,ordercode)
                 
            if Memo_Advance!=0 :
                 ordercode=ordercode+1
                 accoid = get_accoid(transport,headData['company_code'])
                 add_gledger_entry(gledger_entries, headData, Memo_Advance, 'C', transport, accoid,'',transport,ordercode)

                 ordercode=ordercode+1
                 Freight_Ac=company_parameters.Freight_Ac
                 accoid = get_accoid(Vasuli_Ac,headData['company_code'])
                 add_gledger_entry(gledger_entries, headData, Memo_Advance, 'D', Freight_Ac, accoid,'',Freight_Ac,ordercode)
         
            if vasuli_amount!=0:
                ordercode=ordercode+1
                accoid = get_accoid(transport,headData['company_code'])
                add_gledger_entry(gledger_entries, headData, vasuli_amount, 'D', transport, accoid,'',transport,ordercode)

                ordercode=ordercode+1
                accoid = get_accoid(1,headData['company_code'])
                add_gledger_entry(gledger_entries, headData, vasuli_amount, 'C', transport, accoid,'',transport,ordercode)
            
        else:
            if TDSAc!=0 :      
                if TDSAmt!=0 :
                    ordercode=ordercode+1
                    accoid = get_accoid(TDSAc,headData['company_code'])
                    add_gledger_entry(gledger_entries, headData, TDSAmt, 'C', TDSAc, accoid,'',9999971,ordercode)

                    ordercode=ordercode+1
                    accoid = get_accoid(transporttdsac,headData['company_code'])
                    add_gledger_entry(gledger_entries, headData, TDSAmt, 'D', transporttdsac, accoid,'',transporttdsac,ordercode)
             
            if vasuli_amount!=0:
                ordercode=ordercode+1
                accoid = get_accoid(transport,headData['company_code'])
                add_gledger_entry(gledger_entries, headData, vasuli_amount, 'D', transport, accoid,'',transport,ordercode)

                ordercode=ordercode+1
                accoid = get_accoid(1,headData['company_code'])
                add_gledger_entry(gledger_entries, headData, vasuli_amount, 'C', 1, accoid,'',transport,ordercode)
              
            if Memo_Advance!=0 :
                 ordercode=ordercode+1
                 accoid = get_accoid(transport,headData['company_code'])
                 add_gledger_entry(gledger_entries, headData, Memo_Advance, 'C', transport, accoid,'',transport,ordercode)
                
                 ordercode=ordercode+1
                 Freight_Ac=company_parameters.Freight_Ac
                 accoid = get_accoid(Freight_Ac,headData['company_code'])
                 add_gledger_entry(gledger_entries, headData, Memo_Advance, 'D', Freight_Ac, accoid,'',Freight_Ac,ordercode)
         
       
        query_params = {
            'Company_Code': headData['company_code'],
            'DOC_NO': updateddoc_no,
            'Year_Code': headData['Year_Code'],
            'TRAN_TYPE': headData['tran_type']
        }
    
        response = requests.post("http://localhost:8080/api/sugarian/create-Record-gLedger", params=query_params, json=gledger_entries)

        if response.status_code == 201:
            db.session.commit()
        else:
            db.session.rollback()
            return jsonify({"error": "Failed to create gLedger record", "details": response.json()}), response.status_code
        
        desp_type=headData['desp_type']
        detaildataappend=[]
        detailLedger_entry=[]
        purchaseno=0
        print('Voucherno',headData['voucher_no'])
        if desp_type=='DI':
            for item in detailData:
                detailLedger_entry = [({
                                "rowaction":"add","detail_id":1,"Tran_Type":"PS","item_code":headData['itemcode'],
                                "narration":"abc","Quantal":headData['quantal'],"packing":headData['packing'],"bags":headData['bags'],
                                "rate":headData['mill_rate'],"item_Amount":new_sale_data['PS_amount'],"Company_Code":headData["company_code"],"Year_Code":headData["Year_Code"],
                                "ic":headData['ic'],"Brand_Code":headData['brandcode'],"doc_no":headData['voucher_no'],
                                "purchaseid":headData["purchaseid"]
                })]

            
            detaildataappend.append(detailLedger_entry)

            update_PurchaseBill_entry= {
                        
                      "detailData":detailLedger_entry,
                        # "detailData":[{
                        #         "rowaction":"update","detail_id":1,"Tran_Type":"PS","item_code":headData['itemcode'],
                        #         "narration":"abc","Quantal":headData['quantal'],"packing":headData['packing'],"bags":headData['bags'],
                        #         "rate":headData['mill_rate'],"item_Amount":0,"Company_Code":headData["company_code"],"Year_Code":headData["Year_Code"],
                        #         "ic":headData['ic'],"Brand_Code":headData['brandcode'],"purchasedetailid":0,"doc_no":headData['voucher_no'],
                        #         "purchaseid":headData["purchaseid"]

                        # }],
                       "headData":{ "doc_no":headData["voucher_no"],
                                "Tran_Type":"PS","PURCNO":headData['doc_no'],"doc_date":headData["Purchase_Date"],"Ac_Code":item['Bank_Code'],
                                "Unit_Code":0,"mill_code":headData["mill_code"],"FROM_STATION":"","TO_STATION":"",
                                "LORRYNO":headData["truck_no"],"ac":item.get('bc'),"mc":headData['mc'],
                                "Company_Code":headData["company_code"],"Year_Code":headData["Year_Code"],"BROKER":headData['broker'],
                                "subTotal":0,"LESS_FRT_RATE":0,"freight":0,"cash_advance":0,"bank_commission":0,"OTHER_AMT":0,"Bill_Amount":new_sale_data['TOTALPurchase_Amount'],
                                "Due_Days":1,"NETQNTL":headData['quantal'],"Created_By":headData['Created_By'],"Modified_By":headData['Modified_By'],
                                "Bill_No":headData['MillInvoiceNo'],"GstRateCode":headData['GstRateCode'],"CGSTRate":new_sale_data['PS_CGSTRATE'],"CGSTAmount":new_sale_data['PS_CGSTAmount'],"SGSTRate":new_sale_data['PS_SGSTRATE'],
                                "SGSTAmount":new_sale_data['PS_SGSTAmount'],"IGSTRate":new_sale_data['PS_IGSTRATE'],"IGSTAmount":new_sale_data['PS_IGSTAmount'],"EWay_Bill_No":headData['EWay_Bill_No'],"uc":0,"bk":headData['bk'],
                                "grade":headData['grade'],"mill_inv_date":headData['mill_inv_date'],"Purcid":0,
                                "SelfBal":'',"TCS_Rate":headData['TCS_Rate'],"TCS_Amt":0,"TCS_Net_Payable":0,"purchaseidnew":0,
                                "TDS_Amt":0,"TDS_Rate":headData['PurchaseTDSRate'],"Retail_Stock":"N","gstid":headData['gstid']
                        },
                        
                    }
            purch_param={
                 'purchaseid': headData['purchaseid']
                 
            }
            
            response = requests.put("http://localhost:8080/api/sugarian/update-SugarPurchase", params=purch_param ,json=update_PurchaseBill_entry)
           
            if response.status_code == 200:
                data =response.json()
                print('data',response.json())
                added_details = data.get('addedDetails')
                doc_nos = next((detail.get('doc_no') for detail in added_details if 'doc_no' in detail), None)
                purchaseid=next((detail.get('purchase') for detail in added_details if 'purchase' in detail), None)
                headData['voucher_no']=doc_nos
                headData['voucher_type']="PS"
                headData['purchaseid']=purchaseid
                purchaseno=doc_nos
                db.session.commit()
            else:
                db.session.rollback()
                return jsonify({"error": "Failed to update PurchaseBill record", "details": response.json()}), response.status_code


            
            company_parameters = fetch_company_parameters(headData['company_code'], headData['Year_Code'])
            desp_type=headData["desp_type"]
            salebillto=headData["SaleBillTo"]
            print('salebillto',salebillto)
            SB_No=headData["SB_No"]
            SELFAC=company_parameters.SELF_AC
            autovaoucher=company_parameters.AutoVoucher
            SB_Ac_Codeaccoid = get_accoid(new_sale_data['SB_Ac_Code'], headData['company_code'])
            SB_Unit_Codeaccoid = get_accoid(new_sale_data['SB_Unit_Code'], headData['company_code'])
            

            if autovaoucher=="YES":
                    if desp_type!="DO" and salebillto != "0" and salebillto != SELFAC and salebillto != "2":
                        if SB_No=="" and SB_No==0 :
                           
                            update_SaleBill_entry= {
                                    "detailData":[{
                                                "rowaction":"add","detail_id":1,"Tran_Type":"SB","item_code":headData['itemcode'],
                                                "narration":"abc","Quantal":headData['quantal'],"packing":headData['packing'],"bags":headData['bags'],
                                                "rate":headData['mill_rate'],"item_Amount":new_sale_data['item_Amount'],"Company_Code":headData["company_code"],"Year_Code":headData["Year_Code"],
                                                "ic":headData['ic'],"Brand_Code":headData['brandcode']

                                        }],
                                        "headData":{ 
                                                "Tran_Type":"SB","PURCNO":purchaseno,"doc_date":headData["doc_date"],"Ac_Code":new_sale_data['SB_Ac_Code'],
                                                "Unit_Code":new_sale_data['SB_Unit_Code'],"mill_code":headData["mill_code"],"FROM_STATION":"","TO_STATION":"",
                                                "LORRYNO":headData["truck_no"],"ac":SB_Ac_Codeaccoid,"mc":headData['mc'],
                                                "Company_Code":headData["company_code"],"Year_Code":headData["Year_Code"],"BROKER":headData['broker'],
                                                "subTotal":new_sale_data['SB_SubTotal'],"LESS_FRT_RATE":new_sale_data['SB_Less_Frt_Rate'],"freight":new_sale_data['SB_freight'],"cash_advance":0,"bank_commission":0,"OTHER_AMT":new_sale_data['SB_Other_Amount'],"Bill_Amount":new_sale_data['TotalGstSaleBillAmount'],
                                                "Due_Days":1,"NETQNTL":headData['quantal'],"Modified_By":headData['Modified_By'],
                                                "GstRateCode":headData['GstRateCode'],"CGSTRate":new_sale_data['cgstrate'],"CGSTAmount":new_sale_data['cgstamt'],"SGSTRate":new_sale_data['sgstrate'],
                                                "SGSTAmount":new_sale_data['sgstamt'],"IGSTRate":new_sale_data['igstrate'],"IGSTAmount":new_sale_data['igstamt'],"EWay_Bill_No":headData['EWay_Bill_No'],"uc":SB_Unit_Codeaccoid,"bk":headData['bk'],
                                                "Purcid":0,"saleidnew":0,
                                                "TCS_Rate":headData['Sale_TCS_Rate'],"TCS_Amt":new_sale_data['SBTCSAmt'],"TCS_Net_Payable":0,"saleidnew":0,
                                                "TDS_Amt":new_sale_data['SBTDSAmt'],"TDS_Rate":headData['PurchaseTDSRate'],"gstid":headData['gstid'],"TaxableAmount":new_sale_data['TaxableAmountForSB'],
                                                "EWayBill_Chk":headData["EWayBillChk"],"MillInvoiceNo":headData["MillInvoiceNo"],"RoundOff":0,
                                                "Transport_Code":headData["transport"],"tc":headData["tc"],"DoNarrtion":headData["narration3"],"newsbno":0,
                                                "einvoiceno":headData["einvoiceno"],"ackno":headData['ackno'],"Delivery_type":headData["Delivery_Type"],
                                                "Bill_To":headData['carporate_ac'],"bt":headData['ca'],"EwayBillValidDate":headData['doc_date'],"IsDeleted":1,
                                                "SBNarration":headData["SBNarration"],"Insured":headData["Insured"],"DO_No":headData['doc_no']


                                        },
                                        
                                    
                        }
                            response = requests.post("http://localhost:8080/api/sugarian/insert-SaleBill",  json=update_SaleBill_entry)

                        else :
                           
                            update_SaleBill_entry= {
                                    "detailData":[{
                                                "rowaction":"add","detail_id":1,"Tran_Type":"SB","item_code":headData['itemcode'],
                                                "narration":"abc","Quantal":headData['quantal'],"packing":headData['packing'],"bags":headData['bags'],
                                                "rate":headData['mill_rate'],"item_Amount":new_sale_data['item_Amount'],"Company_Code":headData["company_code"],"Year_Code":headData["Year_Code"],
                                                "ic":headData['ic'],"Brand_Code":headData['brandcode']

                                        }],
                                        "headData":{ "doc_no":headData["SB_No"],
                                                "Tran_Type":"SB","PURCNO":purchaseno,"doc_date":headData["doc_date"],"Ac_Code":new_sale_data['SB_Ac_Code'],
                                                "Unit_Code":new_sale_data['SB_Unit_Code'],"mill_code":headData["mill_code"],"FROM_STATION":"","TO_STATION":"",
                                                "LORRYNO":headData["truck_no"],"ac":SB_Ac_Codeaccoid,"mc":headData['mc'],
                                                "Company_Code":headData["company_code"],"Year_Code":headData["Year_Code"],"BROKER":headData['broker'],
                                                "subTotal":new_sale_data['SB_SubTotal'],"LESS_FRT_RATE":new_sale_data['SB_Less_Frt_Rate'],"freight":new_sale_data['SB_freight'],"cash_advance":0,"bank_commission":0,"OTHER_AMT":new_sale_data['SB_Other_Amount'],"Bill_Amount":new_sale_data['TotalGstSaleBillAmount'],
                                                "Due_Days":1,"NETQNTL":headData['quantal'],"Modified_By":headData['Modified_By'],
                                                "GstRateCode":headData['GstRateCode'],"CGSTRate":new_sale_data['cgstrate'],"CGSTAmount":new_sale_data['cgstamt'],"SGSTRate":new_sale_data['sgstrate'],
                                                "SGSTAmount":new_sale_data['sgstamt'],"IGSTRate":new_sale_data['igstrate'],"IGSTAmount":new_sale_data['igstamt'],"EWay_Bill_No":headData['EWay_Bill_No'],"uc":SB_Unit_Codeaccoid,"bk":headData['bk'],
                                                "Purcid":0,"saleidnew":0,
                                                "TCS_Rate":headData['Sale_TCS_Rate'],"TCS_Amt":new_sale_data['SBTCSAmt'],"TCS_Net_Payable":0,"saleidnew":0,
                                                "TDS_Amt":new_sale_data['SBTDSAmt'],"TDS_Rate":headData['PurchaseTDSRate'],"gstid":headData['gstid'],"TaxableAmount":new_sale_data['TaxableAmountForSB'],
                                                "EWayBill_Chk":headData["EWayBillChk"],"MillInvoiceNo":headData["MillInvoiceNo"],"RoundOff":0,
                                                "Transport_Code":headData["transport"],"tc":headData["tc"],"DoNarrtion":headData["narration3"],"newsbno":0,
                                                "einvoiceno":headData["einvoiceno"],"ackno":headData['ackno'],"Delivery_type":headData["Delivery_Type"],
                                                "Bill_To":headData['carporate_ac'],"bt":headData['ca'],"EwayBillValidDate":headData['doc_date'],"IsDeleted":1,
                                                "SBNarration":headData["SBNarration"],"Insured":headData["Insured"],"DO_No":headData['doc_no']


                                        },
                                        
                                    
                        }
                            sale_param={
                                "saleid":headData['saleid']
                            }
                            response = requests.put("http://localhost:8080/api/sugarian/update-SaleBill",  params=sale_param,json=update_SaleBill_entry)

                    if response.status_code == 201:
                        data = response.json()
                        added_detailssb = data.get('addedDetails')
                        doc_nos = next((detail.get('doc_no') for detail in added_detailssb if 'doc_no' in detail), None)
                        saleid=next((detail.get('Saleid') for detail in added_detailssb if 'Saleid' in detail), None)
                        headData["SB_No"]=doc_nos,
                        headData["saleid"]=saleid   
                        db.session.commit()
                    else:
                        db.session.rollback()
                        return jsonify({"error": "Failed to create SaleBill record", "details": response.json()}), response.status_code
       
                     
        else:
            
            update_CommisionBill_entry= {
                        
                               "doc_no":headData["voucher_no"],"commissionid":0,
                                "doc_date":headData["doc_date"],"link_no":updateddoc_no,"link_type":"","link_id":0,
                                "ac_code":headData['SaleBillTo'],"unit_code":headData['GETPASSCODE'],"broker_code":headData['broker'],
                                "qntl":headData['quantal'],"packing":headData["packing"],"bags":headData['bags'],"grade":headData['grade'],
                                "transport_code":headData["transport"],"mill_rate":headData["mill_rate"],"sale_rate":headData['sale_rate'],
                                "purc_rate":headData["PurchaseRate"],"commission_amount":0,"resale_rate":headData["Tender_Commission"],"resale_commission":0,
                                "texable_amount":0,"gst_code":headData["GstRateCode"],"cgst_rate":0,"cgst_amount":0,"sgst_rate":0,"sgst_amount":0,"igst_rate":0,"igst_amount":0,
                                "bill_amount":0,"Company_Code":headData["company_code"],"Year_Code":headData["Year_Code"],"Created_By":headData["Created_By"],
                                "ac":headData["sb"],"uc":headData["gp"],"bc":headData["bk"],"tc":headData["tc"],"mill_code":headData["mill_code"],"mc":headData["mc"],
                                "narration1":"","narration2":"","narration3":"","narration4":"","TCS_Rate":headData["Sale_TCS_Rate"],"TCS_Amt":0,"TCS_Net_Payable":0,
                                "Tran_Type":headData["voucher_type"],"HSN":"","item_code":headData["itemcode"],"ic":headData["ic"],"Frieght_Rate":0,"Frieght_amt":headData["Memo_Advance"],
                                "subtotal":headData["diff_amount"],"IsTDS":headData["TDSCut"],"TDS_Ac":headData["TDSAc"],"TDS_Per":headData["TDSRate"],
                                "TDSAmount":headData["TDSAmt"],"TDS":headData["TDSRate"],"ta":headData["TDSAcId"]
                        
            }
            query_params = {
                            'Company_Code': headData['company_code'],
                            'Year_Code': headData['Year_Code'],
                            'Tran_Type': headData['voucher_type'],
                            'doc_no':headData['voucher_no']
                                        }

            response = requests.put("http://localhost:8080/api/sugarian/update-CommissionBill",params=query_params,json=update_CommisionBill_entry)

            if response.status_code == 201:
                db.session.commit()
            else:
                db.session.rollback()
                return jsonify({"error": "Failed to update CommisionBill record", "details": response.json()}), response.status_code
            


         ####creation of stock entry
        tender_no=headData["purc_no"]
        tender_head = TenderHead.query.filter_by(Tender_No=tender_no).first()
        if not tender_head:
            return jsonify({"error": "Tender not found"}), 404

        tenderid = tender_head.tenderid

        # Generate new ID for the detail entry
        max_detail_id = db.session.query(func.max(TenderDetails.ID)).filter_by(tenderid=tenderid).scalar() or 0
        new_detail_id = max_detail_id + 1

        detail_record = db.session.execute(text("select * from nt_1_tenderdetails where ID=:id and tenderid=:tenderid" ),{'id':1,'tenderid':tenderid})
        
        detail_record = detail_record.fetchall()

        result = [dict(row._mapping) for row in detail_record]

        

        buyer_quantal = result[0].get('Buyer_Quantal')
        selfquantalid=result[0].get('tenderdetailid')
       
        selfstock=float(buyer_quantal)
        SaleQuantal=headData["quantal"]
        TenderStockQty= selfstock-float(SaleQuantal)

       
        
        purcorder=headData["purc_order"]
        if purcorder==1:
            create_TenderStock_entry= {
                "detailData":[{
                            "rowaction":"add","Tender_No":headData["purc_no"],"Buyer":headData['SaleBillTo'],"Buyer_Quantal":headData["quantal"],
                            "Sale_Rate":headData["sale_rate"],"Commission_Rate":headData["Tender_Commission"],"Sauda_Date":headData["doc_date"],
                            "Lifting_Date":headData["doc_date"],"ID":new_detail_id,"Buyer_Party":headData["broker"],"Delivery_Type":headData["Delivery_Type"],
                            "tenderid":tenderid,"buyerid":headData["sb"],"buyerpartyid":headData["bk"],"sub_broker":headData["broker"],
                            "sbr":headData["bk"],"ShipTo":headData["voucher_by"],"shiptoid":headData["vb"],"Company_Code":headData["company_code"],
                            "year_code":headData["Year_Code"]

                },
                {
                            "rowaction":"update","Tender_No":headData["purc_no"],"Buyer_Quantal":TenderStockQty,
                            "ID":1,"tenderid":tenderid,"tenderdetailid":selfquantalid,
                            
                }],
               
        
                }
                
            Stock_query_params = {
                        'tenderid':tenderid,
                        'Tender_No': headData["purc_no"],
                        
                        }

            response = requests.put("http://localhost:8080/api/sugarian/Stock_Entry_tender_purchase",params=Stock_query_params,json=create_TenderStock_entry)
        

            if response.status_code == 200:
                data=response.json()
                
                added_detailssb = data.get('addedDetails')
                
                first_dict = added_detailssb[0]
                tenderdetailid = first_dict['tenderdetailid']
                
                headData['tenderdetailid']=tenderdetailid
                db.session.commit()
                    
            else:
                db.session.rollback()
                return jsonify({"error": "Failed to create Tender record", "details": response.json()}), response.status_code
        
    
        

        return jsonify({
            "message": "Data Inserted successfully",
            "head": updatedHeadCount,
            "addedDetails": task_detail_schemas.dump(createdDetails),
            "updatedDetails": updatedDetails,
            "deletedDetailIds": deletedDetailIds
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Internal server error", "message": str(e)}), 500

#Delete record from datatabse based doid and also delete that record GLeder Effects.  
@app.route(API_URL + "/delete_data_by_doid", methods=["DELETE"])
def delete_data_by_doid():
    doid = request.args.get('doid')
    Company_Code = request.args.get('company_code')
    doc_no = request.args.get('doc_no')
    Year_Code = request.args.get('Year_Code')
    
    if not all([doid, Company_Code, doc_no, Year_Code]):
        return jsonify({"error": "Missing required parameters"}), 400

    try:
        with db.session.begin():
            # Fetch the data to be deleted for logging or confirmation before deleting
            do_head = db.session.query(DeliveryOrderHead).filter_by(doid=doid).one()
            do_detail_count = db.session.query(DeliveryOrderDetail).filter_by(doid=doid).count()
            sale_id=do_head.saleid
            purch_id=do_head.purchaseid
            SaleDocNo=do_head.SB_No
            Purchdocno=do_head.voucher_no
           
            
            # Now perform deletions
            deleted_DOHead_rows = DeliveryOrderHead.query.filter_by(doid=doid).delete()
            deleted_DODetail_rows = DeliveryOrderDetail.query.filter_by(doid=doid).delete()

            if deleted_DOHead_rows > 0 and deleted_DODetail_rows > 0:
                # All internal deletions are successful, now make external API call
                query_params = {
                    'Company_Code': Company_Code,
                    'DOC_NO': doc_no,
                    'Year_Code': Year_Code,
                    'TRAN_TYPE': "DO",
                }
                response = requests.delete("http://localhost:8080/api/sugarian/delete-Record-gLedger", params=query_params)
                
                if response.status_code != 200:
                    # If external request fails, raise an exception to trigger rollback
                    raise Exception("Failed to delete record in gLedger")
                
                ##delete purchase Record
                purchase_param={
                    'Company_Code': Company_Code,
                    'doc_no': Purchdocno,
                    'Year_Code': Year_Code,
                    'purchaseid': purch_id,
                    'tran_type':"PS"

                }
                
                response = requests.delete("http://localhost:8080/api/sugarian/delete_data_SugarPurchase", params=purchase_param)
                
                if response.status_code != 200:
                    # If external request fails, raise an exception to trigger rollback
                    raise Exception("Failed to delete Purchase record in gLedger")
                ##delete purchase Record
                sale_param={
                    'Company_Code': Company_Code,
                    'doc_no': SaleDocNo,
                    'Year_Code': Year_Code,
                    'saleid': sale_id,
                    'Tran_Type':"SB"

                }
                
                response = requests.delete("http://localhost:8080/api/sugarian/delete_data_by_saleid", params=sale_param)

                
                if response.status_code != 200:
                    # If external request fails, raise an exception to trigger rollback
                    raise Exception("Failed to delete SaleBill record in gLedger")


            # If there were no rows to delete, return an appropriate message
            if deleted_DOHead_rows == 0 and deleted_DODetail_rows == 0:
                return jsonify({"message": "No records found to delete"}), 404

        # Successful deletion
        return jsonify({
            "message": f"Deleted {deleted_DOHead_rows} DOHead row(s) and {deleted_DODetail_rows} DODetail row(s) successfully",
            "detailCount": do_detail_count
        }), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "message": str(e)}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Internal server error", "message": str(e)}), 500



#Navigations API    
#Get First record from database 
@app.route(API_URL+"/get-firstDO-navigation", methods=["GET"])
def get_firstDO_navigation():
    try:

        Company_Code = request.args.get('company_code')
        Year_Code = request.args.get('Year_Code')
        if not all([Company_Code, Year_Code]):
            return jsonify({"error": "Missing required parameters"}), 400

        
        # Use SQLAlchemy to get the first record from the Task table
        first_DO = DeliveryOrderHead.query.filter_by(company_code=Company_Code,Year_Code=Year_Code).order_by(DeliveryOrderHead.doid.asc()).first()

        if not first_DO:
            return jsonify({"error": "No records found in Task_Entry table"}), 404

        # Get the Taskid of the first record
        first_doid = first_DO.doid

        additional_data = db.session.execute(text(TASK_DETAILS_QUERY), {"doid": first_doid})

        # Extracting category name from additional_data
        additional_data_rows = additional_data.fetchall()
      
        # Extracting category name from additional_data
        row = additional_data_rows[0] if additional_data_rows else None
       
    
        # Prepare response data
        response = {
            "first_head_data": {
                **{column.name: getattr(first_DO, column.name) for column in first_DO.__table__.columns},
                **format_dates(first_DO),
               
            },
          
             "first_details_data": [{"detail_Id":row.detail_Id,"doid": row.doid, "ddType":row.ddType,"Bank_Code":row.Bank_Code,"bankname":row.bankname,"Narration":row.Narration,
                                          "Amount":row.Amount,"UTR_NO":row.UTR_NO,"UtrYearCode":row.UtrYearCode,"LTNo": row.LTNo,"bc":row.bc,
                                          "utrdetailid":row.utrdetailid,"dodetailid":row.dodetailid,"UtrCompanyCode":row.UtrCompanyCode} for row in additional_data_rows]
     
        }

        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": "Internal server error", "message": str(e)}), 500


#Get last Record from Database
@app.route(API_URL+"/get-lastDO-navigation", methods=["GET"])
def get_lastDO_navigation():
    try:

        Company_Code = request.args.get('company_code')
        Year_Code = request.args.get('Year_Code')
        if not all([Company_Code, Year_Code]):
            return jsonify({"error": "Missing required parameters"}), 400

        # Use SQLAlchemy to get the last record from the Task table
        last_DO = DeliveryOrderHead.query.filter_by(company_code=Company_Code,Year_Code=Year_Code).order_by(DeliveryOrderHead.doid.desc()).first()
        
        if not last_DO:
            return jsonify({"error": "No records found in Task_Entry table"}), 404

        # Get the Taskid of the last record
        last_Doid = last_DO.doid

        # Additional SQL query execution
        additional_data = db.session.execute(text(TASK_DETAILS_QUERY), {"doid": last_Doid})

        # Extracting category name from additional_data
        additional_data_rows = additional_data.fetchall()
        
        # Extracting category name from additional_data
        row = additional_data_rows[0] if additional_data_rows else None
        millname = row.millname if row else None
        salebillname = row.salebillname if row else None
        getpassname = row.getpassname if row else None
        voucherbyname=row.voucherbyname if row else None
        transportname=row.transportname if row else None
        tdsacname=row.tdsacname if row else None
        brokername=row.brokername if row else None
        vasuliacname=row.vasuliacname if row else None
        brandname=row.brandname if row else None
        itemname=row.itemname if row else None
        cashdiffacname=row.cashdiffacname if row else None
        getpassstatename=row.getpassstatename if row else None
        millstatename=row.millstatename if row else None
        vaoucherbystatename=row.vaoucherbystatename if row else None
        salebilltostatename=row.salebilltostatename if row else None
        transportstatename=row.transportstatename if row else None
        itemname=row.itemname if row else None
        DOName=row.DOName if row else None
        memorategst=row.DOName if row else None
        gstratename=row.gstratename if row else None

        # Prepare response data
        response = {
            "last_head_data": {
                **{column.name: getattr(last_DO, column.name) for column in last_DO.__table__.columns},
                **format_dates(last_DO), 
                "millname":millname,
                "salebillname":salebillname,
                "voucherbyname":voucherbyname,
                "transportname":transportname,
                "getpassname":getpassname, 
                "tdsacname":tdsacname,
                "brokername":brokername,
                "vasuliacname":vasuliacname,
                "brandname":brandname,
                "itemname":itemname,
                "cashdiffacname":cashdiffacname,
                "getpassstatename":getpassstatename, 
                "millstatename":millstatename, 
                "vaoucherbystatename":vaoucherbystatename,
                "salebilltostatename":salebilltostatename, 
                "transportstatename":transportstatename, 
                "itemname":itemname, 
                "DOName":DOName, 
                "memorategst":memorategst,
                "gstratename":gstratename


                
            },
            "last_details_data": [{"detail_Id":row.detail_Id,"doid": row.doid, "ddType":row.ddType,"Bank_Code":row.Bank_Code,"bankname":row.bankname,"Narration":row.Narration,
                                          "Amount":row.Amount,"UTR_NO":row.UTR_NO,"UtrYearCode":row.UtrYearCode,"LTNo": row.LTNo,"bc":row.bc,
                                          "utrdetailid":row.utrdetailid,"dodetailid":row.dodetailid,"UtrCompanyCode":row.UtrCompanyCode} for row in additional_data_rows]
     
        }

        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": "Internal server error", "message": str(e)}), 500
    
#Get Previous record by database 
@app.route(API_URL+"/get-previousDO-navigation", methods=["GET"])
def get_previousDO_navigation():
    try:
       
        current_doc_no = request.args.get('currentDocNo')
        Company_Code = request.args.get('company_code')
        Year_Code = request.args.get('Year_Code')
        if not all([Company_Code, Year_Code, current_doc_no]):
            return jsonify({"error": "Missing required parameters"}), 400


        # Use SQLAlchemy to get the previous record from the Task table
        previous_DO = DeliveryOrderHead.query.filter(DeliveryOrderHead.doc_no < current_doc_no).filter_by(company_code=Company_Code,Year_Code=Year_Code).order_by(DeliveryOrderHead.doc_no.desc()).first()
    
        
        if not previous_DO:
            return jsonify({"error": "No previous records found"}), 404

        # Get the Task_No of the previous record
        previous_do_id = previous_DO.doid
        
        # Additional SQL query execution
        additional_data = db.session.execute(text(TASK_DETAILS_QUERY), {"doid": previous_do_id})
        
        # Fetch all rows from additional data
        additional_data_rows = additional_data.fetchall()
        
        # Extracting category name from additional_data
        row = additional_data_rows[0] if additional_data_rows else None
        

        # Prepare response data
        response = {
            "previous_head_data": {
                **{column.name: getattr(previous_DO, column.name) for column in previous_DO.__table__.columns}, 
                 **format_dates(previous_DO),
               
            },
               "previous_details_data": [{"detail_Id":row.detail_Id,"doid": row.doid, "ddType":row.ddType,"Bank_Code":row.Bank_Code,"bankname":row.bankname,"Narration":row.Narration,
                                          "Amount":row.Amount,"UTR_NO":row.UTR_NO,"UtrYearCode":row.UtrYearCode,"LTNo": row.LTNo,"bc":row.bc,
                                          "utrdetailid":row.utrdetailid,"dodetailid":row.dodetailid,"UtrCompanyCode":row.UtrCompanyCode} for row in additional_data_rows]
     
        }

        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": "Internal server error", "message": str(e)}), 500
    
#Get Next record by database 
@app.route(API_URL+"/get-nextDO-navigation", methods=["GET"])
def get_nextDO_navigation():
    try:
        current_doc_no = request.args.get('currentDocNo')
        Company_Code = request.args.get('company_code')
        Year_Code = request.args.get('Year_Code')
        if not all([Company_Code, Year_Code, current_doc_no]):
            return jsonify({"error": "Missing required parameters"}), 400

        
        

        # Use SQLAlchemy to get the next record from the Task table
        next_DO = DeliveryOrderHead.query.filter(DeliveryOrderHead.doc_no > current_doc_no).filter_by(company_code=Company_Code,Year_Code=Year_Code).order_by(DeliveryOrderHead.doc_no.asc()).first()

        if not next_DO:
            return jsonify({"error": "No next records found"}), 404

        # Get the Task_No of the next record
        next_DO_id = next_DO.doid

        # Query to fetch System_Name_E from nt_1_systemmaster
        additional_data = db.session.execute(text(TASK_DETAILS_QUERY), {"doid": next_DO_id})
        
        # Fetch all rows from additional data
        additional_data_rows = additional_data.fetchall()
        
        # Extracting category name from additional_data
        row = additional_data_rows[0] if additional_data_rows else None
        
        # Prepare response data
        response = {
            "next_head_data": {
                **{column.name: getattr(next_DO, column.name) for column in next_DO.__table__.columns},
                **format_dates(next_DO),
               
            },
                "next_details_data": [{"detail_Id":row.detail_Id,"doid": row.doid, "ddType":row.ddType,"Bank_Code":row.Bank_Code,"bankname":row.bankname,"Narration":row.Narration,
                                          "Amount":row.Amount,"UTR_NO":row.UTR_NO,"UtrYearCode":row.UtrYearCode,"LTNo": row.LTNo,"bc":row.bc,
                                          "utrdetailid":row.utrdetailid,"dodetailid":row.dodetailid,"UtrCompanyCode":row.UtrCompanyCode} for row in additional_data_rows]
     
        }
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": "Internal server error", "message": str(e)}), 500