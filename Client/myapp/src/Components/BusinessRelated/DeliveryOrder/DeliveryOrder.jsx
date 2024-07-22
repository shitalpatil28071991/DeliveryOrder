import React from "react";
import { useEffect, useState, useRef } from "react";
import ActionButtonGroup from "../../../Common/CommonButtons/ActionButtonGroup";
import NavigationButtons from "../../../Common/CommonButtons/NavigationButtons";
import SystemHelpMaster from "../../../Helper/SystemmasterHelp";
import GSTStateMasterHelp from "../../../Helper/GSTStateMasterHelp";
import PurcnoHelp from "../../../Helper/PurcnoHelp";
import CarporateHelp from "../../../Helper/CarporateHelp";
import "./DeliveryOrder.css";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AccountMasterHelp from "../../../Helper/AccountMasterHelp";
import GSTRateMasterHelp from "../../../Helper/GSTRateMasterHelp";
import { HashLoader } from 'react-spinners';
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";


const companyCode = sessionStorage.getItem('Company_Code')
const Year_Code = sessionStorage.getItem('Year_Code')
const API_URL = process.env.REACT_APP_API;
const CompanyparametrselfAc=sessionStorage.getItem('SELF_AC')
const CompanyparametrselfAcid=sessionStorage.getItem('Self_acid')




const DeliveryOrderSchema = z.object({
   
  });
