import { colors } from "../constants";
import { IElement, IParticipants } from "../interface";
import { stringToHex32 } from "./hex32toa";
//* const notificationtypes = {
//*   Gmail: "Public",
//*   SMS: "Text",
//*   "Home Banking": "Private",
//*   None: "No Email",
//* };
//* const idproviderTypes = {
//*   None: "None",
//*   "Questions Only": "IDology",
//*   "Questions and ID Scan": "eDS_IDTEST",
//*   "ID Scann App": "IDPal",
//* };

const element_types: { [key: string]: number } = {
  SIGNATURE: 0,
  INITIALBOX: 1,
  DATESIGNED: 2,
  TEXTBOX: 3,
  CHECKBOx: 4,
  RADIOBOX: 5,
  MEMO: 8,
  DATEPICKER: 9,
  LIST: 10,
};
export const adaptParticipant = (values: IParticipants, index: number) => {
  const obj = {
    id: values.key - 0,
    signsetid: "",
    color: colors[index % 4],
    name: values.fullname,
    email: values.email,
    authcode: values.auth_code,
    selected: true,
    tier: values.signing_order,
    role: values.display_name,
    verifyrequired: 1,
    idprovider: values.id_check,
    phone: values.text_number,
    notificationtype: values.notification_type,
    notificationaccount: "",
    paymentamount: "",
    paymentmessage: "",
    extramessagetext: "",
    extramessageaction: "Before",
    delegate: values.allow_delegation === "yes",
  };
  return obj;
};

export const adaptSigset = (
  values: IElement,
  maxx: number,
  maxy: number,
  totalPages: number
) => {
  console.log({ values, maxx, maxy, totalPages });
  try {
    const totalY = maxy * totalPages;
    let defaultvalue = "";
    if (values.type === "LIST") {
      const arr = values.options.map((o: any) => {
        return [o.label, o.value];
      });
      const str = JSON.stringify(arr);
      defaultvalue = stringToHex32(str);
    }
    const y = Number.parseInt((values.y % totalY).toFixed(0));
    const obj = {
      x: values.x,
      y: y,
      w: values.width,
      h: values.height,
      xp: (values.x / maxx) * 100,
      yp: (y / maxy) * 100,
      wp: (values.width / maxx) * 100,
      hp: (values.height / maxy) * 100,
      maxt: 0,
      maxl: 0,
      maxx,
      maxy,
      id: values.id,
      type: element_types[values.type],
      page: Math.floor(values.y / totalY),
      docnum: 0,
      font: "Arial",
      fontsize: (values.height / 2).toFixed(0) + "px",
      lineheight: 10,
      fontcolor: "black",
      fieldname: values.name,
      fieldvalue: "",
      fieldlabel: "",
      defaultvalue,
      required: values.required ? "1" : "0",
      checkedvalue: "",
      uncheckedvalue: "",
      depfield: "",
      depfieldvalue: "",
      depoperator: "=",
      signerid: Number.parseInt(values.signer),
    };
    return obj;
  } catch (e) {
    console.log(e);
  }
};