var lblmillname
var newmill_code
var lblDoname
var newDO
var lblvoucherByname
var newvoucher_by
var lblbrokername
var newbroker
var lbltransportname
var newtransport
var lblvasuliacname
var newvasuli
var lblgetpasscodename
var newGETPASSCODE
var lblsalebilltoname
var newSaleBillTo
var lblvasuliacname
var newVasuli_Ac
var lblgstratename
var newGstRateCode
var lblgetpassstatename
var newGetpassGstStateCode
var lblvoucherBystatename
var newVoucherbyGstStateCode
var lblBilltostatename
var newSalebilltoGstStateCode
var lblmillstatename
var newMillGSTStateCode
var lbltransportstatename
var newTransportGSTStateCode
var lblitemname
var newitemcode
var lblcarporateacname
var newcarporate_ac
var lblbrandname
var newbrandcode
var lblcashdiffacname
var newCashDiffAc
var lbltdsacname
var newTDSAc
var newMemoGSTRate
var lblMemoGSTRatename
var ItemName = ""
var ItemCodeNew = ""
var lblbankname=""
var bankcodenew=""
var newDcid=""
var newPurcno
var lblTenderid
var newpurcoder
var TenderDetailsData = ""
var newcarporateno
const DeliveryOrder = () => {
    const [updateButtonClicked, setUpdateButtonClicked] = useState(false);
    const [saveButtonClicked, setSaveButtonClicked] = useState(false);
    const [addOneButtonEnabled, setAddOneButtonEnabled] = useState(false);
    const [saveButtonEnabled, setSaveButtonEnabled] = useState(true);
    const [cancelButtonEnabled, setCancelButtonEnabled] = useState(true);
    const [editButtonEnabled, setEditButtonEnabled] = useState(false);
    const [deleteButtonEnabled, setDeleteButtonEnabled] = useState(false);
    const [backButtonEnabled, setBackButtonEnabled] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [highlightedButton, setHighlightedButton] = useState(null);
    const [cancelButtonClicked, setCancelButtonClicked] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [lastTenderDetails, setLastTenderDetails] = useState([]);
    const [lastTenderData, setLastTenderData] = useState({});
    const companyCode = sessionStorage.getItem('Company_Code')
    const [accountCode, setAccountCode] = useState("");
    const [gstCode, setGstCode] = useState("");
    const [gstRate, setGstRate] = useState("");
    const [getpassstatecode, setgetpassstatecode] = useState("");
    const [getpassstatecodename, setgetpassstatecodename] = useState("");
    const [voucherbystatename, setvoucherbystatename] = useState("");
    const [voucherbystatecode, setvoucherbystatecode] = useState("");
    const [millstatecode, setmillstatecode] = useState("");
    const [millstatename, setmillstatename] = useState("");
    const [salebilltostatecode, setsalebilltostatecode] = useState("");
    const [salebilltostatename, setsalebilltostatename] = useState("");
    const [transportstatecode, settransportstatecode] = useState("");
    const [stransportstatename, settransportstatename] = useState("");
    const [itemSelect, setItemSelect] = useState("");
    const [itemSelectAccoid, setItemSelectAccoid] = useState("");
    const [itemSelectname, setItemSelectname] = useState("");
    const [brandCode, setBrandCode] = useState("");
    const [brandCodeAccoid, setBrandCodeAccoid] = useState("");
    const [millcode, setmillcode] = useState("");
    const [millcodeacid, setmillcodeacid] = useState("");
    const [millcodename, setmillcodename] = useState("");
    const [getpasscode, setgetpasscode] = useState("");
    const [getpasscodeacid, setgetpasscodeacid] = useState("");
    const [getpasscodename, setgetpasscodename] = useState("");
    const [voucherbycode, setvoucherbycode] = useState("");
    const [voucherbycodeacid, setvoucherbycodeeacid] = useState("");
    const [voucherbycodename, setvoucherbycodename] = useState("");
    const [salebilltocode, setsalebilltocode] = useState("");
    const [salebilltocodeacid, setsalebilltocodeacid] = useState("");
    const [salebilltocodename, setsalebilltocodename] = useState("");
    const [transportcode, settransportcode] = useState("");
    const [transportcodeacid, settransportcodeacid] = useState("");
    const [transportcodename, settransportcodename] = useState("");
    const [brokercode, setbrokercode] = useState("");
    const [brokercodeacid, setbrokercodeacid] = useState("");
    const [brokercodename, setbrokercodename] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [bankcode, setbankcode] = useState("");
    const [bankcodeacoid, setbankcodeacid] = useState("");
    const [bankcodeacname, setbankcodeacname] = useState("");
    const [DOcode, setDOcode] = useState("");
    const [DOcodeacoid, setDOcodeacid] = useState("");
    const [DOcodeacname, setDOcodeacname] = useState("");
    const [TDSACcode, setTDSACcode] = useState("");
    const [TDSACcodeacoid, setTDSACcodeacid] = useState("");
    const [TDSACcodeacname, setTDSACcodeacname] = useState("");
    const [vasuliaccode, setvasuliaccode] = useState("");
    const [Tvasuliaccodeacoid, setvasuliaccodeacid] = useState("");
    const [vasuliaccodeacname, setvasuliaccodeacname] = useState("");
    const [BPaccode, setBPaccode] = useState("");
    const [BPaccodeacoid, setBPaccodeacid] = useState("");
    const [BPaccodeacname, setBPaccodeacname] = useState("");
    const [Tenderno, setTenderno] = useState("");
    const [Tenderid, setTenderid] = useState("");
    const [Carporateno, setCarporateno] = useState("");
    const navigate = useNavigate();
    const [selectedUser, setSelectedUser] = useState({});
    const [deleteMode, setDeleteMode] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [users, setUsers] = useState([]);
    const [tenderDetails, setTenderDetails] = useState({});
    const [detailRecords, setDetailRecords] = useState([]);
    const [Gst_Rate, setGstRatecode] = useState(0.0);
    const [matchStatus, setMatchStatus] = useState(null);
    const [GSTMemoGstcode, setGSTMemoGstcode] = useState("");
    const [GSTMemoGstrate, setGSTMemoGstrate] = useState("");
    const [pdspartystatecode, setpdspartystatecode] = useState("");
    const [pdsBilltostatecode, setpdsBilltostatecode] = useState("");
    const [PDSType, setPDSType] = useState("");
    const [PDSParty, setPDSParty] = useState("");
    const [PDSUnit, setPDSUnit] = useState("");
    const [CarporateState, setCarporateState] = useState({});
    const [ChangeData, setChangeData] = useState({ true: true });

    
    const [formDataDetail, setFormDataDetail] = useState({
        ddType: "T",
        Narration: "",
        Amount: 0.00,
        UTR_NO: "",
        UtrYearCode: "",
        detail_Id: 1
        

    });
    
    
    //In utility page record doubleClicked that recod show for edit functionality
    const location = useLocation();
    const selectedRecord = location.state?.selectedRecord;
    const initialFormData = {
        tran_type: 'DO',
        doc_no: '',
        desp_type: 'DO',
        doc_date: new Date().toISOString().split("T")[0],
        mill_code: 0,
        grade: '',
        quantal: 0.00,
        packing: 50,
        bags: 0,
        mill_rate: 0.00,
        sale_rate: 0.00,
        Tender_Commission: 0.00,
        diff_rate: 0.00,
        diff_amount: 0.00,
        amount: 0.00,
        DO: 0,
        voucher_by: 0,
        broker: 0,
        company_code: companyCode,
        Year_Code: Year_Code,
        Branch_Code: 0,
        purc_no: 0,
        purc: 0,
        purc_order: 0,
        purc_type: '',
        truck_no: '',
        transport: 0,
        less: 0.00,
        less_amount: 0.00,
        final_amout: 0.00,
        vasuli: 0.00,
        narration1: '',
        narration2: '',
        narration3: '',
        narration4: '',
        narration5: '',
        excise_rate: 0.00,
        memo_no: 0,
        freight: 0.00,
        adv_freight1: 0.00,
        driver_no: '',
        driver_Name: '',
        voucher_no: '',
        voucher_type: '',
        GETPASSCODE: 0,
        tender_Remark: '',
        vasuli_rate: 0.00,
        vasuli_amount: 0.00,
        to_vasuli: 0,
        naka_delivery: '',
        send_sms: '',
        Itag: '',
        Ac_Code: 0,
        FreightPerQtl: 0.00,
        Freight_Amount: 0.00,
        Freight_RateMM: 0.00,
        Freight_AmountMM: 0.00,
      
        Paid_Rate1: 0.00,
        Paid_Amount1: 0.00,
        Paid_Narration1: '',
        Paid_Rate2: 0.00,
        Paid_Amount2: 0.00,
        Paid_Narration2: '',
        Paid_Rate3: 0.00,
        Paid_Amount3: 0.00,
        Paid_Narration3: '',
        MobileNo: '',
        Created_By: '',
        Modified_By: '',
        UTR_No: 0,
        UTR_Year_Code: 0,
        Carporate_Sale_No: 0,
        Carporate_Sale_Year_Code: 0,
        Delivery_Type: '',
        WhoseFrieght: '',
        SB_No: 0,
        Invoice_No: '',
        vasuli_rate1: 0.00,
        vasuli_amount1: 0.00,
        Party_Commission_Rate: 0.00,
        MM_CC: '',
        MM_Rate: 0.00,
        Memo_Advance:0.00,
        Voucher_Brokrage: 0.00,
        Voucher_Service_Charge: 0.00,
        Voucher_RateDiffRate: 0.00,
        Voucher_RateDiffAmt: 0.00,
        Voucher_BankCommRate: 0.00,
        Voucher_BankCommAmt: 0.00,
        Voucher_Interest: 0.00,
        Voucher_TransportAmt: 0.00,
        Voucher_OtherExpenses: 0.00,
        CheckPost: '',
        SaleBillTo: 0,
        Pan_No: '',
        Vasuli_Ac: 0,
        LoadingSms: '',
        GstRateCode: 0,
        GetpassGstStateCode: 0,
        VoucherbyGstStateCode: 0,
        SalebilltoGstStateCode: 0.00,
        GstAmtOnMR: 0.00,
        GstAmtOnSR: 0.00,
        GstExlSR: 0.00,
        GstExlMR: 0.00,
        MillGSTStateCode: 0,
        TransportGSTStateCode: 0,
        EWay_Bill_No: '',
        Distance: 0.00,
        EWayBillChk: '',
        MillInvoiceNo: '',
        Purchase_Date: new Date().toISOString().split("T")[0],
        
        mc: 0,
        gp: 0,
        st: 0,
        sb: 0,
        tc: 0,
        itemcode: 0,
        cs: 0,
        ic: 0,
        tenderdetailid: 0,
        bk: 0,
        docd: 0,
        vb: 0,
        va: 0,
        carporate_ac: 0,
        ca: 0,
        mill_inv_date: new Date().toISOString().split("T")[0],
        mill_rcv: '',
        saleid: 0,
        MillEwayBill: '',
        TCS_Rate: 0.000,
        Sale_TCS_Rate: 0.000,
        Mill_AmtWO_TCS: 0.00,
        doidnew: 0,
        newsbno: 0,
        newsbdate: new Date().toISOString().split("T")[0],
        einvoiceno: '',
        ackno: '',
        commisionid: 0,
        brandcode: 0,
        Cash_diff: 0.00,
        CashDiffAc: '',
        TDSAc: 0,
        CashDiffAcId: 0,
        TDSAcId: 0,
        TDSRate: 0.00,
        TDSAmt: 0.00,
        TDSCut: '',
        tenderid: 0,
        MemoGSTRate: 0,
        RCMCGSTAmt: 0.00,
        RCMSGSTAmt: 0.00,
        RCMIGSTAmt: 0.00,
        RCMNumber: 0.00,
        EwayBillValidDate: new Date().toISOString().split("T")[0],
        SaleTDSRate: 0.000,
        PurchaseTDSRate: 0.000,
        PurchaseRate: 0.00,
        SBNarration: '',
        MailSend: '',
        ISEInvoice: '',
        IsPayment: '',
        Do_DATE: new Date().toISOString().split("T")[0],
        Insured: '',
        vehicle_reached: '',
        reached_date: new Date().toISOString().split("T")[0],
        Insurance: 0.00,
        ic1: 0,
        grade1: '',
        quantal1: 0.00,
        packing1: 0,
        bags1: 0,
        mill_rate1: 0.00,
        sale_rate1: 0.00,
        purc_no1: 0,
        purc_order1: 0,
        itemcode1: 0,
        PurchaseRate1: 0.00,
        mill_amount1: 0.00,
        mill_amountTCS1: 0.00,
        tenderdetailid1: 0,
        GT_Remark: '',
        SB_Other_Amount: 0.00,
        LockRecord: '',
        LockedUser: '',
        gstid: 0,
        purchaseid: 0,
       
        
      
        
}

const handlemill_code =(code,accoid,name) =>{
   setmillcode(code);
   setmillcodeacid(accoid);
   setmillcodename(name)
    setFormData({
      ...formData,
      mill_code: code,
      mc:accoid,
    });

}

const handlePurcno =(Tenderno,Tenderid) =>{
    setTenderno(Tenderno);
    setTenderid(Tenderid);

    const Dispatch_type = tenderDetails.DT === "D" ? formData.desp_type === "DO" : "DI"
    
     setFormData({
       ...formData,
       desp_type:Dispatch_type,
       purc_no: Tenderno,
       purc_order:Tenderid,
     });
 
 }
 const handleCarporate=(Carporateno) =>{
    setCarporateno(Carporateno);
    
     setFormData({
       ...formData,
      Carporate_Sale_No:Carporateno,
     });
 
 }

const handleDO =(code,accoid,name) =>{
   setDOcode(code);
   setDOcodeacid(accoid);
   setDOcodeacname(name)
    setFormData({
      ...formData,
      DO: code,
      docd:accoid
    });

}
const handleMemoGSTRate =(code,rate) =>{
    setGSTMemoGstcode(code);
    setGSTMemoGstrate(rate);

     setFormData({
       ...formData,
       DO: code,
     });
 
 }
const handlevoucher_by =(code,accoid,name) =>{
   setvoucherbycode(code);
   setvoucherbycodeeacid(accoid);
   setvoucherbycodename(name);
    setFormData({
      ...formData,
      voucher_by: code,
      vb:accoid,
    });

}
const handlebroker =(code,accoid,name) =>{
   setbrokercode(code);
   setbrokercodeacid(accoid);
   setbrokercodename(name)
    setFormData({
      ...formData,
      broker: code,
      bk:accoid,
    });
    console.log(formData.broker)

}
const handletransport =(code,accoid,name) =>{
    debugger
   settransportcode(code);
   //settransportcodeacid(accoid),
   settransportcodename(name);
   settransportcodeacid(accoid)
   console.log(code)
    setFormData({
      ...formData,
      transport: code,
      tc:accoid,
    });
    console.log(formData.transport)

}

const handleGETPASSCODE =(code,accoid,name) =>{
   setgetpasscode(code);
   setgetpasscodeacid(accoid)
   setgetpasscodename(name)
    setFormData({
      ...formData,
      GETPASSCODE: code,
      gp:accoid,
    });

}
const handleSaleBillTo =(code,accoid,name) =>{
   setsalebilltocode(code);
   setsalebilltocodeacid(accoid);
   setsalebilltocodename(name);
    setFormData({
      ...formData,
      SaleBillTo: code,
      sb:accoid
    });

}
const handleVasuli_Ac =(code,accoid,name) =>{
   setvasuliaccode(code);
   setvasuliaccodeacid(accoid);
   setvasuliaccodeacname(name)
    setFormData({
      ...formData,
      Vasuli_Ac: code,
      va:accoid,
    });

}
const handleGstRateCode =(code,rate) =>{
   setGstCode(code);
   setGstRatecode(rate);
    setFormData({
      ...formData,
      GstRateCode: code,
    });
}
const handleGetpassGstStateCode =(code,name) =>{
   setgetpassstatecode(code);
   setgetpassstatecodename(name)
    setFormData({
      ...formData,
      GetpassGstStateCode: code,
      
    });

}
const handleVoucherbyGstStateCode =(code,name) =>{
   setvoucherbystatecode(code);
   setvoucherbystatename(name)
    setFormData({
      ...formData,
      VoucherbyGstStateCode: code,
    });

}
const handleSalebilltoGstStateCode =(code,name) =>{
   setsalebilltostatecode(code);
   setsalebilltostatename(name)
    setFormData({
      ...formData,
      SalebilltoGstStateCode: code,
    });

}
const handleMillGSTStateCode =(code,name) =>{
   setmillstatecode(code);
   setmillstatename(name);
    setFormData({
      ...formData,
      MillGSTStateCode: code,
    });

}
const handleTransportGSTStateCode =(code,name) =>{
   settransportstatecode(code);
   settransportstatename(name);
    setFormData({
      ...formData,
      TransportGSTStateCode: code,
    });

}

const handlebrandcode =(code,accoid) =>{
   setBrandCode(code);
   setBrandCodeAccoid(accoid);
    setFormData({
      ...formData,
      brandcode: code,
    });

}
const handleCashDiffAc =(code,accoid,name) =>{
   setBPaccode(code);
   setBPaccodeacid(accoid);
   setBPaccodeacname(name)
    setFormData({
      ...formData,
      CashDiffAc: code,
      CashDiffAcId:accoid,
    });

}
const handleTDSAc =(code,accoid,name) =>{
   setTDSACcode(code);
   setTDSACcodeacid(accoid);
   setTDSACcodeacname(name)
    setFormData({
      ...formData,
      TDSAc: code,
      TDSAcId:accoid,
    });

}
const handleItemSelect = (code, accoid,name) => {
    setItemSelect(code);
    setItemSelectAccoid(accoid);
    setItemSelectname(name)
    setFormData({
        ...formData,
        itemcode: code,
        ic:accoid,
      });
    // setHSNNo(HSN)
};
const handleBankCode =(code,accoid,name) =>{
    debugger;
    setbankcode(code);
    setbankcodeacid(accoid);
    setbankcodeacname(name);
    // setFormDataDetail({
    //     ...formDataDetail,
    //     Bank_Code: code,
    //     bc:accoid,
    //   });
 }


    const [formData, setFormData] = useState(initialFormData);

    const handleCarporateDetailsFetched = (details) => {
        debugger;
        console.log(details.last_Carporate_data[0])
        setCarporateno(details.last_Carporate_data[0])
        //console.log("")
        let SellingType = details.last_Carporate_data[0].SellingType;
        if (SellingType === "C") {
           newGETPASSCODE = CompanyparametrselfAc;  // Assuming CompanyparametrselfAc is defined somewhere
           //lblgetpasscodename=details.last_Carporate_data[0].compa 
           // formData.gp = CompanyparametrselfAcid;          // Assuming CompanyparametrselfAcid is defined somewhere
            //newvoucher_by = details.last_Carporate_data[0].Unit_Code;

            // Add more fields as needed
        }
        
            const newData = {
                
                quantal: details.last_Carporate_data[0].balance,
                PDSType:details.last_Carporate_data[0].SellingType,
                PDSParty: details.last_Carporate_data[0].Ac_Code,
                PDSUnit:details.last_Carporate_data[0].Unitcode,
                SaleBillTo:details.last_Carporate_data[0].Ac_Code,
                narration4:details.last_Carporate_data[0].partyName,
                voucher_by:details.last_Carporate_data[0].Unitcode,
                vb:details.last_Carporate_data[0].Unitid,
                broker:details.last_Carporate_data[0].BrokerCode,
                bk:details.last_Carporate_data[0].br,
                sale_rate:details.last_Carporate_data[0].Sale_Rate,
                Delivery_Type:details.last_Carporate_data[0].DeliveryType,
            }
        
            setChangeData(newData)
            return newData;
    }
    const handleTenderDetailsFetched = (details) => {
        debugger
        console.log(details.last_details_data[0])
        setTenderDetails(details.last_details_data[0])
        let Carporate_Sale_No=formData.Carporate_Sale_No;
        //console.log("")
        if(Carporate_Sale_No!=0)
        {
           
                const newData = {
            
                        packing: details.last_details_data[0].Packing,
                        bags: details.last_details_data[0].Bags,
                        grade: details.last_details_data[0].Grade,
                        excise_rate: details.last_details_data[0].Excise_Rate,
                        mill_rate: details.last_details_data[0].Mill_Rate,
                        Tender_Commission: details.last_details_data[0].Commission_Rate,
                       
                        narration4: details.last_details_data[0].buyername,
                        tenderdetailid: details.last_details_data[0].tenderdetailid,
                        PurchaseRate:details.last_details_data[0].Party_Bill_Rate,                        
                        ic: details.last_details_data[0].ic,
                        CashDiffAcId: details.last_details_data[0].buyerid,
                        docd: details.last_details_data[0].td,
                        itemcode: details.last_details_data[0].itemcode,
                        GstRateCode: details.last_details_data[0].gstratecode,
                }
                setChangeData(newData);
                console.log(ChangeData);
                return newData;
         

                
        }
        if(Carporate_Sale_No==="")
        {
                        
                        const newData = {
                        
                        quantal: details.last_details_data[0].Quantal,
                        packing: details.last_details_data[0].Packing,
                        bags: details.last_details_data[0].Bags,
                        grade: details.last_details_data[0].Grade,
                        excise_rate: details.last_details_data[0].Excise_Rate,
                        mill_rate: details.last_details_data[0].Mill_Rate,
                        Tender_Commission: details.last_details_data[0].Commission_Rate,
                        sale_rate: details.last_details_data[0].Sale_Rate,
                        narration4: details.last_details_data[0].buyername,
                        tenderdetailid: details.last_details_data[0].tenderdetailid,
                        PurchaseRate:details.last_details_data[0].Party_Bill_Rate,
                        Delivery_Type: details.last_details_data[0].DT,
                        sb: details.last_details_data[0].buyerid,
                        gp: details.last_details_data[0].buyerid,
                        ic: details.last_details_data[0].ic,
                        bk: details.last_details_data[0].buyerpartyid,
                        vb: details.last_details_data[0].buyerid,
                        CashDiffAcId: details.last_details_data[0].buyerid,
                        docd: details.last_details_data[0].td,
                        SaleBillTo: details.last_details_data[0].Buyer,
                        GETPASSCODE: details.last_details_data[0].Buyer,
                        voucher_by: details.last_details_data[0].Buyer,
                        DO: details.last_details_data[0].Tender_DO,
                        CashDiffAc:details.last_details_data[0].Buyer,
                        DO: details.last_details_data[0].Tender_DO,
                        itemcode: details.last_details_data[0].itemcode,
                        GstRateCode: details.last_details_data[0].gstratecode,
                        broker: details.last_details_data[0].Buyer,
                        SalebilltoGstStateCode: details.last_details_data[0].Buyer,
                        VoucherbyGstStateCode: details.last_details_data[0].Buyer,
                        GetpassGstStateCode: details.last_details_data[0].Buyer,

                        
                    };
                    
                    setChangeData(newData)
                    console.log('New data being set:', newData);
                    return newData;
                
                
        }
        setFormData(ChangeData);
        console.log('ChangeData', ChangeData);
        //Calulate millamount
        const Calculatemillamount = (PurchaseRate, excise_rate, quantal) => {
            const purcRate = parseFloat(PurchaseRate) || 0;
            const exciseRate = parseFloat(excise_rate) || 0;
            const qtl = parseFloat(quantal) || 0;
            const rate = qtl !== 0 ? (purcRate + exciseRate) : 0;
            const millamount = qtl * rate;
            console.log(millamount)
            return  millamount;
          };

          
        setFormDataDetail(prevData => {
            const newDetailData = {
                ...prevData,
                ddType:"T",
                Narration:"Transfer Letter",
                Amount:Calculatemillamount(tenderDetails.Party_Bill_Rate,tenderDetails.Excise_Rate,tenderDetails.Quantal),
                detail_Id:1,
                Bank_Code : tenderDetails.Payment_To,
                bc: tenderDetails.pt,
               
                "rowaction":"add"
                

            }
            setUsers([newDetailData])
            
            console.log('New data being set to details:', newDetailData);
            
            return newDetailData

        
    });

}

const checkMatchStatus = async (ac_code, company_code, year_code) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/get_match_status`,
        {
          params: {
            Ac_Code: ac_code,
            Company_Code: company_code,
            Year_Code: year_code,
          },
        }
      );
      return data.match_status;
    } catch (error) {
      toast.error("Error checking GST State Code match.");
      console.error("Couldn't able to match GST State Code:", error);
      return error;
    }
  };

//calculating memo gstamount
const calculatememogstrateamount = async (
    name,
    input,
    formData,
    GSTMemoGstrate,
    matchStatus
  ) => {
   
    const updatedFormData = { ...formData, [name]: input };
    const RCMCGSTAmt=parseFloat(updatedFormData.MM_Rate) || 0.0;
    const RCMSGSTAmt=parseFloat(updatedFormData.MM_Rate) || 0.0;
    const RCMIGSTAmt=parseFloat(updatedFormData.MM_Rate) || 0.0;
    let rate= parseFloat(GSTMemoGstrate) || 0.00;
    debugger;
    let cgstrate=0.00;
    let sgstrate=0.00;
    let igstrate=0.00;
    if (matchStatus === "TRUE") {
        cgstrate=(rate / 2).toFixed(2);
        sgstrate=(rate / 2).toFixed(2);
        igstrate=0.00;
       
      updatedFormData.RCMCGSTAmt = (
        (updatedFormData.Memo_Advance * cgstrate) /
        100
      ).toFixed(2);

      updatedFormData.RCMSGSTAmt = (
        (updatedFormData.Memo_Advance * sgstrate) /
        100
      ).toFixed(2);
      updatedFormData.RCMIGSTAmt = 0.0;

    }
    else{
        cgstrate=0.00;
        sgstrate=0.00;
        igstrate=(rate).toFixed(2);

        updatedFormData.RCMIGSTAmt = (
            (updatedFormData.Memo_Advance * igstrate) /
            100
          ).toFixed(2);

          updatedFormData.RCMCGSTAmt = 0.0;
          updatedFormData.RCMSGSTAmt = 0.0;
    
    }
    
    
   return updatedFormData;



  }

//Creating Commison Bill entry

const CommisionBillCalculation = async (name, input, formData, gstRate) => {
    // Clone formData and initialize additional fields
    let formdata={
        ...formData,
       

    }
    let updatedFormData = { ...formdata, [name]: input };
    
    let GSTRate = gstRate
    let igstrate = (GSTRate / 2).toFixed(2);
    let sgstrate = (GSTRate / 2).toFixed(2);
    let cgstrate = (GSTRate / 2).toFixed(2);
    let DIFF_AMOUNT=parseFloat(updatedFormData.DIFF_AMOUNT);
    let MEMO_ADVANCE=parseFloat(updatedFormData.MEMO_ADVANCE);
    let taxableamount = DIFF_AMOUNT + MEMO_ADVANCE;
    let DiffMemo = DIFF_AMOUNT + MEMO_ADVANCE;
    let salebillto=updatedFormData.SaleBillTo;
    const matchStatus = await checkMatchStatus(salebillto, companyCode, Year_Code);
    let LV_CGSTAmount=0.00;
    let LV_SGSTAmount=0.00;
    let LV_IGSTAmount=0.00;
    let LV_TotalAmount=0.00;
    let LV_TCSRate=0.00;
    let LV_NETPayble=0.00;
    let LV_TCSAmt=0.00;
    let LV_TDSRate=0.00;
    let LV_TDSAmt=0.00;


   
     
    if (DiffMemo != 0) {
        
        if (matchStatus == "TRUE") {
            LV_CGSTAmount = Math.round(parseFloat(((DIFF_AMOUNT + MEMO_ADVANCE) * cgstrate) / 100));
            LV_SGSTAmount = Math.round(parseFloat(((DIFF_AMOUNT + MEMO_ADVANCE) * sgstrate) / 100));
            // lvcgstrate = cgstrate;
            // lvsgstrate = sgstrate;
            // lvigstrate = 0.00;
            igstrate=0.00;
            LV_IGSTAmount = 0;
        }
        else {
            LV_IGSTAmount = Math.round(parseFloat(((DIFF_AMOUNT + MEMO_ADVANCE) * igstrate) / 100));
            cgstrate = 0;
            sgstrate = 0;
          
            LV_SGSTAmount = 0.00;
            LV_CGSTAmount = 0.00;
        }

    }
    
    

    LV_TotalAmount = Math.round(parseFloat((DIFF_AMOUNT + MEMO_ADVANCE) + LV_CGSTAmount + LV_SGSTAmount + LV_IGSTAmount));
    LV_TCSRate = parseFloat(updatedFormData.Sale_TCS_Rate)|| 0;
    // LV_TCSAmt = Math.Round(((Bill_Amt * TCS_Rate) / 100), 2);
    LV_TCSAmt = Math.round(parseFloat((LV_TotalAmount * LV_TCSRate) / 100));
    LV_NETPayble = Math.round(parseFloat((LV_TotalAmount + LV_TCSAmt)));
    LV_TDSRate = parseFloat(updatedFormData.SaleTDSRate)|| 0.00;
    LV_TDSAmt = parseFloat((LV_TotalAmount * LV_TDSRate) / 100);
    LV_NETPayble = LV_NETPayble;


}

const PurchaseBillCalculation = async (name, input, formData, gstRate) => {
    // Clone formData and initialize additional fields
    let updatedFormData = { ...formData, [name]: input };
        formData= {
        ...formData,
        PS_CGSTAmount: 0.00,
        PS_SGSTAmount: 0.00,
        PS_IGSTAmount: 0.00,
        PS_CGSTRATE: 0.00,
        PS_SGSTRATE: 0.00,
        PS_IGSTRATE: 0.00,
        TOTALPurchase_Amount: 0.00,
        PSTCS_Amt: 0.00,
        PSTDS_Amt: 0.00,
        PSNetPayble: 0.00,
        PS_SelfBal: 0.00,
        PS_amount: 0.00
    };
    debugger;
    // Extract relevant variables from formData
    let rate=gstRate;
    let DESP_TYPE=updatedFormData.desp_type;
    let Getpasscode=updatedFormData.GETPASSCODE;
    let SELFAC=CompanyparametrselfAc;
    let autopurchasebill="Y";
    let PaymentGst=bankcode;
    let Purchase_Rate=parseFloat(updatedFormData.PurchaseRate);
    let qntl=parseFloat(updatedFormData.quantal);
    let PS_amount = 0;
    let PS_CGSTAmount=0.00;
    let PS_SGSTAmount=0.00;
    let PS_IGSTAmount=0.00;
    let cgstrate=0.00;
    let sgstrate=0.00;
    let igstrate=0.00;
    let TOTALPurchase_Amount=0.00;
    let TCS_Amt=0.00;
    let TDS_Amt=0.00;
    let NetPayble=0.00;
    let PS_SelfBal=0.00;
    let PSgepasscode=updatedFormData.GETPASSCODE;
    let PSsalebillto=updatedFormData.SaleBillTo;
    let PSTCS_Amt=0.00;
    let PSTDS_Amt=0.00;
    let PSNetPayble=0.00;
    let PurchaseTDSrate=0.00;
    let PSTCS_Rate=0.00;
    

    
    if (DESP_TYPE == "DI" && (Getpasscode == SELFAC || PDSType == "P")) {
        if (autopurchasebill == "Y") {
            updatedFormData.voucher_type = "PS";

             PS_amount = Math.round(parseFloat(Purchase_Rate * qntl ));

            if (PaymentGst == "" || PaymentGst == "0") {
                PaymentGst = updatedFormData.mill_code;
            }

            // Assume checkMatchStatus returns a promise and we await its result
            const matchStatus = await checkMatchStatus(PaymentGst, companyCode, Year_Code);

            if (matchStatus == "TRUE") {
                 cgstrate = (rate / 2).toFixed(2); // Example initialization, ensure it's defined
                 sgstrate =  (rate / 2).toFixed(2); // Example initialization, ensure it's defined
                 igstrate =  0.00; // Example initialization, ensure it's defined

                PS_CGSTAmount = Math.round(parseFloat(PS_amount * cgstrate / 100));
                PS_SGSTAmount = Math.round(parseFloat(PS_amount * sgstrate / 100));
                PS_IGSTAmount = 0;
            } else {
                cgstrate = 0;
                sgstrate = 0;
                igstrate = (rate / 2).toFixed(2);

                PS_CGSTAmount = 0;
                PS_SGSTAmount = 0;
                PS_IGSTAmount = Math.round(parseFloat(PS_amount * igstrate / 100));
            }

            TOTALPurchase_Amount = Math.round(parseFloat(PS_amount + PS_CGSTAmount + PS_SGSTAmount + PS_IGSTAmount));
            PSTCS_Amt = Math.round((parseFloat(TOTALPurchase_Amount) * PSTCS_Rate / 100));
            PSTDS_Amt = Math.round((parseFloat(PS_amount) * PurchaseTDSrate / 100));
            PSNetPayble = (parseFloat(TOTALPurchase_Amount) + parseFloat(PSTCS_Amt)) - parseFloat(PSTDS_Amt);

            if (PSgepasscode == SELFAC && PSsalebillto == SELFAC) {
                PS_SelfBal = "Y";
            } else {
                PS_SelfBal = "N";
            }
        }
    }

    updatedFormData.PS_CGSTAmount=PS_CGSTAmount;
    updatedFormData.PS_SGSTAmount= PS_SGSTAmount;
    updatedFormData.PS_IGSTAmount= PS_IGSTAmount;
    updatedFormData.PS_CGSTRATE= cgstrate;
    updatedFormData.PS_SGSTRATE= sgstrate;
    updatedFormData.PS_IGSTRATE= igstrate;
    updatedFormData.TOTALPurchase_Amount= TOTALPurchase_Amount;
    updatedFormData.PSTCS_Amt= PSTCS_Amt;
    updatedFormData.PSTDS_Amt= PSTDS_Amt;
    updatedFormData.PSNetPayble= PSNetPayble;
    updatedFormData.PS_SelfBal= PS_SelfBal;
    updatedFormData.PS_amount= PS_amount;


    // Return updated formData
    return updatedFormData;
};

  
  const saleBillCalculation = async (name,
    input,
    formData,
    gstRate
    ) => {
        
        formData={
            ...formData,
            cgstrate:0,
            sgstrate:0,
            igstrate:0,
            cgstamt:0,
            sgstamt:0,
            igstamt:0,
            SaleDetail_Rate:0,
            SB_freight:0,
            SB_SubTotal:0,
            SB_Less_Frt_Rate:0,
            TotalGstSaleBillAmount:0,
            TaxableAmountForSB:0,
            Roundoff:0,
            SBTCSAmt:0,
            Net_Payble:0,
            SBTDSAmt:0,
            item_Amount:0,
            SB_Ac_Code:0,
            SB_Unit_Code:0,
        }

    let updatedFormData = { ...formData, [name]: input };
    let rate= parseFloat(gstRate) || 0.00;
    let cgstrate=(rate / 2).toFixed(2);
    let sgstrate=(rate / 2).toFixed(2);
    let igstrate=0.00;
        
    cgstrate=(rate / 2).toFixed(2);
    sgstrate=(rate / 2).toFixed(2);
    igstrate=(rate / 2).toFixed(2);

    let RATES=0.00;
    let SALE_RATE=parseFloat(updatedFormData.sale_rate) || 0.0;
    let FRIEGHT_RATE=parseFloat(updatedFormData.FRIEGHT_RATE) || 0.0;
    let TenderCommision=parseFloat(updatedFormData.Tender_Commission) || 0.0;
    let VASULI_RATE_1=parseFloat(updatedFormData.VASULI_RATE_1) || 0.0;
    let VASULI_AMOUNT_1=parseFloat(updatedFormData.VASULI_AMOUNT_1) || 0.0;
    let MEMO_ADVANCE=parseFloat(updatedFormData.MEMO_ADVANCE) || 0.0;

    let MM_Rate=parseFloat(updatedFormData.MM_Rate) || 0.0;

    let insurance=parseFloat(updatedFormData.Insurance) || 0.0;
    let lessfrtwithgst = (SALE_RATE - FRIEGHT_RATE) + TenderCommision + insurance - VASULI_RATE_1;
    RATES = SALE_RATE + TenderCommision + insurance ;
    let SaleForNaka = (RATES - FRIEGHT_RATE) + MM_Rate;
    let expbamt = 0.00;
    let BillRoundOff = 0.00;
    let TaxableAmountForSB=0.00;
    let Delivery_Type=updatedFormData.Delivery_Type
    let qntl=updatedFormData.quantal
    let SB_SaleRate=0.00;
    let Carporate_Sale_No=updatedFormData.Carporate_Sale_No;

    if (Delivery_Type == "C") {
        TaxableAmountForSB = Math.round(parseFloat((RATES * qntl) + MEMO_ADVANCE + VASULI_AMOUNT_1));

    }
    else{
        
        if (Carporate_Sale_No == "0" || Carporate_Sale_No == "") {
            if (Delivery_Type == "N") {
                //  SB_SaleRate = Math.round(parseFloat((((SaleForNaka / (SaleForNaka + (SaleForNaka * GSTRate / 100))) * SaleForNaka))));
                SB_SaleRate = parseFloat((((SaleForNaka / (SaleForNaka + (SaleForNaka * rate / 100))) * SaleForNaka)));
                SB_SaleRate = Math.round((SB_SaleRate + Number.EPSILON) * 100) / 100;
                expbamt = parseFloat(SaleForNaka * qntl);

            }
            else if (Delivery_Type == "A") {

                SB_SaleRate = SaleForNaka;
                var frieght = (VASULI_RATE_1 * qntl);
                TaxableAmountForSB = (SaleForNaka * qntl) + frieght;
            }
            else {
                SB_SaleRate = lessfrtwithgst;
            }

            if (Delivery_Type == "N") {

                TaxableAmountForSB = Math.round(parseFloat(((SB_SaleRate + VASULI_RATE_1)) * qntl));
            }
            else if (Delivery_Type == "A") {

            }
            else {
                TaxableAmountForSB = Math.round(parseFloat(SB_SaleRate * qntl));
            }
        }
        else {
            if (Delivery_Type == "N") {
                //  SB_SaleRate = Math.round(parseFloat((((SaleForNaka / (SaleForNaka + (SaleForNaka * GSTRate / 100))) * SaleForNaka))));
                SB_SaleRate = parseFloat((((SaleForNaka / (SaleForNaka + (SaleForNaka * rate / 100))) * SaleForNaka)));
                SB_SaleRate = Math.round((SB_SaleRate + Number.EPSILON) * 100) / 100;
                expbamt = parseFloat(SaleForNaka * qntl);
            }
            else if (Delivery_Type == "A") {
                SB_SaleRate = SaleForNaka;
                SB_SaleRate = Math.round((SB_SaleRate + Number.EPSILON) * 100) / 100;
                expbamt = parseFloat(SaleForNaka * qntl);
            }
            else {
                SB_SaleRate = lessfrtwithgst;
            }
            //SB_SaleRate = SaleForNaka;
            if (Delivery_Type == "A") {
                TaxableAmountForSB = Math.round(parseFloat(((SB_SaleRate - (VASULI_RATE_1 + FRIEGHT_RATE)) + MM_Rate) * qntl));
            }
            else {
                TaxableAmountForSB = Math.round(parseFloat(SB_SaleRate * qntl));
            }
           
        }
    }

    let Sb_CheckState=0;
    if (pdspartystatecode != "0" && pdspartystatecode != "") {
        Sb_CheckState = pdspartystatecode;
    }
    else if (pdsBilltostatecode != "0" && pdsBilltostatecode != "") {
        Sb_CheckState = pdsBilltostatecode;
    }
    else {
        Sb_CheckState = updatedFormData.SaleBillTo;
    }
    const matchStatus=checkMatchStatus(Sb_CheckState,companyCode,Year_Code)
    let SB_CGSTAmount=0.00;
    let SB_SGSTAmount=0.00;
    let SB_IGSTAmount=0.00;
    
    

    if(matchStatus=="TRUE")
    {
        SB_CGSTAmount = parseFloat(TaxableAmountForSB * cgstrate / 100);
        SB_CGSTAmount = Math.round((SB_CGSTAmount + Number.EPSILON) * 100) / 100;

        SB_SGSTAmount = parseFloat(TaxableAmountForSB * sgstrate / 100);
        SB_SGSTAmount = Math.round((SB_SGSTAmount + Number.EPSILON) * 100) / 100;
        SB_IGSTAmount = 0.00;
        igstrate = 0;

    }
    else
    {
        SB_CGSTAmount = 0.00;
        cgstrate = 0;
        SB_SGSTAmount = 0.00;
        sgstrate = 0;
        SB_IGSTAmount = parseFloat(TaxableAmountForSB * igstrate / 100);
        SB_IGSTAmount = Math.round((SB_IGSTAmount + Number.EPSILON) * 100) / 100;

    }
    let TotalGstSaleBillAmount = 0;
    let SB_Other_Amount=parseFloat(updatedFormData.SB_Other_Amount)|| 0.00;
    TotalGstSaleBillAmount = parseFloat(TaxableAmountForSB + SB_CGSTAmount + SB_SGSTAmount + SB_IGSTAmount + SB_Other_Amount);

    let Roundoff = 0.00;
    let SB_SubTotal=0.00;
    let SB_Ac_Code=0;
    let SB_Unit_Code=0;
   

    if (PDSType == "P") {
        SB_Ac_Code = PDSParty;
        SB_Unit_Code = PDSUnit;
        
       
        if (Delivery_Type == "C") {
            Roundoff = Math.round(parseFloat(TotalGstSaleBillAmount - (TaxableAmountForSB + SB_CGSTAmount + SB_SGSTAmount + SB_IGSTAmount + SB_Other_Amount)));

            SB_SubTotal = Math.round(parseFloat(qntl * RATES));
        }
        else {
            Roundoff = Math.round(parseFloat(TotalGstSaleBillAmount - (TaxableAmountForSB + SB_CGSTAmount + SB_SGSTAmount + SB_IGSTAmount + SB_Other_Amount)));

            SB_SubTotal = Math.round(parseFloat(qntl * SB_SaleRate));

        }
    }
    else {
        SB_Ac_Code = updatedFormData.SaleBillTo;
        SB_Unit_Code = updatedFormData.voucher_by;
        
        if (Delivery_Type == "C") {
            Roundoff = Math.round(parseFloat(TotalGstSaleBillAmount - (TaxableAmountForSB + SB_CGSTAmount + SB_SGSTAmount + SB_IGSTAmount)));
            SB_SubTotal = Math.round(parseFloat(qntl * RATES));
        }
        else {
            Roundoff = Math.round(parseFloat(TotalGstSaleBillAmount - (TaxableAmountForSB + SB_CGSTAmount + SB_SGSTAmount + SB_IGSTAmount)));
            SB_SubTotal = Math.round(parseFloat(qntl * SB_SaleRate) - (MEMO_ADVANCE + VASULI_AMOUNT_1));
        }
    }
    let SB_Less_Frt_Rate=0.00;
    let SB_freight=0.00;
    let item_Amount=0.00;
    let SaleDetail_Rate=0.00;

    if (Delivery_Type == "C") {
        SB_Less_Frt_Rate = Math.round(parseFloat(MM_Rate + VASULI_RATE_1));
        SB_freight = Math.round(parseFloat(MEMO_ADVANCE + VASULI_AMOUNT_1));

        item_Amount = Math.round(parseFloat(RATES * qntl + 0));
        SaleDetail_Rate = RATES;
    }
    else {
        SB_Less_Frt_Rate = Math.round(parseFloat(MM_Rate + VASULI_RATE_1));
        SB_freight = Math.round(parseFloat(MEMO_ADVANCE + VASULI_AMOUNT_1));

        item_Amount = Math.round(parseFloat((SB_SaleRate * qntl) - MEMO_ADVANCE - VASULI_AMOUNT_1 + 0));
        SB_SaleRate = SB_SubTotal / qntl;

        SaleDetail_Rate = SB_SaleRate;
    }

    let TCSRate_sale=updatedFormData.Sale_TCS_Rate;
    let TCSAmt = Math.round(parseFloat(TotalGstSaleBillAmount) * TCSRate_sale / 100);
    let cashdiffvalue=updatedFormData.Cash_diff;
    let cashdiff=SALE_RATE-cashdiffvalue;
    let SaleTDS=updatedFormData.SaleTDSRate
    let TDSAmt = parseFloat(cashdiff*SaleTDS);//Math.round(parseFloat(TaxableAmountForSB) * SaleTDSrate / 100);

    let Net_Payble = Math.round(parseFloat(TotalGstSaleBillAmount) + TCSAmt);
    if (Delivery_Type == "N") {
        //  BillRoundOff = expbamt - TotalGstSaleBillAmount;
        Roundoff = Math.round(TotalGstSaleBillAmount) - TotalGstSaleBillAmount
    }
    else {
        Roundoff = Math.round(TotalGstSaleBillAmount) - TotalGstSaleBillAmount;

    }

    TotalGstSaleBillAmount = TotalGstSaleBillAmount + Roundoff;

    updatedFormData.cgstrate=cgstrate;
    updatedFormData.sgstrate=sgstrate;
    updatedFormData.igstrate=igstrate;
    updatedFormData.cgstamt=SB_CGSTAmount;
    updatedFormData.sgstamt=SB_SGSTAmount;
    updatedFormData.igstamt=SB_IGSTAmount;
    updatedFormData.SaleDetail_Rate=SaleDetail_Rate;
    updatedFormData.SB_freight=SB_freight;
    updatedFormData.SB_SubTotal=SB_SubTotal;
    updatedFormData.SB_Less_Frt_Rate=SB_Less_Frt_Rate;
    updatedFormData.TotalGstSaleBillAmount=TotalGstSaleBillAmount;
    updatedFormData.TaxableAmountForSB=TaxableAmountForSB;
    updatedFormData.Roundoff=Roundoff;
    updatedFormData.SBTCSAmt=TCSAmt;
    updatedFormData.Net_Payble=Net_Payble;
    updatedFormData.SBTDSAmt=TDSAmt;
    updatedFormData.item_Amount=item_Amount;
    updatedFormData.SB_Ac_Code=SB_Ac_Code;
    updatedFormData.SB_Unit_Code=SB_Unit_Code;
        
    return updatedFormData;


  }

const calculateDependentValues = async (
    name,
    input,
    formData
  ) => {
    
    let updatedFormData = { ...formData, [name]: input };
    const updatedFormDataDetail = { ...formDataDetail, [name]: input };
    let MMRate = parseFloat(updatedFormData.MM_Rate) || 0.0;
    let millamount = parseFloat(updatedFormData.amount) || 0.0;
    const PurcTcsRate = parseFloat(updatedFormData.TCS_Rate) || 0.0;
    const PurcTdsRate = parseFloat(updatedFormData.PurchaseTDSRate) || 0.0;
    const qntl = parseFloat(updatedFormData.quantal) || 0.0;
    const millamounttcs=(millamount * PurcTcsRate)*100;
    const millamounttds=(millamount*PurcTdsRate)*100;
    const purc_Rate = parseFloat(updatedFormData.PurchaseRate) || 0;
    const excise_Rate = parseFloat(updatedFormData.excise_rate) || 0;
    const MemoGST_Rate = parseFloat(GSTMemoGstcode) || 0;
    const salerate = parseFloat(updatedFormData.sale_rate) || 0;
    
    const rate = qntl !== 0 ? (purc_Rate + excise_Rate) : 0;
    millamount = qntl * rate;
    updatedFormData.amount=millamount;
    updatedFormData.final_amout=millamount;
    updatedFormData.Mill_AmtWO_TCS=(millamount + millamounttcs)- millamounttds;

    updatedFormData.bags = parseFloat(( qntl / updatedFormData.packing ) * 100);



   // console.log("updatedFormData.transport",updatedFormData.transport)
    const matchStatus=checkMatchStatus(updatedFormData.transport,companyCode,Year_Code)
    console.log(matchStatus)
    if(MemoGST_Rate!=0)
        {
           updatedFormData = await calculatememogstrateamount(name,input,updatedFormData,GSTMemoGstrate,matchStatus);
        }

    let  MemoAdvance= parseFloat(updatedFormData.Memo_Advance) || 0.0;  
    MMRate= parseFloat( MemoAdvance / qntl ) ;
    updatedFormData.MM_Rate=MMRate;

    let diffrate=0.00;
    let diffamount=0.00;
    diffrate=parseFloat( salerate-purc_Rate );
    diffamount=parseFloat(diffrate*qntl);
    updatedFormData.diff_rate=diffrate;
    updatedFormData.diff_amount=diffamount;

    let Frieghtrate=parseFloat(updatedFormData.FreightPerQtl)|| 0.00;
    let Frieghtamt=parseFloat(updatedFormData.Freight_Amount)|| 0.00;
    let vasulirate=parseFloat(updatedFormData.vasuli_rate)|| 0.00;
    let vasuliamt=0.00;
     if (qntl != 0 && Frieghtrate != 0) {

        Frieghtamt=parseFloat(qntl*Frieghtrate);
     }
     else   
     {
        Frieghtamt=0.00;
     }

    updatedFormData.Freight_Amount=Frieghtamt;

    if (qntl != 0 && vasulirate != 0) {

        vasuliamt=parseFloat(qntl*vasulirate);
     }
     else   
     {
        vasuliamt=0.00;
     }

    updatedFormData.vasuli_amount=vasuliamt;









    setFormDataDetail(prevData => {
        const newDetailData = {
            ...prevData,
           
            Amount:formData.amount,

        }
        setUsers([newDetailData])
        return newDetailData

        
    });

        console.log(updatedFormData)        
          return updatedFormData;
  }
    

   


  
// useEffect(() =>{
//     setUsers([formDataDetail])
// })
    // Handle change for all inputs
    const handleChange = async(event) => {
        const { name, value } = event.target;
            const updatedFormData = await calculateDependentValues(
                name, // Pass the name of the field being changed
                value, // Pass the correct gstRate
                formData // Pass gstRate explicitly to calculateDependentValues
              )

              console.log(updatedFormData)

            setFormData(updatedFormData)

    };

    
    
    const deleteModeHandler = async(userToDelete) => {
    }

    const openPopup = () => {
        setShowPopup(true);
    };

    const openDelete = async(user) => {
    }

    //close popup function
    const closePopup = () => {
        setShowPopup(false);
        setSelectedUser({});
        clearForm();
    };

    useEffect(() => {
        if (selectedRecord) {
            
          setUsers(
            lastTenderDetails.map((detail) => ({
              ddType:detail.ddType,
              Bank_Code: detail.bankcode|| bankcodenew,
              bankcodeacname: detail.bankcodeacname,
              Narration: detail.Narration,
              Amount: detail.Amount,
              UTR_NO: detail.UTR_NO,
              LTNo:detail.LTNo,
              bc:detail.bc,
              dodetailid:detail.dodetailid,
              id: detail.id,
             // dcdetailid: detail.dcdetailid,
              
              rowaction: "Normal",
              
            }))
          );
        }
      }, [selectedRecord, lastTenderDetails]);
    
      useEffect(() => {
        
        const updatedUsers = lastTenderDetails.map((detail) => ({
             ddType:detail.ddType,
              Bank_Code: detail.Bank_Code || bankcodenew,
              bankcodeacname: detail.bankname,
              Narration: detail.Narration,
              Amount: detail.Amount,
              UTR_NO: detail.UTR_NO,
              LTNo:detail.LTNo,
              bc:detail.bc,
              dodetailid:detail.dodetailid,
              id: detail.id,
              rowaction: "Normal",
        }));
    
        setUsers(updatedUsers);

        
      }, [lastTenderDetails]);
    
    const handleChangeDetail = (event) => {
        const { name, value } = event.target;
        let updatedFormDataDetail = { ...formDataDetail, [name]: value };

        if (name === 'Quantal') {
            const quantal = parseFloat(value);
            const packing = parseFloat(formDataDetail.packing);

            updatedFormDataDetail = {
                ...updatedFormDataDetail,
                bags: !isNaN(quantal) && !isNaN(packing) && packing !== 0 ? Math.round((quantal * 100) / packing) : '',
            };
        }

        if (name === 'packing') {
            const packing = parseFloat(value);
            const quantal = parseFloat(formDataDetail.Quantal);

            updatedFormDataDetail = {
                ...updatedFormDataDetail,
                bags: !isNaN(quantal) && !isNaN(packing) && packing !== 0 ? Math.round((quantal * 100) / packing) : '',
            };
        }

        if (name === 'rate' || name === 'Quantal') {
            const quantal = parseFloat(updatedFormDataDetail.Quantal);
            const rate = parseFloat(updatedFormDataDetail.rate);

            updatedFormDataDetail = {
                ...updatedFormDataDetail,
                item_Amount: !isNaN(quantal) && !isNaN(rate) ? (quantal * rate).toFixed(2) : "0.00",
            };
        }

        setFormDataDetail(updatedFormDataDetail);
    };

    const clearForm = () => {
    };

    const updateUser = async () => {
    };

    const addUser = async () => {
        debugger;
        const newUser = {
            id: users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1,
            Bank_Code: bankcode,
            bankcodeacname:bankcodeacname,
            bc:bankcodeacoid,
            ...formDataDetail,
                rowaction: "add",
        };

        
        setFormDataDetail({
            ...newUser
            
        });

            // Fetch match status
           
    
            // if (match_status) {
            //     handleMatchStatus(match_status, subTotal);
            // }
        
        setUsers([...users, newUser]);
        closePopup();
    };

    const editUser = (user) => {
        setSelectedUser(user);
        
        setFormDataDetail({
            bags: user.bags || "",
            packing: user.packing || "",
            Quantal: user.Quantal || "",
            rate: user.rate || "",
            item_Amount: user.item_Amount || "",
            narration: user.narration || ""
        });
        openPopup();
    };

    const handleMatchStatus = (match_status, subTotal) => {
    };

    const fetchLastRecord= () => {
        fetch(`${API_URL}/get-lastDO-navigation?company_code=${companyCode}&Year_Code=${Year_Code}`)
            .then(response => {
                console.log("response", response)
                if (!response.ok) {
                    throw new Error('Failed to fetch last record');
                }
                return response.json();
            })
            .then(data => {
                // Set the last company code as the default value for Company_Code
                setFormData((prevState) => ({
                    ...prevState,
                    doc_no: data.last_head_data.doc_no + 1,
                }))
            })
            .catch(error => {
                console.error('Error fetching last record:', error);
            });
    };

    const handleAddOne = () => {
        setAddOneButtonEnabled(false);
        setSaveButtonEnabled(true);
        setCancelButtonEnabled(true);
        setEditButtonEnabled(false);
        setDeleteButtonEnabled(false);
        setIsEditing(true);
        fetchLastRecord()
        setFormData (initialFormData)
        setLastTenderDetails([])
          
          lblmillname="";
          lblbrandname="";
          lblbrokername="";
          lblcashdiffacname="";
          lblgetpasscodename="";
          lblgetpassstatename="";
          lblitemname="";
          lblMemoGSTRatename="";
          lblmillstatename="";
          lblsalebilltoname="";
          lblgetpassstatename="";
          lbltdsacname="";
          lbltransportname="";
          lbltransportstatename="";
          lblvoucherBystatename="";
          lblvasuliacname="";
          lblvoucherByname="";
          lblDoname="";
          lblBilltostatename="";
          lblbrokername="";
          newvoucher_by="";
          newSaleBillTo="";
          newGETPASSCODE="";
          newCashDiffAc="";
          newVasuli_Ac="";
          newGetpassGstStateCode="";
          newVoucherbyGstStateCode=""
          newSalebilltoGstStateCode="";
          newMillGSTStateCode="";
          newitemcode="";
          newbrandcode="";
          newGstRateCode="";
          newMemoGSTRate="";
          newCashDiffAc="";
          newDO="";
          newTDSAc="";
          newbroker="";
          newtransport="";
          newTransportGSTStateCode="";
          newmill_code="";
          newPurcno="";


        }
    const validateForm = () => {
        try {
          DeliveryOrderSchema.parse(formData);
          setFormErrors({});
          return true;
        } catch (err) {
          const errors = {};
          err.errors.forEach((error) => {
            errors[error.path[0]] = error.message;
          });
          setFormErrors(errors);
          return false;
        }
      };

    const handleSaveOrUpdate = async () => {
        debugger;
        if (!validateForm()) return;
        setIsEditing(true);
        setIsLoading(true);
        
    
        let headData = {
          ...formData,
        //   gst_code: gstCode || GSTCode,
        //   tran_type: tranType,
        };

        headData=await PurchaseBillCalculation("save","ps",formData,Gst_Rate);

        headData=await saleBillCalculation("save","sale",headData,Gst_Rate);
        // Remove dcid from headData if in edit mode
        if (isEditMode) {
          delete headData.doid;
          delete headData.millname;
          delete headData.brandname;
          delete headData.brokername;
          delete headData.cashdiffacname;
          delete headData.getpassname;
          delete headData.getpassstatename;
          delete headData.itemname;
          delete headData.memorategst;
          delete headData.millstatename;
          delete headData.salebillname;
          delete headData.salebilltostatename;
          delete headData.tdsacname;
          delete headData.transportname;
          delete headData.transportstatename;
          delete headData.vaoucherbystatename;
          delete headData.vasuliacname;
          delete headData.voucherbyname;
          delete headData.DOName;
          


        }
        const detailData = users.map((user) => ({
          rowaction: user.rowaction,
          dodetailid: user.dodetailid,
          Bank_Code: user.Bank_Code|| tenderDetails.Payment_To,
          ddType: user.ddType,
          Narration: user.Narration,
          Amount: user.Amount,
          detail_Id: 1,
          Company_Code: companyCode,
          Year_Code: Year_Code,
          Item_Code: user.Item_Code,
          LTNo: user.LTNo,
          bc: user.bc|| tenderDetails.pt,
        }));
    
        const requestData = {
          headData,
          detailData,
        };

        console.log("requestData",requestData)
    
        try {
          if (isEditMode) {
            const updateApiUrl = `${API_URL}/update-DeliveryOrder?doid=${newDcid}`;
            const response = await axios.put(updateApiUrl, requestData);
    
            toast.success("Data updated successfully!");
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            const response = await axios.post(
              `${API_URL}/insert-DeliveryOrder`,
              requestData,
              console.log("requestData",requestData)
            );
            toast.success("Data saved successfully!");
            setIsEditMode(false);
            setAddOneButtonEnabled(true);
            setEditButtonEnabled(true);
            setDeleteButtonEnabled(true);
            setBackButtonEnabled(true);
            setSaveButtonEnabled(false);
            setCancelButtonEnabled(false);
            setIsEditing(true);
    
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        } catch (error) {
          toast.error("Error occurred while saving data");
        } finally {
          setIsEditing(false);
          setIsLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditMode(true);
        setAddOneButtonEnabled(false);
        setSaveButtonEnabled(true);
        setCancelButtonEnabled(true);
        setEditButtonEnabled(false);
        setDeleteButtonEnabled(false);
        setBackButtonEnabled(true);
        setIsEditing(true);

    };
    const handleCancel = async () => {
        debugger;
    setIsEditing(false);
    setIsEditMode(false);
    setAddOneButtonEnabled(true);
    setEditButtonEnabled(true);
    setDeleteButtonEnabled(true);
    setBackButtonEnabled(true);
    setSaveButtonEnabled(false);
    setCancelButtonEnabled(false);
    setCancelButtonClicked(true);
    try {
      const response = await axios.get(
        `${API_URL}/get-lastDO-navigation?company_code=${companyCode}&Year_Code=${Year_Code}`
      );
      if (response.status === 200) {
        const data = response.data;
        console.log(data)
        newDcid = data.last_head_data.doid;
        bankcodenew = data.last_details_data[0].Bank_Code;
        lblbankname = data.last_details_data[0].bankname; 
        newmill_code = data.last_head_data.mill_code;
        lblmillname=data.last_head_data.millname;
        newMillGSTStateCode=data.last_head_data.MillGSTStateCode;
        lblmillstatename=data.last_head_data.millstatename;
        newGETPASSCODE = data.last_head_data.GETPASSCODE;  
        lblgetpasscodename= data.last_head_data.getpassname;  
        lblgetpassstatename=data.last_head_data.getpassstatename; 
        newGetpassGstStateCode=data.last_head_data.GetpassGstStateCode;
        newvoucher_by = data.last_head_data.voucher_by;  
        lblvoucherByname= data.last_head_data.voucherbyname;  
        lblvoucherBystatename=data.last_head_data.vaoucherbystatename; 
        newVoucherbyGstStateCode=data.last_head_data.VoucherbyGstStateCode;
        lblgstratename=data.last_head_data.gstratename;
        newGstRateCode=data.last_head_data.GstRateCode;
        newSaleBillTo = data.last_head_data.SaleBillTo;  
        lblsalebilltoname= data.last_head_data.salebillname;  
        lblBilltostatename=data.last_head_data.salebilltostatename; 
        newSalebilltoGstStateCode=data.last_head_data.SalebilltoGstStateCode;
        newtransport = data.last_head_data.transport;  
        lbltransportname= data.last_head_data.transportname;  
        lbltransportstatename=data.last_head_data.transportstatename; 
        newTransportGSTStateCode=data.last_head_data.TransportGSTStateCode;
        lblitemname=data.last_head_data.itemname; 
        newitemcode=data.last_head_data.itemcode;
        lblbrandname=data.last_head_data.brandname; 
        newbrandcode=data.last_head_data.brandcode;
        lblMemoGSTRatename=data.last_head_data.memorategst;
        newMemoGSTRate=data.last_head_data.MemoGSTRate;
        newVasuli_Ac = data.last_head_data.Vasuli_Ac;  
        lblvasuliacname= data.last_head_data.vasuliacname;  
        lblDoname=data.last_head_data.DOName; 
        newDO=data.last_head_data.DO;
        lbltdsacname=data.last_head_data.tdsacname; 
        newTDSAc=data.last_head_data.TDSAc;
        lblbrokername=data.last_head_data.brokername; 
        newbroker=data.last_head_data.broker;
        lblcashdiffacname=data.last_head_data.cashdiffacname; 
        newCashDiffAc=data.last_head_data.CashDiffAc;
        newPurcno=data.last_head_data.purc_no;
        lblTenderid=data.last_head_data.purc_order;
        
     
        setFormData((prevData) => ({
          ...prevData,
          ...data.last_head_data,
          
        }));

        setLastTenderData(data.last_head_data || {});
        setLastTenderDetails(data.last_details_data || []);
      } else {
        toast.error(
          "Failed to fetch last data:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
        console.log(error)
      toast.error("Error during API call:", error);
    }
    };

    const handleDelete = async () => {
        const isConfirmed = window.confirm(`Are you sure you want to delete this Doc_no ${formData.doc_no}?`);

        if (isConfirmed) {
            setIsEditMode(false);
            setAddOneButtonEnabled(true);
            setEditButtonEnabled(true);
            setDeleteButtonEnabled(true);
            setBackButtonEnabled(true);
            setSaveButtonEnabled(false);
            setCancelButtonEnabled(false);

            try {
                const headData = {
                     ...formData,
                
                };
                console.log('headdata',headData)
        
                const requestData = {
                  headData
  
                };
        
        
        const response = await axios.delete(
                      `${API_URL}/delete_data_by_doid?doid=${formData.doid}&company_code=${companyCode}&Year_Code=${formData.Year_Code}&doc_no=${formData.doc_no}`,
                      requestData,
                      console.log("requestData",requestData)
                    );

                    console.log('response',response)            


                // const deleteApiUrl = `${API_URL}/delete_data_by_doid?doid=${formData.doid}&company_code=${companyCode}&Year_Code=${formData.Year_Code}&doc_no=${formData.doc_no}`;
                // #const response = await axios.delete(deleteApiUrl);
                toast.success("Record deleted successfully!");
                handleCancel();

            } catch (error) {
                toast.error("Deletion cancelled");
                console.error("Error during API call:", error);
            }
        } else {
            console.log("Deletion cancelled");
        }
    };

    const handleBack = () => {
        navigate ("/DeliveryOrder-utility")
    }
    //Handle Record DoubleCliked in Utility Page Show that record for Edit
    const handlerecordDoubleClicked = async() => {
        try {
            const response = await axios.get(`${API_URL}/get-DeliveryOrderSelectedRecord?Company_Code=${companyCode}&group_Code=${selectedRecord._____}`);
            const data = response.data;
            setFormData((prevData) => ({
                ...prevData,
                
            }));
           
            lastTenderDetails(data.lastTenderDetails || []);
            setIsEditing(false);
        } catch (error) {
            console.error('Error fetching data:', error);
        }

        setIsEditMode(false);
        setAddOneButtonEnabled(true);
        setEditButtonEnabled(true);
        setDeleteButtonEnabled(true);
        setBackButtonEnabled(true);
        setSaveButtonEnabled(false);
        setCancelButtonEnabled(false);
        setUpdateButtonClicked(true);
        setIsEditing(false);
    }

    useEffect(() => {
        if(selectedRecord){
            handlerecordDoubleClicked();
        }else{
            handleAddOne()
        }
    }, [selectedRecord]);

//change No functionality to get that particular record
    const handleKeyDown = async (event) => {
        if (event.key === "Tab") {
            const changeNoValue = event.target.value;
            try {
              const response = await axios.get(
                `${API_URL}/DOByid?company_code=${companyCode}&doc_no=${changeNoValue}&Year_Code=${Year_Code}`
              );
              const data = response.data;
              console.log(data);
              bankcodenew = data.last_details_data[0].Bank_Code;
              lblbankname = data.last_details_data[0].bankname; 
              newmill_code = data.last_details_data.mill_code;
              lblmillname=data.last_details_data[0].millname;
              newMillGSTStateCode=data.last_details_data[0].MillGSTStateCode;
              lblmillstatename=data.last_details_data[0].millstatename;
              newGETPASSCODE = data.last_details_data[0].GETPASSCODE;  
              lblgetpasscodename= data.last_details_data[0].getpassname;  
              lblgetpassstatename=data.last_details_data[0].getpassstatename; 
              newGetpassGstStateCode=data.last_details_data[0].GetpassGstStateCode;
              newvoucher_by = data.last_details_data[0].voucher_by;  
              lblvoucherByname= data.last_details_data[0].voucherbyname;  
              lblvoucherBystatename=data.last_details_data[0].vaoucherbystatename; 
              newVoucherbyGstStateCode=data.last_details_data[0].voucherbystatecode;
              lblgstratename=data.last_details_data[0].Gstrate;
              newGstRateCode=data.last_details_data[0].GstRateCode;
              newSaleBillTo = data.last_details_data[0].SaleBillTo;  
              lblsalebilltoname= data.last_details_data[0].salebillname;  
              lblBilltostatename=data.last_details_data[0].salebilltostatename; 
              newSalebilltoGstStateCode=data.last_details_data[0].salebilltostatecode;
              newtransport = data.last_details_data[0].transport;  
              lbltransportname= data.last_details_data[0].transportname;  
              lbltransportstatename=data.last_details_data[0].transportstatename; 
              newTransportGSTStateCode=data.last_details_data[0].TransportGSTStateCode;
              lblitemname=data.last_details_data[0].itemname; 
              newitemcode=data.last_details_data[0].itemcode;
              lblbrandname=data.last_details_data[0].brandname; 
              newbrandcode=data.last_details_data[0].brandcode;
              lblMemoGSTRatename=data.last_details_data[0].memorategst;
              newMemoGSTRate=data.last_details_data[0].MemoGSTRate;
              newVasuli_Ac = data.last_details_data[0].Vasuli_Ac;  
              lblvasuliacname= data.last_details_data[0].vasuliacname;  
              lblDoname=data.last_details_data[0].DOName; 
              newDO=data.last_details_data[0].DO;
              lbltdsacname=data.last_details_data[0].tdsacname; 
              newTDSAc=data.last_details_data[0].TDSAc;
              lblbrokername=data.last_details_data[0].brokername; 
              newbroker=data.last_details_data[0].broker;
              lblcashdiffacname=data.last_details_data[0].cashdiffacname; 
              newCashDiffAc=data.last_details_data[0].CashDiffAc;     
           
              
              setFormData({
                ...formData,
                ...data.last_head_data,
              });
              setLastTenderData(data.last_head_data || {});
              setLastTenderDetails(data.last_details_data || []);
              setIsEditing(false);
            } catch (error) {
              console.error("Error fetching data:", error);
            }
          }
    };

    //Navigation Buttons
    const handleFirstButtonClick = async () => {
        try {
            const response = await fetch(`${API_URL}/get-first-DeliveryOrder`);
            if (response.ok) {
                const data = await response.json();
                // Access the first element of the array
                const firstUserCreation = data[0];

                setFormData({
                    ...formData, ...data,
                   
                });
                lastTenderDetails(data.lastTenderDetails || []);

            } else {
                console.error("Failed to fetch first record:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error during API call:", error);
        }
    };

    const handlePreviousButtonClick = async () => {
        try {
            // Use formData.Company_Code as the current company code
            const response = await fetch(`${API_URL}/get-previous-DeliveryOrder?key_code=${formData.key_code}`);

            if (response.ok) {
                const data = await response.json();

                // Assuming setFormData is a function to update the form data
                setFormData({
                    ...formData, ...data,
                });
                lastTenderDetails(data.lastTenderDetails || []);
            } else {
                console.error("Failed to fetch previous record:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error during API call:", error);
        }
    };

    const handleNextButtonClick = async () => {
        try {
            const response = await fetch(`${API_URL}/get-next-DeliveryOrder?key_code=${formData.key_code}`);

            if (response.ok) {
                const data = await response.json();
                // Assuming setFormData is a function to update the form data
                setFormData({
                    ...formData, ...data.nextSelectedRecord

                });
                lastTenderDetails(data.lastTenderDetails || []);
            } else {
                console.error("Failed to fetch next record:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error during API call:", error);
        }
    };

    const handleLastButtonClick = async () => {
        try {
            const response = await fetch(`${API_URL}/get-last-DeliveryOrder`);
            if (response.ok) {
                const data = await response.json();
                // Access the first element of the array
                const last_Navigation = data[0];

                setFormData({
                    ...formData, ...last_Navigation,
                });
                lastTenderDetails(data.lastTenderDetails || []);
            } else {
                console.error("Failed to fetch last record:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error during API call:", error);
        }
    }

    return (
        <>
            <div >
                <ToastContainer />
                <ActionButtonGroup
                    handleAddOne={handleAddOne}
                    addOneButtonEnabled={addOneButtonEnabled}
                    handleSaveOrUpdate={handleSaveOrUpdate}
                    saveButtonEnabled={saveButtonEnabled}
                    isEditMode={isEditMode}
                    handleEdit={handleEdit}
                    editButtonEnabled={editButtonEnabled}
                    handleDelete={handleDelete}
                    deleteButtonEnabled={deleteButtonEnabled}
                    handleCancel={handleCancel}
                    cancelButtonEnabled={cancelButtonEnabled}
                    handleBack={handleBack}
                    backButtonEnabled={backButtonEnabled}
                />
               
                    {/* Navigation Buttons */}
                    <NavigationButtons
                        handleFirstButtonClick={handleFirstButtonClick}
                        handlePreviousButtonClick={handlePreviousButtonClick}
                        handleNextButtonClick={handleNextButtonClick}
                        handleLastButtonClick={handleLastButtonClick}
                        highlightedButton={highlightedButton}
                        isEditing={isEditing}
                        // isFirstRecord={formData.company_code === companyCode}

                    />
               
            </div>

<div >
                <form>

                    <h2>Delivery Order</h2>
                    <br />
                    <div className="form-group ">
                        <label htmlFor="changeNo">Change No:</label>
                        <input
                            type="text"
                            id = "changeNo"
                            Name = "changeNo"
                            onKeyDown={handleKeyDown}
                            disabled={!addOneButtonEnabled}
                        />
                        
                        <label htmlFor="tenderdetailid">Tender Detailid:</label>
                        <input
                            type="text"
                            id = "tenderdetailid"
                            Name = "tenderdetailid"
                            value={formData.tenderdetailid}
                            onChange={handleChange}
                            disabled={!isEditing && addOneButtonEnabled}
                        />
                        <label htmlFor="newsbdate">newsbdate:</label>
                        <input
                            type="date"
                            id = "newsbdate"
                            Name = "newsbdate"
                            value={formData.newsbdate}
                            onChange={handleChange}
                            disabled={!isEditing && addOneButtonEnabled}
                        />
                        <label htmlFor="einvoiceno">einvoiceno:</label>
                        <input
                            type="text"
                            id = "einvoiceno"
                            Name = "einvoiceno"
                            value={formData.einvoiceno}
                            onChange={handleChange}
                            disabled={!isEditing && addOneButtonEnabled}
                        />
                         <label htmlFor="ackno">ackno:</label>
                        <input
                            type="text"
                            id = "ackno"
                            Name = "ackno"
                            value={formData.ackno}
                            onChange={handleChange}
                            disabled={!isEditing && addOneButtonEnabled}
                        />
                    </div>
                   <div className="form-group">
                        <label htmlFor="doc_no">Doc no:</label>
                        <input
                            type="text"
                            id = "doc_no"
                            Name = "doc_no"
                            value={formData.doc_no}
                            onChange={handleChange}
                            disabled={!isEditing && addOneButtonEnabled}
                        />
                        <label htmlFor="desp_type">Desp Type:</label>
                       
                         <select
                                id="desp_type"
                                name="desp_type"
                                value={formData.desp_type}
                                onChange={handleChange}
                                disabled={!isEditing && addOneButtonEnabled}
                            >
                                <option value="DO">D.O</option>
                                <option value="DI">Dispatch</option>
                               
                            </select>
                        <label htmlFor="doc_date">Doc Date:</label>
                        <input
                            type="date"
                            id = "doc_date"
                            Name = "doc_date"
                            value={formData.doc_date}
                            onChange={handleChange}
                            disabled={!isEditing && addOneButtonEnabled}
                        />
                         <label htmlFor="Do_DATE">DO DATE:</label>
                                <input
                                    type="text"
                                    id = "Do_DATE"
                                    Name = "Do_DATE"
                                    value={formData.Do_DATE}
                                    onChange={handleChange}
                                    disabled={!isEditing && addOneButtonEnabled}
                                />
                                <label htmlFor="Carporate_Sale_No">Carporate Sale No:</label>
                                <CarporateHelp
                                        Name = "Carporate_Sale_No"
                                        onAcCodeClick={handleCarporate}
                                        Carporate_no={Carporateno}
                                        
                                        tabIndex={98}
                                        disabledFeild = {!isEditing && addOneButtonEnabled}
                                        
                                        onTenderDetailsFetched={handleCarporateDetailsFetched}
                                        
                                    />
                               
                        <input
                            type="text"
                            id = "Carporate_Sale_Year_Code"
                            Name = "Carporate_Sale_Year_Code"
                            
                            onChange={handleChange}
                            disabled={!isEditing && addOneButtonEnabled}
                        />
                        </div>
                       <div className="form-group">
                        <label htmlFor="mill_code" >Mill Code
                        </label>
                            <AccountMasterHelp
                                Name = "mill_code"
                                onAcCodeClick={handlemill_code}
                                CategoryName={lblmillname}
                                CategoryCode={newmill_code}
                                tabIndex={5}
                                disabledFeild = {!isEditing && addOneButtonEnabled}
                            />
                             <label htmlFor="Insured">Insured:</label>
                                
                                <select
                                    id="Insured"
                                    name="Insured"
                                    value={formData.Insured}
                                    onChange={handleChange}
                                    disabled={!isEditing && addOneButtonEnabled}
                                >
                                    <option value="Y">Yes</option>
                                    <option value="N">No</option>
                                </select>
                                <label htmlFor="MillGSTStateCode" >
                                    MillGSTStateCode
                                        </label>
                                        <GSTStateMasterHelp
                                            Name = "MillGSTStateCode"
                                            onAcCodeClick={handleMillGSTStateCode}
                                            CategoryName={lblmillstatename}
                                            GstStateCode={newMillGSTStateCode}
                                            tabIndex={106}
                                            disabledFeild = {!isEditing && addOneButtonEnabled}
                                        />

                      
                        
                        </div>
                          <div className="form-group">
                            <label htmlFor="purc_no">Purc no:</label>
                            <PurcnoHelp
                                        Name = "purc_no"
                                        onAcCodeClick={handlePurcno}
                                        Tenderno={newPurcno}
                                        Tenderid={lblTenderid}
                                        tabIndex={98}
                                        disabledFeild = {!isEditing && addOneButtonEnabled}
                                        Millcode = {formData.mill_code}
                                        onTenderDetailsFetched={handleTenderDetailsFetched}
                                        
                                    />
                               
                                
                                <label htmlFor="Delivery_Type">Delivery Type:</label>
                                <select
                                    id="Delivery_Type"
                                    name="Delivery_Type"
                                    value={formData.Delivery_Type}
                                    onChange={handleChange}
                                    disabled={!isEditing && addOneButtonEnabled}
                                >
                                    <option value="C">Commission</option>
                                    <option value="N">With GST Naka Delivery</option>
                                    <option value="A">Naka Delivery without GST Rate</option>
                                    <option value="D">DO</option>
</select>
                                    <label htmlFor="GstRateCode" >
                                GstRateCode
                                    </label>
                                    <GSTRateMasterHelp
                                        Name = "GstRateCode"
                                        onAcCodeClick={handleGstRateCode}
                                        GstRateName={ChangeData.gstratename||lblgstratename}
                                        GstRateCode={ChangeData.gstratecode||newGstRateCode}
                                        tabIndex={98}
                                        disabledFeild = {!isEditing && addOneButtonEnabled}
                                    />
                                    <label htmlFor="Purchase_Date">Purchase Date:</label>
                                    <input
                                        type="date"
                                        id = "Purchase_Date"
                                        Name = "Purchase_Date"
                                        value={formData.Purchase_Date}
                                        onChange={handleChange}
                                        disabled={!isEditing && addOneButtonEnabled}
                                    />
                                    </div>    
                                <div className="form-group">
                                <label htmlFor="GETPASSCODE" >
                                        GetpassCode
                                    </label>
                                    <AccountMasterHelp
                                        Name = "GETPASSCODE"
                                        onAcCodeClick={handleGETPASSCODE}
                                        CategoryName={ChangeData.buyername || lblgetpasscodename}
                                        CategoryCode={ChangeData.Buyer || newGETPASSCODE}
                                        tabIndex={45}
                                        disabledFeild = {!isEditing && addOneButtonEnabled}
                                    />
                                     <label htmlFor="GetpassGstStateCode" >
                            GetpassGstStateCode
                                </label>
                                <GSTStateMasterHelp
                                    Name = "GetpassGstStateCode"
                                    onAcCodeClick={handleGetpassGstStateCode}
                                    CategoryName={tenderDetails.buyerpartystatename||lblgetpassstatename}
                                    GstStateCode={tenderDetails.buyerpartygststatecode||newGetpassGstStateCode}
                                    tabIndex={99}
                                    disabledFeild = {!isEditing && addOneButtonEnabled}
                                />
                                <label htmlFor="itemcode" >
                                Itemcode
                                    </label>
                                    <SystemHelpMaster
                                                    onAcCodeClick={handleItemSelect}
                                                    CategoryName={ChangeData.itemname||lblitemname}
                                                    CategoryCode={ChangeData.itemcode||newitemcode}
                                                    name="Item_Select"
                                                    tabIndexHelp={3}
                                                    SystemType="I"
                                                    className="account-master-help"
                                                    disabledFeild = {!isEditing && addOneButtonEnabled}
                                                />
                                     <label htmlFor="brandcode" >
                                        Brandcode
                                            </label>
                                            <SystemHelpMaster
                                                Name = "brandcode"
                                                onAcCodeClick={handlebrandcode}
                                                CategoryName={lblbrandname}
                                                CategoryCode={newbrandcode}
                                                tabIndex={142}
                                                SystemType="I"
                                                disabledFeild = {!isEditing && addOneButtonEnabled}
                                            />
                                        </div>
                                            <div className="form-group">
                                            <label htmlFor="voucher_by" >
                                    Voucher By </label>
                                        <AccountMasterHelp
                                            Name = "voucher_by"
                                            onAcCodeClick={handlevoucher_by}
                                            CategoryName={ChangeData.buyername||lblvoucherByname|| ChangeData.Unitname}
                                            CategoryCode={ChangeData.Buyer||newvoucher_by|| ChangeData.Unitcode}
                                            tabIndex={17}
                                            disabledFeild = {!isEditing && addOneButtonEnabled}
                                        />
                                            <label htmlFor="VoucherbyGstStateCode" >
                                VoucherbyGstStateCode
                                    </label>
                                    <GSTStateMasterHelp
                                        Name = "VoucherbyGstStateCode"
                                        onAcCodeClick={handleVoucherbyGstStateCode}
                                        CategoryName={ChangeData.buyerpartystatename||lblvoucherBystatename}
                                        GstStateCode={ChangeData.buyerpartygststatecode||newVoucherbyGstStateCode}
                                        tabIndex={100}
                                        disabledFeild = {!isEditing && addOneButtonEnabled}
                                    />
                                    </div>
                                    <div className="form-group">
                                     <label htmlFor="SaleBillTo" >
                                SaleBillTo
                            </label>
                            <AccountMasterHelp
                                Name = "SaleBillTo"
                                onAcCodeClick={handleSaleBillTo}
                                CategoryName={ChangeData.buyername||lblsalebilltoname||ChangeData.partyName}
                                CategoryCode={ChangeData.Buyer||newSaleBillTo|| ChangeData.Ac_Code}
                                tabIndex={94}
                                disabledFeild = {!isEditing && addOneButtonEnabled}
                            />
                              <label htmlFor="SalebilltoGstStateCode" >
                                    SalebilltoGstStateCode
                                        </label>
                                        <GSTStateMasterHelp
                                            Name = "SalebilltoGstStateCode"
                                            onAcCodeClick={handleSalebilltoGstStateCode}
                                            CategoryName={ChangeData.buyerpartystatename||lblBilltostatename}
                                            GstStateCode={ChangeData.buyerpartygststatecode||newSalebilltoGstStateCode}
                                            tabIndex={101}
                                            disabledFeild = {!isEditing && addOneButtonEnabled}
                                        />
                                        </div>
                                        <div className="form-group">
                                        <label htmlFor="grade">Grade:</label>
                                    <input
                                        type="text"
                                        id = "grade"
                                        Name = "grade"
                                        value={formData.grade}
                                        onChange={handleChange}
                                        disabled={!isEditing && addOneButtonEnabled}
                              />
                        <label htmlFor="quantal">Quantal:</label>
                        <input
                            type="text"
                            id = "quantal"
                            Name = "quantal"
                            value={formData.quantal}
                            onChange={handleChange}
                            disabled={!isEditing && addOneButtonEnabled}
                        />
                        <label htmlFor="packing">Packing:</label>
                        <input
                            type="text"
                            id = "packing"
                            Name = "packing"
                            value={formData.packing}
                            onChange={handleChange}
                            disabled={!isEditing && addOneButtonEnabled}
                        />
                        <label htmlFor="bags">Bags:</label>
                        <input
                            type="text"
                            id = "bags"
                            Name = "bags"
                            value={formData.bags}
                            onChange={handleChange}
                            disabled={!isEditing && addOneButtonEnabled}
                        />
                        <label htmlFor="excise_rate">Excise_rate:</label>
                                <input
                                    type="text"
                                    id = "excise_rate"
                                    Name = "excise_rate"
                                    value={formData.excise_rate || ChangeData.excise_rate}
                                    onChange={handleChange}
                                    disabled={!isEditing && addOneButtonEnabled}
                                />
                                 <label htmlFor="final_amout">Mill Amount:</label>
                                <input
                                    type="text"
                                    id = "final_amout"
                                    Name = "final_amout"
                                    value={formData.final_amout}
                                    onChange={handleChange}
                                    disabled={!isEditing && addOneButtonEnabled}
                                />
                               
                                <label htmlFor="mill_rate">Mill Rate:</label>
                                <input
                                    type="text"
                                    id = "mill_rate"
                                    Name = "mill_rate"
                                    value={formData.mill_rate}
                                    onChange={handleChange}
                                    disabled={!isEditing && addOneButtonEnabled}
                                />
                        <label htmlFor="sale_rate">Sale Rate:</label>
                        <input
                            type="text"
                            id = "sale_rate"
                            Name = "sale_rate"
                            value={formData.sale_rate}
                            onChange={handleChange}
                            disabled={!isEditing && addOneButtonEnabled}
                        />
                          <label htmlFor="PurchaseRate">PurchaseRate:</label>
                                    <input
                                    type="text"
                                    id = "PurchaseRate"
                                    Name = "PurchaseRate"
                                    value={formData.PurchaseRate}
                                    onChange={handleChange}
                                    disabled={!isEditing && addOneButtonEnabled}
                                />
                                 </div>
                                 
                                <div className="form-group">
                        <label htmlFor="Tender_Commission">Commision:</label>
                        <input
                            type="text"
                            id = "Tender_Commission"
                            Name = "Tender_Commission"
                            value={formData.Tender_Commission}
                            onChange={handleChange}
                            disabled={!isEditing && addOneButtonEnabled}
                        />
                        <label htmlFor="diff_rate">Diff Rate:</label>
                        <input
                            type="text"
                            id = "diff_rate"
                            Name = "diff_rate"
                            value={formData.diff_rate}
                            onChange={handleChange}
                            disabled={!isEditing && addOneButtonEnabled}
                        />
                        
                         <label htmlFor="Insurance">Insurance:</label>
                                <input
                                    type="text"
                                    id = "Insurance"
                                    Name = "Insurance"
                                    value={formData.Insurance}
                                    onChange={handleChange}
                                    disabled={!isEditing && addOneButtonEnabled}
                                />
                                <label htmlFor="TCS_Rate">Purchase TCS Rate:</label>
                        <input
                            type="text"
                            id = "TCS_Rate"
                            Name = "TCS_Rate"
                            value={formData.TCS_Rate}
                            onChange={handleChange}
                            disabled={!isEditing && addOneButtonEnabled}
                        />
                        <label htmlFor="Sale_TCS_Rate">Sale TCS Rate:</label>
                        <input
                            type="text"
                            id = "Sale_TCS_Rate"
                            Name = "Sale_TCS_Rate"
                            value={formData.Sale_TCS_Rate}
                            onChange={handleChange}
                            disabled={!isEditing && addOneButtonEnabled}
                        />
                        <label htmlFor="SaleTDSRate">SaleTDSRate:</label>
                                <input
                                    type="text"
                                    id = "SaleTDSRate"
                                    Name = "SaleTDSRate"
                                    value={formData.SaleTDSRate}
                                    onChange={handleChange}
                                    disabled={!isEditing && addOneButtonEnabled}
                                />
                                <label htmlFor="PurchaseTDSRate">PurchaseTDSRate:</label>
                                <input
                                    type="text"
                                    id = "PurchaseTDSRate"
                                    Name = "PurchaseTDSRate"
                                    value={formData.PurchaseTDSRate}
                                    onChange={handleChange}
                                    disabled={!isEditing && addOneButtonEnabled}
                                />
                        <label htmlFor="amount">Amount:</label>
                        <input
                            type="text"
                            id = "amount"
                            Name = "amount"
                            value={formData.amount}
                            onChange={handleChange}
                            disabled={!isEditing && addOneButtonEnabled}
                        />
                         <label htmlFor="Mill_AmtWO_TCS">Mill AmtWO TCS:</label>
                        <input
                            type="text"
                            id = "Mill_AmtWO_TCS"
                            Name = "Mill_AmtWO_TCS"
                            value={formData.Mill_AmtWO_TCS}
                            onChange={handleChange}
                            disabled={!isEditing && addOneButtonEnabled}
                        />
                        </div>
                        
                           <div className="form-group">
                                
                                <label htmlFor="truck_no">Truck No:</label>
                                <input
                                    type="text"
                                    id = "truck_no"
                                    Name = "truck_no"
                                    value={formData.truck_no}
                                    onChange={handleChange}
                                    disabled={!isEditing && addOneButtonEnabled}
                                />
                                <label htmlFor="driver_no">Driver Mob no:</label>
                                <input
                                    type="text"
                                    id = "driver_no"
                                    Name = "driver_no"
                                    value={formData.driver_no}
                                    onChange={handleChange}
                                    disabled={!isEditing && addOneButtonEnabled}
                                />
                               <label htmlFor="transport" >
                                            Transport
                                        </label>
                                        <AccountMasterHelp
                                            Name = "transport"
                                            onAcCodeClick={handletransport}
                                            CategoryName={lbltransportname}
                                            CategoryCode={newtransport}
                                            tabIndex={27}
                                            disabledFeild = {!isEditing && addOneButtonEnabled}
                                        />
                                  <label htmlFor="Pan_No">Pan No</label>
                                <input
                                    type="text"
                                    id = "Pan_No"
                                    Name = "Pan_No"
                                    value={formData.Pan_No}
                                    onChange={handleChange}
                                    disabled={!isEditing && addOneButtonEnabled}
                                />      
                                 <label htmlFor="TransportGSTStateCode" >
                                TransportGSTStateCode
                                    </label>
                                    <GSTStateMasterHelp
                                        Name = "TransportGSTStateCode"
                                        onAcCodeClick={handleTransportGSTStateCode}
                                        CategoryName={lbltransportstatename}
                                        GstStateCode={newTransportGSTStateCode}
                                        tabIndex={107}
                                        disabledFeild = {!isEditing && addOneButtonEnabled}
                                    />
                                </div>
                              
                               <div className="form-group">
                               <label htmlFor="diff_amount">Diff Amount:</label>
                        <input
                            type="text"
                            id = "diff_amount"
                            Name = "diff_amount"
                            value={formData.diff_amount}
                            onChange={handleChange}
                            disabled={!isEditing && addOneButtonEnabled}
                        />
                         <label htmlFor="FreightPerQtl">Frieght:</label>
                        <input
                            type="text"
                            id = "FreightPerQtl"
                            Name = "FreightPerQtl"
                            value={formData.FreightPerQtl}
                            onChange={handleChange}
                            disabled={!isEditing && addOneButtonEnabled}
                        />
                        <label htmlFor="Freight_Amount">Freight Amount:</label>
                        <input
                            type="text"
                            id = "Freight_Amount"
                            Name = "Freight_Amount"
                            value={formData.Freight_Amount}
                            onChange={handleChange}
                            disabled={!isEditing && addOneButtonEnabled}
                        />
                        
                        <label htmlFor="MM_CC">MM_Rate:</label>
                        <select
                            id="MM_CC"
                            name="MM_CC"
                            value={formData.EWayBillChk}
                            onChange={handleChange}
                            disabled={!isEditing && addOneButtonEnabled}
                        >
                           
                            <option value="Credit">Credit</option>
                            <option value="Cash">Cash</option>
                        </select>
                           
                        <input
                            type="text"
                            id = "MM_Rate"
                            Name = "MM_Rate"
                            value={formData.MM_Rate}
                            onChange={handleChange}
                            disabled={!isEditing && addOneButtonEnabled}
                        />
                         <input
                            type="text"
                            id = "Memo_Advance"
                            Name = "Memo_Advance"
                            value={formData.Memo_Advance}
                            onChange={handleChange}
                            disabled={!isEditing && addOneButtonEnabled}
                        />
                         <label htmlFor="MemoGSTRate">MemoGSTRate Code:</label>
                                <GSTRateMasterHelp
                                    Name = "MemoGSTRate"
                                    onAcCodeClick={handleMemoGSTRate}
                                    GstRateName={lblMemoGSTRatename}
                                    GstRateCode={newMemoGSTRate}
                                    tabIndex={145}
                                    disabledFeild = {!isEditing && addOneButtonEnabled}
                                />
                                <label htmlFor="RCMNumber">RCMNumber:</label>
                                <input
                                    type="text"
                                    id = "RCMNumber"
                                    Name = "RCMNumber"
                                    value={formData.RCMNumber}
                                    onChange={handleChange}
                                    disabled={!isEditing && addOneButtonEnabled}
                                />
                                </div>
                                <div className="form-group">
                                    
                            <label htmlFor="TDSAc" >
                            TDSAc
                                </label>
                                <AccountMasterHelp
                                    Name = "TDSAc"
                                    onAcCodeClick={handleTDSAc}
                                    CategoryName={lbltdsacname}
                                    CategoryCode={newTDSAc}
                                    tabIndex={145}
                                    disabledFeild = {!isEditing && addOneButtonEnabled}
                                />
                       
                                <label htmlFor="TDSRate">TDSRate:</label>
                                <input
                                    type="text"
                                    id = "TDSRate"
                                    Name = "TDSRate"
                                    value={formData.TDSRate}
                                    onChange={handleChange}
                                    disabled={!isEditing && addOneButtonEnabled}
                                />
                                <input
                                    type="text"
                                    id = "TDSAmt"
                                    Name = "TDSAmt"
                                    value={formData.TDSAmt}
                                    onChange={handleChange}
                                    disabled={!isEditing && addOneButtonEnabled}
                                />
                                <label htmlFor="TDSCut">Tds cut:</label>
                                <input
                                    type="checkbox"
                                    id = "TDSCut"
                                    Name = "TDSCut"
                                    value={formData.TDSCut}
                                    onChange={handleChange}
                                    disabled={!isEditing && addOneButtonEnabled}
                                />
                                 <label htmlFor="Cash_diff">BP:</label>
                                    <input
                                        type="text"
                                        id = "Cash_diff"
                                        Name = "Cash_diff"
                                        value={formData.Cash_diff}
                                        onChange={handleChange}
                                        disabled={!isEditing && addOneButtonEnabled}
                                    />
                                    <label htmlFor="CashDiffAc" >
                                    B.P Ac
                                        </label>
                                        <AccountMasterHelp
                                            Name = "CashDiffAc"
                                            onAcCodeClick={handleCashDiffAc}
                                            CategoryName={tenderDetails.buyername||lblcashdiffacname}
                                            CategoryCode={tenderDetails.Buyer|| newCashDiffAc}
                                            tabIndex={144}
                                            disabledFeild = {!isEditing && addOneButtonEnabled}
                                        />
                                </div>
                                <div className="form-group">
                                <label htmlFor="vasuli_rate">Vasuli:</label>
                        <input
                            type="text"
                            id = "vasuli_rate"
                            Name = "vasuli_rate"
                            value={formData.vasuli_rate}
                            onChange={handleChange}
                            disabled={!isEditing && addOneButtonEnabled}
                        />
                        <input
                            type="text"
                            id = "vasuli_amount"
                            Name = "vasuli_amount"
                            value={formData.vasuli_amount}
                            onChange={handleChange}
                            disabled={!isEditing && addOneButtonEnabled}
                        />
                            <label htmlFor="vasuli_rate1">vasuli_rate1:</label>
                        <input
                            type="text"
                            id = "vasuli_rate1"
                            Name = "vasuli_rate1"
                            value={formData.vasuli_rate1}
                            onChange={handleChange}
                            disabled={!isEditing && addOneButtonEnabled}
                        />
                      
                        <input
                            type="text"
                            id = "vasuli_amount1"
                            Name = "vasuli_amount1"
                            value={formData.vasuli_amount1}
                            onChange={handleChange}
                            disabled={!isEditing && addOneButtonEnabled}
                        />
                          <label htmlFor="Vasuli_Ac" >
                            Vasuli Ac
                                </label>
                                <AccountMasterHelp
                                    Name = "Vasuli_Ac"
                                    onAcCodeClick={handleVasuli_Ac}
                                    CategoryName={lblvasuliacname}
                                    CategoryCode={newVasuli_Ac}
                                    tabIndex={96}
                                    disabledFeild = {!isEditing && addOneButtonEnabled}
                                />
                                 <label htmlFor="DO" >
                                DO
                            </label>
                            <AccountMasterHelp
                                Name = "DO"
                                onAcCodeClick={handleDO}
                                CategoryName={tenderDetails.tenderdoname||lblDoname}
                                CategoryCode={tenderDetails.Tender_DO||newDO}
                                tabIndex={16}
                                disabledFeild = {!isEditing && addOneButtonEnabled}
                            />
                                </div>
                               <div className="form-group">
                              
                             <label htmlFor="MillEwayBill">MillEwayBill:</label>
                                <input
                                    type="text"
                                    id = "MillEwayBill"
                                    Name = "MillEwayBill"
                                    value={formData.MillEwayBill}
                                    onChange={handleChange}
                                    disabled={!isEditing && addOneButtonEnabled}
                                />
                                 
                                    <input
                                        type="text"
                                        id = "MillInvoiceNo"
                                        Name = "MillInvoiceNo"
                                        value={formData.MillInvoiceNo}
                                        onChange={handleChange}
                                        disabled={!isEditing && addOneButtonEnabled}
                                    />
                                    <label htmlFor="mill_inv_date">Mill inv date:</label>
                                    <input
                                        type="date"
                                        id = "mill_inv_date"
                                        Name = "mill_inv_date"
                                        value={formData.mill_inv_date}
                                        onChange={handleChange}
                                        disabled={!isEditing && addOneButtonEnabled}
                                    />
                                     
                                    <input
                                        type="checkbox"
                                        id = "EWayBillChk"
                                        Name = "EWayBillChk"
                                        value={formData.EWayBillChk}
                                        onChange={handleChange}
                                        disabled={!isEditing && addOneButtonEnabled}
                                    />
                                    <label htmlFor="EWay_Bill_No">EWay_Bill_No:</label>
                                    <input
                                        type="text"
                                        id = "EWay_Bill_No"
                                        Name = "EWay_Bill_No"
                                        value={formData.EWay_Bill_No}
                                        onChange={handleChange}
                                        disabled={!isEditing && addOneButtonEnabled}
                                    />
                                  
                                    <label htmlFor="EwayBillValidDate">EwayBillValidDate:</label>
                                <input
                                    type="date"
                                    id = "EwayBillValidDate"
                                    Name = "EwayBillValidDate"
                                    value={formData.EwayBillValidDate}
                                    onChange={handleChange}
                                    disabled={!isEditing && addOneButtonEnabled}
                                />
                        </div>
                       
                                       <div className="form-group">
                                       <label htmlFor="broker" >
                                                Broker
                                            </label>
                                            <AccountMasterHelp
                                                Name = "broker"
                                                onAcCodeClick={handlebroker}
                                                CategoryName={tenderDetails.buyerpartyname||lblbrokername||Carporateno.BrokerName}
                                                CategoryCode={tenderDetails.Buyer_Party||newbroker|| Carporateno.BrokerCode}
                                                tabIndex={18}
                                                disabledFeild = {!isEditing && addOneButtonEnabled}
                                            />
                                    <label htmlFor="Distance">Distance:</label>
                                    <input
                                        type="text"
                                        id = "Distance"
                                        Name = "Distance"
                                        value={formData.Distance}
                                        onChange={handleChange}
                                        disabled={!isEditing && addOneButtonEnabled}
                                    />
                                    <label htmlFor="mill_rcv">Invoice checked:</label>
                                    <input
                                        type="checkbox"
                                        id = "mill_rcv"
                                        Name = "mill_rcv"
                                        value={formData.mill_rcv}
                                        onChange={handleChange}
                                        disabled={!isEditing && addOneButtonEnabled}
                                    />
                                     <label htmlFor="SB_Other_Amount">SB Other Amount:</label>
                                    <input
                                        type="text"
                                        id = "SB_Other_Amount"
                                        Name = "SB_Other_Amount"
                                        value={formData.SB_Other_Amount}
                                        onChange={handleChange}
                                        disabled={!isEditing && addOneButtonEnabled}
                                    />
                      </div>
                     <div className="form-group">
                     <label htmlFor="narration1">UTR Narration:</label>
                                <input
                                    type="text"
                                    id = "narration1"
                                    Name = "narration1"
                                    value={formData.narration1}
                                    onChange={handleChange}
                                    disabled={!isEditing && addOneButtonEnabled}
                                />
                                <label htmlFor="narration2">B.P Narration:</label>
                                <input
                                    type="text"
                                    id = "narration2"
                                    Name = "narration2"
                                    value={formData.narration2}
                                    onChange={handleChange}
                                    disabled={!isEditing && addOneButtonEnabled}
                                />
                                <label htmlFor="narration3">DO Narration:</label>
                                <input
                                    type="text"
                                    id = "narration3"
                                    Name = "narration3"
                                    value={formData.narration3}
                                    onChange={handleChange}
                                    disabled={!isEditing && addOneButtonEnabled}
                                />
                                <label htmlFor="narration4">Narration4:</label>
                                <input
                                    type="text"
                                    id = "narration4"
                                    Name = "narration4"
                                    value={formData.narration4}
                                    onChange={handleChange}
                                    disabled={!isEditing && addOneButtonEnabled}
                                />
                                <label htmlFor="narration5">Frieght Narration:</label>
                                <input
                                    type="text"
                                    id = "narration5"
                                    Name = "narration5"
                                    value={formData.narration5}
                                    onChange={handleChange}
                                    disabled={!isEditing && addOneButtonEnabled}
                                />
                                 <label htmlFor="SBNarration">SBNarration:</label>
                                <input
                                    type="text"
                                    id = "SBNarration"
                                    Name = "SBNarration"
                                    value={formData.SBNarration}
                                    onChange={handleChange}
                                    disabled={!isEditing && addOneButtonEnabled}
                                />
                                
                      
                       </div>
                               <div className="form-group">
                               
                                <label htmlFor="MailSend">mail send:</label>
                                <label id="lblMailsend"></label>
                               
                                </div>
    </form>
        </div>
        {isLoading && (
                    <div className="loading-overlay">
                        <div className="spinner-container">
                            <HashLoader color="#007bff" loading={isLoading} size={80} />
                        </div>
                    </div>
                )}
        {/*detail part popup functionality and Validation part Grid view */}
        <div className="container mt-4">
                    <button
                        className="btn btn-primary"
                        onClick={openPopup}
                        disabled={!isEditing}
                        tabIndex="16"
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                openPopup();
                            }
                        }}
                    >
                        Add
                    </button>
                    <button
                        className="btn btn-danger"
                        disabled={!isEditing}
                        style={{ marginLeft: "10px" }}
                        tabIndex="17"
                    >
                        Close
                    </button>
                    {showPopup && (
                        <div
                            className="modal"
                            role="dialog"
                            style={{ display: "block" }}
                        >
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">
                                            {selectedUser.id ? "Edit User" : "Add User"}
                                        </h5>
                                        <button
                                            type="button"
                                            onClick={closePopup}
                                            aria-label="Close"
                                            style={{ marginLeft: "80%", width: "60px", height: "30px" }}
                                        >
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <label className="debitCreditNote-form-label">
                                                DD_Type:
                                            </label>
                                            <div className="debitCreditNote-col-Ewaybillno">
                                                <div className="debitCreditNote-form-group">
                                                <select
                                                    id="ddType"
                                                    name="ddType"
                                                    value={formDataDetail.ddType}
                                                    onChange={handleChangeDetail}
                                                    disabled={!isEditing && addOneButtonEnabled}
                                                >
                                                    <option value="T">Transfer Letter</option>
                                                    <option value="D">Demand Draft</option>
                                                </select>
                                                </div>
                                            </div>
                                            <label className="debitCreditNote-form-label">
                                            Bank_Code
                                            </label>
                                            <div className="debitCreditNote-col-Ewaybillno">
                                                <div className="debitCreditNote-form-group">
                                                <AccountMasterHelp
                                                    onAcCodeClick={handleBankCode}
                                                    CategoryName={tenderDetails.paymenttoname||bankcodeacname}
                                                    CategoryCode={tenderDetails.Payment_To||bankcode}
                                                    name="Bank_Code"
                                                    tabIndexHelp={2}
                                                    disabledFeild={!isEditing && addOneButtonEnabled}
                                                />
                                                </div>
                                            </div>
                                            
                                            <label className="debitCreditNote-form-label">
                                            Narration
                                            </label>
                                            <div className="debitCreditNote-col-Ewaybillno">
                                                <div className="debitCreditNote-form-group">
                                                <input
                                                    type="text"
                                                    className="debitCreditNote-form-control"
                                                    id="Narration"
                                                    name="Narration"
                                                    value={formDataDetail.Narration}
                                                    onChange={handleChangeDetail}
                                                    disabled={!isEditing && addOneButtonEnabled}
                                                />
                                                </div>
                                            </div>
                                            <label className="debitCreditNote-form-label">
                                            Amount
                                            </label>
                                            <div className="debitCreditNote-col-Ewaybillno">
                                                <div className="debitCreditNote-form-group">
                                                <input
                                                    type="text"
                                                    className="debitCreditNote-form-control"
                                                    id="Amount"
                                                    name="Amount"
                                                    value={formDataDetail.Amount}
                                                    onChange={handleChangeDetail}
                                                    disabled={!isEditing && addOneButtonEnabled}
                                                />
                                                </div>
                                            </div>
                                            <label className="debitCreditNote-form-label">
                                            UTR_NO
                                            </label>
                                            <div className="debitCreditNote-col-Ewaybillno">
                                                <div className="debitCreditNote-form-group">
                                                <input
                                                    type="text"
                                                    className="debitCreditNote-form-control"
                                                    id="UTR_NO"
                                                    name="UTR_NO"
                                                    value={formDataDetail.UTR_NO}
                                                    onChange={handleChangeDetail}
                                                    disabled={!isEditing && addOneButtonEnabled}
                                                />
                                                </div>
                                            </div>
                                            <label className="debitCreditNote-form-label">
                                            LTNo
                                            </label>
                                            <div className="debitCreditNote-col-Ewaybillno">
                                                <div className="debitCreditNote-form-group">
                                                <input
                                                    type="text"
                                                    className="debitCreditNote-form-control"
                                                    id="LTNo"
                                                    name="LTNo"
                                                    value={formDataDetail.LTNo}
                                                    onChange={handleChangeDetail}
                                                    disabled={!isEditing && addOneButtonEnabled}
                                                />
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        {selectedUser.id ? (
                                            <button className="btn btn-primary" onClick={updateUser} onKeyDown={(event) => {
                                                if (event.key === "Enter") {
                                                    updateUser();
                                                }
                                            }}>
                                                Update User
                                            </button>
                                        ) : (
                                            <button className="btn btn-primary" onClick={addUser} onKeyDown={(event) => {
                                                if (event.key === "Enter") {
                                                    addUser();
                                                }
                                            }}>
                                                Add User
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={closePopup}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <table className="table mt-4 table-bordered">
                        <thead>
                            <tr>
                                <th>Actions</th>
                                <th>ID</th>
                                <th>DD Type</th>
                                <th>Bank Code</th>
                                <th>Bank Name</th>
                                <th>Narration</th>
                                <th>Amount</th>
                                <th>Utr No</th>
                                <th>Lot No</th>
                                <th>bc</th>
                                <th>dodetailid</th>
                                <th>Rowaction</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        {user.rowaction === "add" ||
                                            user.rowaction === "update" ||
                                            user.rowaction === "Normal" ? (
                                            <>
                                                <button
                                                    className="btn btn-warning"
                                                    onClick={() => editUser(user)}
                                                    disabled={!isEditing}
                                                    onKeyDown={(event) => {
                                                        if (event.key === "Enter") {
                                                            editUser(user);
                                                        }
                                                    }}
                                                    tabIndex="18"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-danger ms-2"
                                                    onClick={() => deleteModeHandler(user)}
                                                    onKeyDown={(event) => {
                                                        if (event.key === "Enter") {
                                                            deleteModeHandler(user)
                                                        }
                                                    }}
                                                    disabled={!isEditing}
                                                    tabIndex="19"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        ) : user.rowaction === "DNU" ||
                                            user.rowaction === "delete" ? (
                                            <button
                                                className="btn btn-secondary"
                                                onClick={() => openDelete(user)}
                                            >
                                                Open
                                            </button>
                                        ) : null}
                                    </td>
                                    <td>{user.id}</td>
                                    <td>{user.ddType}</td>
                                    <td>{user.Bank_Code || tenderDetails.Payment_To}</td>
                                    <td>{user.bankcodeacname || tenderDetails.paymenttoname }</td>
                                    <td>{user.Narration}</td>
                                    <td>{user.Amount}</td>
                                    <td>{user.UTR_NO}</td>
                                    <td>{user.LTNo}</td>
                                    <td>{user.bc|| tenderDetails.pt}</td>
                                    <td>{user.dodetailid}</td>
                                    <td>{user.rowaction}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <br></br>
                       

        </>    );};export default DeliveryOrder
